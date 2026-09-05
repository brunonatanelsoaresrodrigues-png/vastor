import type { DemoState, Event, Product, SubsidyPolicy, Enrollment } from "@/types";
import { DEMO_DATE, questions } from "@/mocks/seed";
import { productById } from "@/mocks/catalog";
export const roundMoney = (n: number) => Math.round(n * 100) / 100;
export const currentPolicy = (s: DemoState, date = DEMO_DATE) =>
  [...s.policies]
    .filter((p) => p.effectiveAt <= date)
    .sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt) || b.version - a.version)[0];
export const activeEnrollments = (s: DemoState, personId?: string) =>
  s.enrollments.filter((e) => e.status === "active" && (!personId || e.personId === personId));
export const companyEnrollments = (s: DemoState, personId?: string) =>
  s.enrollments.filter(
    (e) =>
      e.companyId === "vetor" &&
      (e.status === "active" || e.status === "pending") &&
      (!personId || e.personId === personId),
  );
export function eligibility(s: DemoState, personId: string, p: Product, date = DEMO_DATE) {
  const person = s.people.find((x) => x.id === personId),
    policy = currentPolicy(s, date);
  const reasons: string[] = [];
  if (!person || !policy)
    return {
      eligible: false,
      reasons: ["Pessoa ou política não disponível nesta data."],
      subsidy: 0,
      finalPrice: p.price,
      days: 0,
      version: 0,
    };
  const days = Math.floor(
    (Date.parse(date + "T12:00:00Z") - Date.parse(person.startedAt + "T12:00:00Z")) / 86400000,
  );
  const activeAtDate = person.startedAt <= date && (!person.endedAt || person.endedAt > date);
  if (!activeAtDate) reasons.push("Contrato de prestação não está ativo nesta data.");
  if (!person.signed) reasons.push("Aditivo de benefícios ainda não registrado.");
  if (days < Math.max(policy.minDays, p.minDays))
    reasons.push(
      `Tempo de contrato: ${Math.max(0, days)} de ${Math.max(policy.minDays, p.minDays)} dias necessários.`,
    );
  if (person.age < p.minAge || person.age > p.maxAge)
    reasons.push("Faixa etária fora das condições demonstrativas.");
  const used = companyEnrollments(s, personId).reduce((a, e) => a + e.subsidy, 0);
  const subsidy = reasons.length
    ? 0
    : roundMoney(Math.min(Math.max(0, policy.cap - used), (p.price * policy.participation) / 100));
  return {
    eligible: reasons.length === 0,
    reasons: reasons.length
      ? reasons
      : [
          "Contrato ativo e aditivo registrado.",
          `Política v${policy.version} · ${Math.max(policy.minDays, p.minDays)} dias cumpridos.`,
          `Faixa etária elegível · ${person.age} anos.`,
        ],
    subsidy,
    finalPrice: roundMoney(p.price - subsidy),
    days,
    version: policy.version,
  };
}
export function companyStats(s: DemoState) {
  const active = s.people.filter((p) => p.active);
  const en = companyEnrollments(s);
  const covered = active.filter((p) =>
    en.some((e) => e.personId === p.id && e.status === "active"),
  ).length;
  const subsidy = roundMoney(en.reduce((a, e) => a + e.subsidy, 0));
  const contracts = active.reduce((a, p) => a + p.contract, 0),
    platform = active.length * 19;
  return {
    active: active.length,
    covered,
    percent: active.length ? Math.round((covered / active.length) * 100) : 0,
    subsidy,
    contracts,
    platform,
    total: roundMoney(contracts + platform + subsidy),
    pending: s.people.filter((p) => !p.signed).length,
    accepted: s.decisions.filter((d) => d.choice === "accepted").length,
    declined: s.decisions.filter((d) => d.choice === "declined").length,
  };
}
export function protection(s: DemoState) {
  const pillars = questions.map((q) => {
    const declared = (s.answers[q.id] ?? 0) * 25;
    const related = activeEnrollments(s, "p1")
      .map((e) => productById(e.productId))
      .filter((p) => p?.pillar === q.id);
    const verified = Math.max(0, ...related.map((p) => p?.protectionLevel ?? 0));
    return { id: q.id, label: q.label, score: Math.min(100, Math.max(declared, verified)) };
  });
  const score = Math.round(pillars.reduce((a, p) => a + p.score, 0) / pillars.length);
  const weakest = [...pillars].sort((a, b) => a.score - b.score).filter((p) => p.score < 75);
  return {
    pillars,
    score,
    weakest,
    title:
      score >= 80 && weakest.length === 0
        ? "Proteção sólida"
        : score >= 40
          ? "Proteção intermediária"
          : "Atenção às lacunas",
  };
}
export function retirement(input: {
  age: number;
  retire: number;
  income: number;
  contribution: number;
}) {
  if (
    !Number.isFinite(input.age) ||
    input.age < 18 ||
    input.age > 80 ||
    !Number.isFinite(input.income) ||
    input.income < 0 ||
    !Number.isFinite(input.contribution) ||
    input.contribution < 0 ||
    input.contribution > 5000
  )
    return null;
  const years = Math.max(0, input.retire - input.age),
    monthly = Math.pow(1.04, 1 / 12) - 1;
  const points = Array.from({ length: years + 1 }, (_, year) => ({
    year: input.age + year,
    capital: roundMoney((input.contribution * (Math.pow(1 + monthly, year * 12) - 1)) / monthly),
    saved: input.contribution * year * 12,
  }));
  const capital = points.at(-1)!.capital;
  const payout = (capital * monthly) / (1 - Math.pow(1 + monthly, -300));
  return {
    years,
    capital,
    payout,
    total: 1621 + payout,
    replacement: input.income > 0 ? ((1621 + payout) / input.income) * 100 : null,
    points,
  };
}
export type DemoAction =
  | { type: "decide"; productId: string; choice: "accepted" | "declined"; at: string }
  | { type: "port"; id: string; continue: boolean; at: string }
  | { type: "confirmMovement"; id: string; at: string }
  | { type: "policy"; policy: Omit<SubsidyPolicy, "version" | "id"> }
  | { type: "assessment"; answers: Record<string, number> }
  | { type: "onboard" }
  | { type: "profile"; profile: DemoState["profile"] }
  | { type: "preferences"; preferences: DemoState["preferences"] }
  | { type: "invite"; name: string; email: string; at: string }
  | { type: "document"; id: string; at: string };
function addEvent(s: DemoState, e: Omit<Event, "id" | "hash">) {
  const n = s.events.length + 1;
  s.events.push({
    ...e,
    id: `evt_demo_${String(n).padStart(5, "0")}`,
    hash: `demo:${String(n).padStart(8, "0")}`,
  });
}
export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  const s = structuredClone(state);
  if (action.type === "assessment") {
    s.answers = action.answers;
    s.assessmentCompleted = true;
    return s;
  }
  if (action.type === "onboard") {
    s.onboarded = true;
    return s;
  }
  if (action.type === "profile") {
    s.profile = action.profile;
    s.people[0].name = action.profile.name;
    s.people[0].occupation = action.profile.occupation;
    return s;
  }
  if (action.type === "preferences") {
    s.preferences = action.preferences;
    return s;
  }
  if (action.type === "decide") {
    const p = productById(action.productId);
    if (!p) return state;
    const offer = s.offers.find(
      (o) =>
        o.personId === "p1" && o.productId === p.id && !s.decisions.some((d) => d.offerId === o.id),
    );
    if (
      s.enrollments.some(
        (e) =>
          e.personId === "p1" &&
          e.productId === p.id &&
          e.companyId === "vetor" &&
          (e.status === "active" || e.status === "pending"),
      )
    )
      return state;
    if (!offer && s.decisions.some((d) => d.personId === "p1" && d.productId === p.id))
      return state;
    const eligible = eligibility(s, "p1", p);
    if (action.choice === "accepted" && !eligible.eligible) return state;
    const selected = offer ?? {
      id: `offer-demo-${s.offers.length + 1}`,
      personId: "p1",
      productId: p.id,
      companyId: "vetor",
      createdAt: action.at,
      price: p.price,
      subsidy: eligible.subsidy,
      policyVersion: eligible.version,
    };
    if (!offer) {
      s.offers.push(selected);
      addEvent(s, {
        personId: "p1",
        type: "OFERTA",
        title: `${p.name}: oferta apresentada`,
        detail: `Preço R$ ${p.price}. Política v${eligible.version}.`,
        actor: "Vastor Capital · simulação",
        entity: selected.id,
        version: eligible.version,
        at: action.at,
      });
    }
    s.decisions.push({
      id: `dec-demo-${s.decisions.length + 1}`,
      offerId: selected.id,
      personId: "p1",
      productId: p.id,
      choice: action.choice,
      at: action.at,
    });
    addEvent(s, {
      personId: "p1",
      type: action.choice === "accepted" ? "ACEITE" : "RECUSA",
      title: `${p.name} ${action.choice === "accepted" ? "aceito" : "recusado"}`,
      detail:
        "Decisão facultativa, sem alteração do contrato de prestação. Registro demonstrativo.",
      actor: s.profile.name,
      entity: selected.id,
      version: selected.policyVersion,
      at: action.at,
    });
    if (action.choice === "accepted") {
      const subsidy = Math.min(selected.subsidy, eligible.subsidy);
      const id = `enr-demo-${s.enrollments.length + 1}`;
      s.enrollments.push({
        id,
        personId: "p1",
        productId: p.id,
        companyId: "vetor",
        source: "Vastor Capital",
        status: "pending",
        price: selected.price,
        subsidy,
        startedAt: action.at.slice(0, 10),
        policyVersion: selected.policyVersion,
      });
      s.movements.unshift({
        id: `mov-demo-${s.movements.length + 1}`,
        enrollmentId: id,
        personId: "p1",
        productId: p.id,
        operation: "Inclusão",
        at: action.at,
        status: "Pendente",
        attempts: 0,
      });
      addEvent(s, {
        personId: "p1",
        type: "SUBSÍDIO",
        title: `Subsídio reservado para ${p.name}`,
        detail: `R$ ${subsidy.toFixed(2)} por mês, limitado ao saldo da política.`,
        actor: "Motor demonstrativo",
        entity: id,
        version: selected.policyVersion,
        at: action.at,
      });
    }
    return s;
  }
  if (action.type === "port") {
    const e = s.enrollments.find((e) => e.id === action.id);
    if (!e || e.status !== "portability") return state;
    e.status = action.continue ? "active" : "cancelled";
    e.subsidy = 0;
    e.source = "Portado";
    delete e.companyId;
    addEvent(s, {
      personId: e.personId,
      type: action.continue ? "PORTABILIDADE" : "CANCELAMENTO",
      title: action.continue
        ? "Proteção mantida por pagamento próprio"
        : "Cobertura cancelada na demonstração",
      detail:
        "Subsídio da Atlas Digital encerrado. Decisão registrada sem movimentação financeira real.",
      actor: s.profile.name,
      entity: e.id,
      version: e.policyVersion ?? 3,
      at: action.at,
    });
    return s;
  }
  if (action.type === "confirmMovement") {
    const m = s.movements.find((m) => m.id === action.id);
    if (!m || m.status === "Confirmada") return state;
    m.status = "Confirmada";
    m.attempts++;
    m.at = action.at;
    const e = s.enrollments.find((e) => e.id === m.enrollmentId);
    if (e) e.status = "active";
    addEvent(s, {
      personId: m.personId,
      type: "ATIVAÇÃO",
      title: `${productById(m.productId)?.name} ativado`,
      detail: "Confirmação simulada do fornecedor. Nenhuma integração real.",
      actor: "Administrador Vastor Capital",
      entity: m.enrollmentId,
      version: e?.policyVersion ?? 3,
      at: action.at,
    });
    return s;
  }
  if (action.type === "policy") {
    const version = Math.max(...s.policies.map((p) => p.version)) + 1;
    s.policies.push({ ...action.policy, id: `pol-${version}`, version });
    addEvent(s, {
      type: "POLÍTICA",
      title: `Política v${version} criada`,
      detail: `Vigência ${action.policy.effectiveAt}. Versões anteriores preservadas; adesões existentes não são alteradas.`,
      actor: "Vetor Engenharia · demo",
      entity: `pol-${version}`,
      version,
      at: action.policy.createdAt,
    });
    return s;
  }
  if (action.type === "document") {
    const d = s.documents.find((d) => d.id === action.id);
    if (!d || d.status !== "Pendente") return state;
    d.status = "Disponível";
    const person = s.people.find((p) => p.id === d.personId);
    if (person) person.signed = true;
    addEvent(s, {
      personId: d.personId,
      type: "DOCUMENTO",
      title: "Aditivo registrado na demonstração",
      detail: "Simulação administrativa. Não é uma assinatura eletrônica.",
      actor: "Vetor Engenharia · demo",
      entity: d.id,
      version: 3,
      at: action.at,
    });
    return s;
  }
  if (action.type === "invite") {
    addEvent(s, {
      type: "CONVITE",
      title: `Convite demonstrativo: ${action.name}`,
      detail: `Destinatário fictício: ${action.email}. Nenhum e-mail foi enviado.`,
      actor: "Vetor Engenharia · demo",
      entity: `invite-${s.events.length + 1}`,
      version: currentPolicy(s)?.version ?? 3,
      at: action.at,
    });
    return s;
  }
  return state;
}
export function enrollmentTotals(enrollments: Enrollment[]) {
  const total = roundMoney(enrollments.reduce((a, e) => a + e.price, 0));
  const subsidy = roundMoney(enrollments.reduce((a, e) => a + e.subsidy, 0));
  return { total, subsidy, own: roundMoney(total - subsidy) };
}
