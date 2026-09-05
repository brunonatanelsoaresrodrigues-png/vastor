import type { DemoState, Person } from "@/types";
import { companyEnrollments, currentPolicy, enrollmentTotals } from "@/lib/domain";
import { productById } from "@/mocks/catalog";
import { money, dateLabel } from "@/lib/utils";
export const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
function reportFrame(title: string, body: string) {
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${escapeHtml(title)} · Vastor Capital DEMO</title><style>body{font:13px/1.7 system-ui,sans-serif;color:#203251;max-width:900px;margin:50px auto;padding:0 25px}h1{font-size:30px;letter-spacing:-1px}h2{font-size:21px;margin-top:35px}h3{font-size:15px;border-bottom:1px solid #ddd;padding-bottom:8px;margin-top:25px}p,li{color:#596b83}table{width:100%;border-collapse:collapse;font-size:11px}td,th{text-align:left;padding:9px;border-bottom:1px solid #eee}th{background:#f3f6fa}.notice{background:#f0f5fc;padding:15px;border:1px solid #dce6f5;border-radius:8px}article{break-before:page}.brand{font-size:27px;font-weight:700;color:#183454}code{font-size:10px}footer{margin-top:35px;border-top:1px solid #ddd;padding:15px 0;font-size:10px}@media print{body{margin:0;max-width:none}.notice{display:block!important}article:first-of-type{break-before:auto}}</style><div class="brand">Vastor Capital</div><p>DEMONSTRAÇÃO · TODOS OS DADOS SÃO FICTÍCIOS</p><h1>${escapeHtml(title)}</h1><div class="notice">Documento demonstrativo. Não constitui parecer jurídico, comprovante de contratação, pagamento ou assinatura eletrônica. Registros armazenados apenas neste navegador; não há garantia de imutabilidade ou autenticidade.</div>${body}<footer>Vastor Capital · Estratégia, capital e visão de longo prazo.<br>Arquivo demonstrativo gerado em ${escapeHtml(dateLabel(new Date().toISOString()))}.</footer></html>`;
}
function dossierBody(s: DemoState, p: Person) {
  const offers = s.offers.filter((o) => o.personId === p.id && o.companyId === "vetor");
  const decisions = s.decisions.filter((d) => offers.some((o) => o.id === d.offerId));
  const en = companyEnrollments(s, p.id);
  const policy = currentPolicy(s);
  const docs = s.documents.filter((d) => d.personId === p.id);
  const events = s.events.filter(
    (e) =>
      e.personId === p.id &&
      !e.entity.startsWith("portability-") &&
      !e.entity.startsWith("external-"),
  );
  return `<article><h2>${escapeHtml(p.name)}</h2><h3>Identificação e contrato</h3><p>${escapeHtml(p.cnpj)} · ${escapeHtml(p.occupation)}<br>Contratante: Vetor Engenharia Ltda · DEMO-EMPRESA-001<br>Início: ${escapeHtml(dateLabel(p.startedAt))} · ${p.active ? "Ativo" : "Encerrado"}<br>Contrato mensal: ${escapeHtml(money(p.contract))}</p><h3>Política de referência</h3><p>v${policy?.version} · teto ${escapeHtml(money(policy?.cap ?? 0))} · participação ${policy?.participation}% · adesão facultativa.<br>Ofertas e adesões preservam sua própria versão. Não há edição retroativa.</p><h3>Ofertas e decisões</h3><table><thead><tr><th>Oferta</th><th>Produto</th><th>Preço</th><th>Subsídio ofertado</th><th>Versão</th><th>Decisão</th></tr></thead><tbody>${offers
    .map((o) => {
      const d = decisions.find((d) => d.offerId === o.id);
      return `<tr><td>${escapeHtml(o.id)}</td><td>${escapeHtml(productById(o.productId)?.name)}</td><td>${escapeHtml(money(o.price, 2))}</td><td>${escapeHtml(money(o.subsidy, 2))}</td><td>v${o.policyVersion}</td><td>${d ? (d.choice === "accepted" ? "Aceite" : "Recusa") + " · " + escapeHtml(dateLabel(d.at)) : "Aguardando decisão"}</td></tr>`;
    })
    .join(
      "",
    )}</tbody></table><h3>Subsídios e coberturas</h3><p>Subsídio reservado: ${escapeHtml(money(enrollmentTotals(en).subsidy, 2))}. Valores demonstrativos.</p><ul>${en.map((e) => `<li>${escapeHtml(productById(e.productId)?.name)} · ${e.status === "active" ? "Ativo" : "Aguardando ativação"} · ${escapeHtml(money(e.subsidy, 2))} · política v${e.policyVersion}</li>`).join("") || "<li>Sem cobertura subsidiada nesta contratante.</li>"}</ul><h3>Portabilidade e encerramento</h3><p>${p.active ? "Contrato ativo. A política prevê opção de continuidade após encerramento, sujeita às condições da cobertura." : "Contrato encerrado. Subsídio encerrado. Proteção mantida por pagamento próprio na demonstração."}</p><h3>Documentos</h3><ul>${docs.map((d) => `<li>${escapeHtml(d.title)} · ${escapeHtml(d.status)} · ${escapeHtml(d.id)}</li>`).join("")}</ul><h3>Trilha de eventos</h3><table><thead><tr><th>Data e hora</th><th>Evento</th><th>Responsável</th><th>Versão / ID</th></tr></thead><tbody>${[
    ...events,
  ]
    .sort((a, b) => a.at.localeCompare(b.at))
    .map(
      (e) =>
        `<tr><td>${escapeHtml(e.at)}</td><td>${escapeHtml(e.title)}<br>${escapeHtml(e.detail)}</td><td>${escapeHtml(e.actor)}</td><td>v${e.version}<br><code>${escapeHtml(e.id)}</code></td></tr>`,
    )
    .join("")}</tbody></table></article>`;
}
export function createDossierHtml(s: DemoState, personId?: string) {
  const people = personId ? s.people.filter((p) => p.id === personId) : s.people;
  return reportFrame("Dossiê de autonomia", people.map((p) => dossierBody(s, p)).join(""));
}
export function createDocumentHtml(title: string, content: string) {
  return reportFrame(
    title,
    `<h3>Conteúdo demonstrativo</h3><p>${escapeHtml(content).replace(/\n/g, "<br>")}</p>`,
  );
}
export function downloadFile(filename: string, content: string, type = "text/html;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
