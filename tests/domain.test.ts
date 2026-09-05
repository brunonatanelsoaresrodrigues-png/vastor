import test from "node:test";
import assert from "node:assert/strict";
import { createSeed, DEMO_DATE } from "@/mocks/seed";
import { productById, products } from "@/mocks/catalog";
import {
  activeEnrollments,
  companyEnrollments,
  companyStats,
  currentPolicy,
  eligibility,
  enrollmentTotals,
  protection,
  reduceDemo,
  retirement,
} from "@/lib/domain";
import { createDossierHtml, createDocumentHtml } from "@/lib/exports";
const at = "2026-08-28T15:00:00Z";
test("a base tem 12 pessoas, 11 contratos ativos e KPIs derivados", () => {
  const s = createSeed(),
    stats = companyStats(s);
  assert.equal(s.people.length, 12);
  assert.equal(stats.active, 11);
  assert.equal(stats.covered, 8);
  assert.equal(stats.percent, 73);
  assert.equal(stats.accepted, 26);
  assert.equal(stats.declined, 16);
  assert.equal(s.decisions.length, 42);
  assert.equal(stats.contracts, 114800);
  assert.equal(stats.platform, 209);
  assert.equal(
    stats.total,
    Math.round((stats.contracts + stats.platform + stats.subsidy) * 100) / 100,
  );
});
test("IDs de eventos, ofertas, adesões e decisões são únicos", () => {
  const s = createSeed();
  for (const records of [s.events, s.offers, s.decisions, s.enrollments, s.documents, s.movements])
    assert.equal(new Set(records.map((x) => x.id)).size, records.length);
});
test("cada decisão referencia uma oferta válida", () => {
  const s = createSeed();
  for (const d of s.decisions) {
    const o = s.offers.find((o) => o.id === d.offerId);
    assert.ok(o);
    assert.equal(o.personId, d.personId);
    assert.equal(o.productId, d.productId);
  }
});
test("aceite cria adesão pendente, reserva e movimento sem ativar cobertura", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, { type: "decide", productId: "renda", choice: "accepted", at });
  assert.equal(s.decisions.length, seed.decisions.length + 1);
  assert.equal(s.enrollments.length, seed.enrollments.length + 1);
  const e = s.enrollments.find((e) => e.productId === "renda" && e.personId === "p1")!;
  assert.equal(e.status, "pending");
  assert.equal(e.subsidy, 41.3);
  assert.equal(activeEnrollments(s, "p1").length, activeEnrollments(seed, "p1").length);
  assert.ok(s.movements.some((m) => m.enrollmentId === e.id && m.status === "Pendente"));
  assert.equal(seed.decisions.length, 42);
});
test("aceite repetido não duplica decisão ou movimentação", () => {
  let s = createSeed();
  const action = { type: "decide", productId: "renda", choice: "accepted", at } as const;
  s = reduceDemo(s, action);
  assert.deepEqual(reduceDemo(s, action), s);
});
test("recusa não cria cobertura, não consome saldo nem altera o contrato", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, { type: "decide", productId: "psicologia", choice: "declined", at });
  assert.equal(companyStats(s).declined, 17);
  assert.deepEqual(s.enrollments, seed.enrollments);
  assert.deepEqual(s.people, seed.people);
  assert.equal(s.events.at(-1)?.type, "RECUSA");
  assert.deepEqual(
    reduceDemo(s, { type: "decide", productId: "psicologia", choice: "declined", at }),
    s,
  );
});
test("o subsídio total não ultrapassa o teto compartilhado", () => {
  let s = createSeed();
  for (const id of ["renda", "psicologia", "wellhub", "farmacia", "juridico", "equipamentos"]) {
    s = reduceDemo(s, { type: "decide", productId: id, choice: "accepted", at });
    assert.ok(enrollmentTotals(companyEnrollments(s, "p1")).subsidy <= 180);
    for (const e of companyEnrollments(s, "p1")) {
      assert.ok(e.subsidy >= 0);
      assert.ok(e.subsidy <= e.price);
    }
  }
});
test("confirmação é idempotente e eleva apenas proteção relevante", () => {
  const seed = createSeed();
  let s = reduceDemo(seed, { type: "decide", productId: "renda", choice: "accepted", at });
  assert.equal(protection(s).score, protection(seed).score);
  const m = s.movements.find((m) => m.personId === "p1" && m.productId === "renda")!;
  s = reduceDemo(s, { type: "confirmMovement", id: m.id, at });
  assert.ok(protection(s).score > protection(seed).score);
  assert.equal(s.events.at(-1)?.type, "ATIVAÇÃO");
  assert.deepEqual(reduceDemo(s, { type: "confirmMovement", id: m.id, at }), s);
});
test("desconto e academia não elevam o Índice de Proteção", () => {
  let s = createSeed();
  const score = protection(s).score;
  s = reduceDemo(s, { type: "decide", productId: "wellhub", choice: "accepted", at });
  const m = s.movements.find((m) => m.personId === "p1" && m.productId === "wellhub")!;
  s = reduceDemo(s, { type: "confirmMovement", id: m.id, at });
  assert.equal(protection(s).score, score);
});
test("100 pontos não geram recomendações contraditórias", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, {
    type: "assessment",
    answers: { saude: 4, renda: 4, vida: 4, aposentadoria: 4, reserva: 4, trabalho: 4 },
  });
  assert.equal(protection(s).score, 100);
  assert.equal(protection(s).weakest.length, 0);
  assert.equal(protection(s).title, "Proteção sólida");
});
test("portabilidade remove subsídio e preserva proteção própria", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, { type: "port", id: "portability-life", continue: true, at });
  const e = s.enrollments.find((e) => e.id === "portability-life")!;
  assert.equal(e.status, "active");
  assert.equal(e.subsidy, 0);
  assert.equal(e.companyId, undefined);
  assert.equal(e.source, "Portado");
  assert.equal(companyStats(seed).subsidy, companyStats(s).subsidy);
  assert.deepEqual(reduceDemo(s, { type: "port", id: e.id, continue: true, at }), s);
});
test("cancelamento de portabilidade só encerra a cobertura selecionada", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, { type: "port", id: "portability-life", continue: false, at });
  assert.equal(s.enrollments.find((e) => e.id === "portability-life")?.status, "cancelled");
  assert.equal(s.enrollments.find((e) => e.id === "enr-p1-vida")?.status, "active");
});
test("nova política preserva versões, ofertas, decisões e valores anteriores", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, {
    type: "policy",
    policy: { cap: 300, participation: 80, minDays: 60, effectiveAt: "2026-09-01", createdAt: at },
  });
  assert.equal(s.policies.length, 4);
  assert.deepEqual(s.policies.slice(0, 3), seed.policies);
  assert.deepEqual(s.offers, seed.offers);
  assert.deepEqual(s.enrollments, seed.enrollments);
  assert.equal(currentPolicy(s, DEMO_DATE)?.version, 3);
  assert.equal(currentPolicy(s, "2026-09-01")?.version, 4);
});
test("elegibilidade explica vínculo, aditivo e dias insuficientes", () => {
  const s = createSeed(),
    p = productById("saude")!;
  assert.equal(eligibility(s, "p1", p).eligible, true);
  assert.equal(eligibility(s, "p11", p).eligible, false);
  assert.equal(eligibility(s, "p8", p).eligible, false);
  assert.equal(eligibility(s, "p1", productById("doencas")!).eligible, false);
  assert.equal(eligibility(s, "p1", p, "2023-01-01").eligible, false);
  assert.equal(eligibility(s, "p11", p).subsidy, 0);
});
test("documento simulado resolve pendência e mantém evento", () => {
  const seed = createSeed();
  const s = reduceDemo(seed, { type: "document", id: "doc-aditivo-p11", at });
  assert.equal(companyStats(s).pending, companyStats(seed).pending - 1);
  assert.equal(s.events.at(-1)?.type, "DOCUMENTO");
  assert.deepEqual(reduceDemo(s, { type: "document", id: "doc-aditivo-p11", at }), s);
});
test("aposentadoria reproduz cenário padrão", () => {
  const r = retirement({ age: 35, retire: 65, income: 8000, contribution: 500 })!;
  assert.equal(Math.round(r.capital), 342635);
  assert.equal(Math.round(r.total), 3416);
  assert.equal(Math.round(r.replacement!), 43);
  assert.equal(r.points.length, 31);
});
test("faturamento zero não vira renda de oito mil", () => {
  const r = retirement({ age: 35, retire: 65, income: 0, contribution: 500 })!;
  assert.equal(r.replacement, null);
  assert.ok(r.capital > 0);
});
test("simulação rejeita entradas inválidas e aceita aporte zero", () => {
  assert.equal(retirement({ age: 17, retire: 65, income: 8000, contribution: 500 }), null);
  assert.equal(retirement({ age: 35, retire: 65, income: -100, contribution: 500 }), null);
  assert.equal(retirement({ age: 35, retire: 65, income: 8000, contribution: NaN }), null);
  assert.equal(retirement({ age: 35, retire: 65, income: 8000, contribution: 0 })?.capital, 0);
  assert.equal(retirement({ age: 70, retire: 65, income: 8000, contribution: 500 })?.years, 0);
});
test("dossiê contém trilha completa, avisos e não contém respostas privadas", () => {
  const s = createSeed();
  const html = createDossierHtml(s, "p1");
  assert.ok(html.includes("Dossiê de autonomia"));
  assert.ok(html.includes("DEMONSTRAÇÃO"));
  assert.ok(html.includes("Trilha de eventos"));
  assert.ok(html.includes("Recusa"));
  assert.ok(!html.includes("external-health"));
  assert.ok(!html.includes("portability-life"));
  assert.ok(!html.includes("reserva:2"));
  const all = createDossierHtml(s);
  for (const p of s.people) assert.ok(all.includes(p.name));
});
test("exportação escapa texto dinâmico", () => {
  const html = createDocumentHtml("<script>alert(1)</script>", "<img src=x onerror=alert(1)>");
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;script&gt;"));
});
test("catálogo tem todos os grupos e ao menos 20 produtos", () => {
  assert.ok(products.length >= 20);
  assert.equal(new Set(products.map((p) => p.category)).size, 7);
});
test("serialização preserva o estado compartilhado", () => {
  let s = createSeed();
  s = reduceDemo(s, { type: "decide", productId: "renda", choice: "accepted", at });
  assert.deepEqual(JSON.parse(JSON.stringify(s)), s);
});
