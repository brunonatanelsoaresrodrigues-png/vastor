"use client";
import { useState } from "react";
import { useDemo } from "@/hooks/use-demo";
import { companies } from "@/mocks/seed";
import { productById, providers } from "@/mocks/catalog";
import { dateLabel, money, normalize } from "@/lib/utils";
import { PageHeading, SearchField, Badge, EmptyState, Disclaimer } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
type Kind = "contratantes" | "ofertas" | "decisoes" | "adesoes" | "fornecedores";
type Row = {
  id: string;
  name: string;
  description: string;
  date: string;
  status: string;
  details: { label: string; value: string }[];
};
const titles: Record<Kind, string> = {
  contratantes: "Quem apoia a proteção.",
  ofertas: "Cada oferta, com suas condições.",
  decisoes: "Escolhas registradas. Sem exceção.",
  adesoes: "Proteção em cada etapa.",
  fornecedores: "A rede por trás do cuidado.",
};
export function AdminRecords({ kind }: { kind: Kind }) {
  const { state } = useDemo();
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("Todos"),
    [selected, setSelected] = useState<Row | null>(null);
  const person = (id: string) => state.people.find((p) => p.id === id)?.name ?? "Pessoa demo";
  const rows: Row[] =
    kind === "contratantes"
      ? companies.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.cnpj,
          date: "01 ago. 2026",
          status: c.id === "vetor" ? "Ativa" : "Histórico",
          details: [
            { label: "Setor", value: c.sector },
            { label: "Identificador", value: c.cnpj },
            {
              label: "Profissionais ativos",
              value: String(state.people.filter((p) => p.companyId === c.id && p.active).length),
            },
          ],
        }))
      : kind === "fornecedores"
        ? providers.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.category,
            date: "28 ago. 2026",
            status: p.status,
            details: [
              { label: "Categoria", value: p.category },
              { label: "Integração", value: "Simulada. Nenhuma conexão externa." },
              { label: "Conciliação", value: "Movimentações confirmadas manualmente na demo." },
            ],
          }))
        : kind === "ofertas"
          ? state.offers.map((o) => {
              const d = state.decisions.find((d) => d.offerId === o.id);
              return {
                id: o.id,
                name: productById(o.productId)?.name ?? o.productId,
                description: person(o.personId),
                date: dateLabel(o.createdAt),
                status: !d ? "Pendente" : d.choice === "accepted" ? "Aceita" : "Recusada",
                details: [
                  { label: "Preço registrado", value: money(o.price, 2) },
                  { label: "Subsídio ofertado", value: money(o.subsidy, 2) },
                  { label: "Política", value: `v${o.policyVersion}` },
                  { label: "Condição", value: "Adesão facultativa; subsídio sujeito ao saldo." },
                ],
              };
            })
          : kind === "decisoes"
            ? state.decisions.map((d) => ({
                id: d.id,
                name: productById(d.productId)?.name ?? d.productId,
                description: person(d.personId),
                date: dateLabel(d.at),
                status: d.choice === "accepted" ? "Aceite" : "Recusa",
                details: [
                  { label: "Oferta de origem", value: d.offerId },
                  { label: "Data e hora", value: d.at },
                  { label: "Responsável", value: person(d.personId) },
                  { label: "Escolha", value: "Decisão independente do contrato de prestação." },
                ],
              }))
            : state.enrollments.map((e) => ({
                id: e.id,
                name: productById(e.productId)?.name ?? e.productId,
                description: person(e.personId),
                date: dateLabel(e.startedAt),
                status:
                  e.status === "active"
                    ? "Ativa"
                    : e.status === "pending"
                      ? "Em ativação"
                      : e.status === "portability"
                        ? "Portabilidade"
                        : "Cancelada",
                details: [
                  { label: "Origem", value: e.source },
                  { label: "Preço", value: money(e.price, 2) },
                  { label: "Subsídio", value: money(e.subsidy, 2) },
                  {
                    label: "Política",
                    value: e.policyVersion ? `v${e.policyVersion}` : "Proteção externa",
                  },
                ],
              }));
  const statuses = ["Todos", ...new Set(rows.map((r) => r.status))];
  const list = rows.filter(
    (r) =>
      (status === "Todos" || r.status === status) &&
      normalize(`${r.name} ${r.description} ${r.id}`).includes(normalize(query)),
  );
  return (
    <>
      <PageHeading
        title={titles[kind]}
        description="Registros organizados, conectados ao mesmo cenário de demonstração."
      />
      <div className="toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar registro" />
        <label className="sr-only" htmlFor="record-status">
          Filtrar por status
        </label>
        <select
          id="record-status"
          className="input max-w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <Card>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Registro</th>
                <th>Identificador</th>
                <th>Data</th>
                <th>Status</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong className="text-xs font-medium">{r.name}</strong>
                    <br />
                    <small className="muted">{r.description}</small>
                  </td>
                  <td>
                    <code className="ledger-hash">{r.id}</code>
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <Badge
                      tone={
                        ["Ativa", "Aceite", "Aceita", "Operacional"].includes(r.status)
                          ? "green"
                          : r.status.includes("Pendente") || r.status === "Em ativação"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                      <Icon name="Eye" size={14} />
                      Visualizar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && <EmptyState title="Nenhum registro encontrado" />}
        <div className="table-footer">
          <span>{list.length} registros</span>
          <span>Dados fictícios · ambiente local</span>
        </div>
      </Card>
      <Disclaimer>
        Os registros refletem decisões, políticas e movimentações da mesma demonstração. Não há
        integrações ou operações reais.
      </Disclaimer>
      <Modal
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        title={selected?.name ?? "Registro"}
        description={selected?.description}
      >
        <div className="data-rows">
          {selected?.details.map((d) => (
            <div className="data-row" key={d.label}>
              <span>{d.label}</span>
              <strong>{d.value}</strong>
            </div>
          ))}
        </div>
        <Disclaimer>
          Registro demonstrativo {selected?.id}. Todos os dados são fictícios.
        </Disclaimer>
      </Modal>
    </>
  );
}
