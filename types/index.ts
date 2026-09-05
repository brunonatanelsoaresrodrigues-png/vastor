export type Role = "professional" | "company" | "admin";
export type Category =
  "Saúde" | "Bem-estar" | "Proteção" | "Financeiro" | "Trabalho" | "Educação" | "Vantagens";
export type Pillar = "saude" | "renda" | "vida" | "aposentadoria" | "reserva" | "trabalho";
export interface Person {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  occupation: string;
  age: number;
  companyId: string;
  startedAt: string;
  endedAt?: string;
  active: boolean;
  contract: number;
  signed: boolean;
}
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  sector: string;
}
export interface Benefit {
  id: string;
  name: string;
  category: Category;
  description: string;
  icon: string;
}
export interface Product extends Benefit {
  price: number;
  providerId: string;
  coverage: string;
  conditions: string[];
  waiting: string;
  minDays: number;
  minAge: number;
  maxAge: number;
  pillar?: Pillar;
  protectionLevel?: number;
  featured?: boolean;
}
export interface Provider {
  id: string;
  name: string;
  category: string;
  status: "Operacional" | "Em homologação";
}
export interface SubsidyPolicy {
  id: string;
  version: number;
  cap: number;
  participation: number;
  minDays: number;
  effectiveAt: string;
  createdAt: string;
}
export interface Offer {
  id: string;
  personId: string;
  productId: string;
  companyId: string;
  createdAt: string;
  price: number;
  subsidy: number;
  policyVersion: number;
}
export interface Decision {
  id: string;
  offerId: string;
  personId: string;
  productId: string;
  choice: "accepted" | "declined";
  at: string;
}
export interface Enrollment {
  id: string;
  personId: string;
  productId: string;
  companyId?: string;
  source: "Vastor Capital" | "Externo" | "Portado";
  status: "active" | "pending" | "portability" | "cancelled";
  price: number;
  subsidy: number;
  startedAt: string;
  policyVersion?: number;
}
export interface Event {
  id: string;
  at: string;
  personId?: string;
  type:
    | "OFERTA"
    | "ACEITE"
    | "RECUSA"
    | "POLÍTICA"
    | "SUBSÍDIO"
    | "ATIVAÇÃO"
    | "PORTABILIDADE"
    | "DOCUMENTO"
    | "CONTRATO"
    | "CANCELAMENTO"
    | "CONVITE";
  title: string;
  detail: string;
  actor: string;
  entity: string;
  version: number;
  hash: string;
}
export interface Invoice {
  id: string;
  month: string;
  personId?: string;
  amount: number;
  status: "Pago" | "Em aberto";
  dueAt: string;
}
export interface Document {
  id: string;
  personId?: string;
  title: string;
  type: string;
  status: "Disponível" | "Pendente";
  date: string;
  content: string;
}
export interface Movement {
  id: string;
  enrollmentId: string;
  personId: string;
  productId: string;
  operation: string;
  at: string;
  status: "Pendente" | "Enviada" | "Confirmada" | "Rejeitada";
  attempts: number;
}
export interface Session {
  role: Role;
  name: string;
  email: string;
}
export interface DemoState {
  schemaVersion: 1;
  people: Person[];
  policies: SubsidyPolicy[];
  offers: Offer[];
  decisions: Decision[];
  enrollments: Enrollment[];
  events: Event[];
  movements: Movement[];
  documents: Document[];
  answers: Record<string, number>;
  assessmentCompleted: boolean;
  onboarded: boolean;
  profile: { name: string; occupation: string; email: string };
  preferences: { notifications: boolean; compact: boolean };
}
