import type { Company, DemoState, Event, Person } from "@/types";
import { products } from "./catalog";
export const DEMO_DATE = "2026-08-28";
export const companies: Company[] = [
  {
    id: "vetor",
    name: "Vetor Engenharia Ltda",
    cnpj: "DEMO-EMPRESA-001",
    sector: "Engenharia e projetos",
  },
  { id: "atlas", name: "Atlas Digital", cnpj: "DEMO-EMPRESA-002", sector: "Tecnologia" },
];
const rows: [string, string, number, string, boolean, boolean, string[]][] = [
  [
    "Ana Ribeiro Martins",
    "2024-03-01",
    12800,
    "Engenheira civil",
    true,
    true,
    ["telemedicina", "vida", "odonto"],
  ],
  [
    "Bruno Camargo Dias",
    "2025-01-10",
    9500,
    "Desenvolvedor",
    true,
    true,
    ["telemedicina", "farmacia", "wellhub"],
  ],
  [
    "Carla Nogueira Pinto",
    "2023-09-02",
    14200,
    "Arquiteta",
    true,
    true,
    ["saude", "vida", "odonto", "farmacia"],
  ],
  ["Diego Souza Almeida", "2026-02-10", 7800, "Analista de projetos", true, false, []],
  [
    "Eduarda Lima Prado",
    "2025-08-12",
    11300,
    "Designer",
    true,
    true,
    ["telemedicina", "odonto", "wellhub"],
  ],
  [
    "Felipe Andrade Rocha",
    "2022-06-01",
    16000,
    "Engenheiro de software",
    true,
    true,
    ["saude", "vida", "farmacia"],
  ],
  ["Gabriela Torres Sá", "2026-04-05", 6400, "Consultora", true, true, ["telemedicina"]],
  [
    "Henrique Vasques Melo",
    "2024-10-12",
    10900,
    "Engenheiro civil",
    false,
    true,
    ["telemedicina", "vida"],
  ],
  [
    "Isabela Fontes Cruz",
    "2025-05-10",
    8200,
    "Analista de dados",
    true,
    true,
    ["telemedicina", "odonto", "farmacia"],
  ],
  ["João Pedro Barreto", "2025-12-01", 5900, "Consultor de projetos", true, true, []],
  ["Larissa Mendes Vieira", "2026-07-15", 9100, "Arquiteta", true, false, []],
  [
    "Marcos Teixeira Luz",
    "2023-11-01",
    13600,
    "Engenheiro mecânico",
    true,
    true,
    ["saude", "vida", "odonto", "wellhub"],
  ],
];
export const initialPeople: Person[] = rows.map((r, i) => ({
  id: `p${i + 1}`,
  name: r[0],
  cnpj: `DEMO-CNPJ-${String(i + 1).padStart(3, "0")}`,
  email: `pessoa${i + 1}@vastor.demo`,
  startedAt: r[1],
  contract: r[2],
  occupation: r[3],
  active: r[4],
  signed: r[5],
  companyId: "vetor",
  age: 35 + i,
  ...(r[4] ? {} : { endedAt: "2026-08-04" }),
}));
export const monthlyHistory = [
  { month: "Mar", coverage: 45, subsidy: 510, contracts: 98200, platform: 190 },
  { month: "Abr", coverage: 55, subsidy: 620, contracts: 105400, platform: 209 },
  { month: "Mai", coverage: 59, subsidy: 655, contracts: 112100, platform: 209 },
  { month: "Jun", coverage: 64, subsidy: 715, contracts: 114800, platform: 228 },
  { month: "Jul", coverage: 68, subsidy: 768, contracts: 114800, platform: 228 },
];
export const questions = [
  {
    id: "saude",
    label: "Saúde",
    title: "Como você resolve uma consulta médica hoje?",
    options: [
      ["Tenho plano de saúde ativo", 4],
      ["Tenho telemedicina ou assinatura de consultas", 3],
      ["Uso o SUS", 2],
      ["Pago particular quando preciso", 1],
    ],
  },
  {
    id: "renda",
    label: "Renda",
    title: "Se ficasse 60 dias sem trabalhar, o que garantiria sua renda?",
    options: [
      ["Tenho seguro de renda por incapacidade", 4],
      ["Tenho uma reserva para esse período", 3],
      ["Contribuo ao INSS e verificaria meu direito ao benefício", 2],
      ["Não tenho uma proteção para isso", 0],
    ],
  },
  {
    id: "vida",
    label: "Família",
    title: "Se acontecesse o pior, sua família teria apoio financeiro?",
    options: [
      ["Tenho seguro de vida contratado", 4],
      ["Tenho reserva destinada à família", 3],
      ["Contaria com a pensão do INSS, se elegível", 2],
      ["Ainda não organizei essa proteção", 0],
    ],
  },
  {
    id: "aposentadoria",
    label: "Futuro",
    title: "Quanto você guarda pensando em parar de trabalhar?",
    options: [
      ["INSS em dia e aportes mensais", 4],
      ["Apenas INSS ou DAS em dia", 2],
      ["Contribuo de vez em quando", 1],
      ["Ainda não guardo para isso", 0],
    ],
  },
  {
    id: "reserva",
    label: "Reserva",
    title: "Quantos meses de despesas você tem guardados?",
    options: [
      ["Seis meses ou mais", 4],
      ["De três a cinco meses", 3],
      ["Um ou dois meses", 1],
      ["Ainda não tenho reserva", 0],
    ],
  },
  {
    id: "trabalho",
    label: "Trabalho",
    title: "E se seu equipamento quebrar ou houver uma reclamação profissional?",
    options: [
      ["Tenho proteções para equipamento e responsabilidade", 4],
      ["Tenho reserva separada para isso", 3],
      ["Tenho apenas uma dessas proteções", 2],
      ["Ainda não tenho proteção", 0],
    ],
  },
] as const;
export function createSeed(): DemoState {
  const s: DemoState = {
    schemaVersion: 1,
    people: structuredClone(initialPeople),
    policies: [
      {
        id: "pol-1",
        version: 1,
        cap: 100,
        participation: 50,
        minDays: 120,
        effectiveAt: "2024-01-01",
        createdAt: "2023-12-15T12:00:00Z",
      },
      {
        id: "pol-2",
        version: 2,
        cap: 150,
        participation: 60,
        minDays: 90,
        effectiveAt: "2025-01-01",
        createdAt: "2024-12-15T12:00:00Z",
      },
      {
        id: "pol-3",
        version: 3,
        cap: 180,
        participation: 70,
        minDays: 90,
        effectiveAt: "2026-06-01",
        createdAt: "2026-05-15T12:00:00Z",
      },
    ],
    offers: [],
    decisions: [],
    enrollments: [],
    events: [],
    movements: [],
    documents: [],
    answers: { saude: 3, renda: 1, vida: 4, aposentadoria: 2, reserva: 2, trabalho: 3 },
    assessmentCompleted: false,
    onboarded: false,
    profile: {
      name: "Ana Ribeiro Martins",
      occupation: "Engenheira civil",
      email: "profissional@vastor.demo",
    },
    preferences: { notifications: true, compact: false },
  };
  const event = (
    p: string,
    type: Event["type"],
    title: string,
    entity: string,
    at = "2026-08-12T13:30:00Z",
    detail = "Registro fictício para demonstração",
  ) =>
    s.events.push({
      id: `evt_demo_${String(s.events.length + 1).padStart(5, "0")}`,
      personId: p,
      type,
      title,
      entity,
      at,
      actor:
        type === "ACEITE" || type === "RECUSA"
          ? s.people.find((x) => x.id === p)!.name
          : "Vastor Capital · simulação",
      version: 3,
      hash: `demo:${String(s.events.length + 1).padStart(8, "0")}`,
      detail,
    });
  const refusalCounts = [1, 2, 0, 0, 1, 3, 2, 1, 1, 4, 0, 1];
  rows.forEach((r, i) => {
    const person = s.people[i];
    let used = 0;
    event(
      person.id,
      "CONTRATO",
      person.active ? "Contrato de prestação registrado" : "Contrato encerrado · proteção portada",
      person.id,
      `${person.startedAt}T12:00:00Z`,
    );
    s.documents.push({
      id: `doc-aditivo-${person.id}`,
      personId: person.id,
      title: "Aditivo de benefícios",
      type: "Aditivo",
      status: person.signed ? "Disponível" : "Pendente",
      date: "2026-08-01",
      content:
        "Adesão facultativa. A escolha ou recusa de benefícios não altera o contrato de prestação. Documento demonstrativo, sem assinatura eletrônica real.",
    });
    if (person.signed)
      event(
        person.id,
        "DOCUMENTO",
        "Aditivo registrado na demonstração",
        `doc-aditivo-${person.id}`,
        "2026-08-01T12:00:00Z",
      );
    r[6].forEach((productId, j) => {
      const product = products.find((x) => x.id === productId)!;
      const subsidy = person.active
        ? Math.min(180 - used, Math.round(product.price * 70) / 100)
        : 0;
      used += subsidy;
      const id = `offer-${person.id}-${productId}`;
      s.offers.push({
        id,
        personId: person.id,
        productId,
        companyId: "vetor",
        createdAt: "2026-08-12T13:00:00Z",
        price: product.price,
        subsidy,
        policyVersion: 3,
      });
      event(person.id, "OFERTA", `${product.name} oferecido`, id, "2026-08-12T13:00:00Z");
      s.decisions.push({
        id: `decision-${id}`,
        offerId: id,
        personId: person.id,
        productId,
        choice: "accepted",
        at: "2026-08-13T14:00:00Z",
      });
      event(person.id, "ACEITE", `${product.name} aceito`, id, "2026-08-13T14:00:00Z");
      const enrollId = `enr-${person.id}-${productId}`;
      s.enrollments.push({
        id: enrollId,
        personId: person.id,
        productId,
        ...(person.active ? { companyId: "vetor" } : {}),
        source: person.active ? "Vastor Capital" : "Portado",
        status: "active",
        price: product.price,
        subsidy,
        startedAt: "2026-08-15",
        policyVersion: 3,
      });
      event(person.id, "ATIVAÇÃO", `${product.name} ativado`, enrollId, "2026-08-15T15:00:00Z");
      s.movements.push({
        id: `mov-${person.id}-${j}`,
        enrollmentId: enrollId,
        personId: person.id,
        productId,
        operation: "Inclusão",
        at: "2026-08-15T15:00:00Z",
        status: "Confirmada",
        attempts: 1,
      });
    });
    products
      .filter((p) => !r[6].includes(p.id))
      .slice(0, refusalCounts[i])
      .forEach((product) => {
        const id = `ref-${person.id}-${product.id}`;
        s.offers.push({
          id,
          personId: person.id,
          productId: product.id,
          companyId: "vetor",
          createdAt: "2026-08-12T13:00:00Z",
          price: product.price,
          subsidy: 0,
          policyVersion: 3,
        });
        s.decisions.push({
          id: `decision-${id}`,
          offerId: id,
          personId: person.id,
          productId: product.id,
          choice: "declined",
          at: "2026-08-13T15:00:00Z",
        });
        event(person.id, "OFERTA", `${product.name} oferecido`, id, "2026-08-12T13:00:00Z");
        event(
          person.id,
          "RECUSA",
          `${product.name} recusado`,
          id,
          "2026-08-13T15:00:00Z",
          "Recusa facultativa. Sem alteração do contrato de prestação.",
        );
      });
  });
  ["renda", "psicologia", "wellhub"].forEach((id) => {
    const p = products.find((x) => x.id === id)!;
    const offerId = `pending-${id}`;
    s.offers.push({
      id: offerId,
      personId: "p1",
      productId: id,
      companyId: "vetor",
      createdAt: "2026-08-26T12:00:00Z",
      price: p.price,
      subsidy: Math.round(p.price * 70) / 100,
      policyVersion: 3,
    });
    event("p1", "OFERTA", `${p.name}: nova oferta disponível`, offerId, "2026-08-26T12:00:00Z");
  });
  s.enrollments.push(
    {
      id: "external-health",
      personId: "p1",
      productId: "saude",
      source: "Externo",
      status: "active",
      price: 489,
      subsidy: 0,
      startedAt: "2025-04-01",
    },
    {
      id: "portability-life",
      personId: "p1",
      productId: "vida",
      companyId: "atlas",
      source: "Vastor Capital",
      status: "portability",
      price: 29,
      subsidy: 0,
      startedAt: "2025-02-01",
    },
  );
  event(
    "p1",
    "PORTABILIDADE",
    "Atlas Digital: continuidade de proteção disponível",
    "portability-life",
    "2026-08-25T12:00:00Z",
    "Contrato encerrado. Subsídio anterior de R$ 20 encerrado. Escolha continuar por conta própria ou cancelar.",
  );
  s.documents.push(
    {
      id: "doc-termos-p1",
      personId: "p1",
      title: "Termos de adesão",
      type: "Termos",
      status: "Disponível",
      date: "2026-08-13",
      content:
        "A adesão a cada benefício é facultativa. O profissional escolhe aceitar ou recusar independentemente do contrato de prestação. Todos os valores e registros são fictícios.",
    },
    {
      id: "doc-vida-p1",
      personId: "p1",
      title: "Seguro de vida · condições",
      type: "Condições",
      status: "Disponível",
      date: "2026-08-15",
      content:
        "Capital segurado ilustrativo de R$ 100.000. Condições fictícias de cobertura, exclusões e beneficiários. Este documento não é uma apólice e não gera proteção securitária real.",
    },
    {
      id: "doc-odonto-p1",
      personId: "p1",
      title: "Plano odontológico · condições",
      type: "Condições",
      status: "Disponível",
      date: "2026-08-15",
      content:
        "Condições demonstrativas de rede, procedimentos e carência. Nenhum atendimento é disponibilizado ou realizado por esta aplicação.",
    },
    {
      id: "doc-historico-p1",
      personId: "p1",
      title: "Histórico de decisões",
      type: "Histórico",
      status: "Disponível",
      date: DEMO_DATE,
      content:
        "O histórico reúne as decisões desta demonstração. Aceites e recusas têm o mesmo valor como registro de escolha. Não há garantia de imutabilidade em armazenamento local.",
    },
  );
  return s;
}
