"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { eligibility, activeEnrollments } from "@/lib/domain";
import { products, productById, providers } from "@/mocks/catalog";
import { companies, DEMO_DATE } from "@/mocks/seed";
import { money, normalize, dateLabel } from "@/lib/utils";
import {
  PageHeading,
  Stat,
  SectionHeading,
  Badge,
  Disclaimer,
  SearchField,
  Segments,
  Timeline,
  Avatar,
  EmptyState,
} from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/icons";
export function AdminDashboard() {
  const { state } = useDemo();
  const pending = state.movements.filter((m) => m.status !== "Confirmada");
  return (
    <>
      <PageHeading
        eyebrow="OPERAÇÃO VASTOR CAPITAL · DEMONSTRAÇÃO"
        title="O cuidado na frente. A confiança por trás."
        description="Acompanhe o caminho entre oferta, decisão, cobertura e registro."
      >
        <Button variant="outline" asChild>
          <Link href="/admin/elegibilidade">
            <Icon name="Zap" size={15} />
            Motor de elegibilidade
          </Link>
        </Button>
      </PageHeading>
      <div className="stat-grid">
        <Stat
          label="Pessoas"
          value={state.people.length}
          icon="Users"
          detail="Perfis fictícios no cenário"
        />
        <Stat
          label="Contratantes"
          value={companies.length}
          icon="Building2"
          detail="Vetor Engenharia e Atlas Digital"
        />
        <Stat
          label="Coberturas ativas"
          value={activeEnrollments(state).length}
          icon="ShieldCheck"
          detail="Inclui próprias e externas"
        />
        <Stat
          label="Ofertas emitidas"
          value={state.offers.length}
          icon="Gift"
          detail="Todas com registro de origem"
        />
      </div>
      <div className="stat-grid">
        <Stat
          label="Aceites"
          value={state.decisions.filter((d) => d.choice === "accepted").length}
          icon="Check"
          detail="Decisões independentes"
        />
        <Stat
          label="Recusas"
          value={state.decisions.filter((d) => d.choice === "declined").length}
          icon="Fingerprint"
          detail="Escolhas documentadas"
        />
        <Stat
          label="Movimentos pendentes"
          value={pending.length}
          icon="RefreshCw"
          detail="Aguardando confirmação simulada"
        />
        <Stat
          label="Divergências"
          value={state.movements.filter((m) => m.status === "Rejeitada").length}
          icon="Activity"
          detail="Registros para revisão"
        />
      </div>
      <div className="grid-two mb-section">
        <div className="reconciliation-card">
          <Icon name="Network" size={29} />
          <h3 className="mt-5">Cada transição tem um porquê.</h3>
          <p>
            Veja quem pode acessar um produto, em qual política e por qual valor. Regras
            determinísticas, com explicação.
          </p>
          <Button asChild>
            <Link href="/admin/elegibilidade">
              Explorar elegibilidade
              <Icon name="ArrowRight" size={15} />
            </Link>
          </Button>
        </div>
        <Card className="padded">
          <SectionHeading
            title="Fila de movimentações"
            href="/admin/movimentacoes"
            action="Abrir fila"
          />
          {pending.length ? (
            pending.slice(0, 3).map((m) => (
              <div key={m.id} className="data-row">
                <span>
                  {state.people.find((p) => p.id === m.personId)?.name}
                  <small className="block">{productById(m.productId)?.name}</small>
                </span>
                <Badge tone="amber">{m.status}</Badge>
              </div>
            ))
          ) : (
            <EmptyState
              title="Operação em dia"
              description="Novos aceites no ambiente profissional aparecerão nesta fila."
              icon="CheckCheck"
            />
          )}
        </Card>
      </div>
      <Card className="padded">
        <SectionHeading
          title="O histórico que conecta tudo"
          description="Últimos eventos da operação"
          href="/admin/eventos"
          action="Ver ledger"
        />
        <Timeline
          events={[...state.events]
            .sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id))
            .slice(0, 5)}
        />
      </Card>
      <Disclaimer>
        Dados limitados ao cenário local. KPIs são calculados a partir dos registros da demo, sem
        totais artificiais desconectados.
      </Disclaimer>
    </>
  );
}
export function Eligibility() {
  const { state } = useDemo();
  const [personId, setPersonId] = useState("p1"),
    [date, setDate] = useState(DEMO_DATE),
    [result, setResult] = useState<{ personId: string; date: string } | null>(null),
    [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeading
        eyebrow="REGRAS CLARAS. RESPOSTAS EXPLICÁVEIS."
        title="Quem pode acessar o quê?"
        description="Uma visão do motor determinístico de elegibilidade."
      />
      <Card className="padded mb-section">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!date || !Number.isFinite(Date.parse(date))) {
              toast.error("Selecione uma data válida.");
              return;
            }
            setBusy(true);
            await new Promise((r) => setTimeout(r, 450));
            setResult({ personId, date });
            setBusy(false);
          }}
        >
          <div className="fields-two">
            <div>
              <label className="field-label" htmlFor="eligibility-person">
                Profissional
              </label>
              <select
                className="input"
                id="eligibility-person"
                value={personId}
                onChange={(e) => {
                  setPersonId(e.target.value);
                  setResult(null);
                }}
              >
                {state.people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="eligibility-date">
                Data de referência
              </label>
              <Input
                type="date"
                id="eligibility-date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setResult(null);
                }}
              />
            </div>
          </div>
          <Button className="mt-5" type="submit" disabled={busy}>
            <Icon name={busy ? "LoaderCircle" : "Zap"} className={busy ? "spin" : ""} size={15} />
            {busy ? "Calculando..." : "Calcular elegibilidade"}
          </Button>
        </form>
        <Disclaimer>
          O cálculo considera a política vigente na data, o contrato e o saldo atual da carteira.
          Cada preço é um cenário independente; subsídios não devem ser somados entre cartões.
          Histórico de idade e saldo não é reconstruído nesta demo.
        </Disclaimer>
      </Card>
      {result ? (
        <>
          <SectionHeading
            title={`Resultado para ${state.people.find((p) => p.id === result.personId)?.name.split(" ")[0]}`}
            description={`Referência: ${dateLabel(result.date)} · condições fictícias`}
          />
          <div className="grid-three">
            {products
              .filter((p) =>
                [
                  "saude",
                  "wellhub",
                  "doencas",
                  "renda",
                  "telemedicina",
                  "responsabilidade",
                ].includes(p.id),
              )
              .map((p) => {
                const e = eligibility(state, result.personId, p, result.date);
                return (
                  <Card key={p.id} className="padded">
                    <div className="flex-between">
                      <span className="icon-tile">
                        <Icon name={p.icon} size={22} />
                      </span>
                      <Badge tone={e.eligible ? "green" : "amber"} dot>
                        {e.eligible ? "Elegível" : "Não elegível"}
                      </Badge>
                    </div>
                    <h2 className="card-title mt-5">{p.name}</h2>
                    <div className="data-rows mt-4">
                      <div className="data-row">
                        <span>Preço cheio</span>
                        <strong>{money(p.price, 2)}</strong>
                      </div>
                      <div className="data-row">
                        <span>Subsídio disponível</span>
                        <strong>{money(e.subsidy, 2)}</strong>
                      </div>
                      <div className="data-row">
                        <span>Preço final</span>
                        <strong>{money(e.finalPrice, 2)}</strong>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="eyebrow">POR QUÊ?</p>
                      <ul className="check-list">
                        {e.reasons.map((r) => (
                          <li key={r}>
                            <Icon name={e.eligible ? "CheckCircle2" : "Info"} size={14} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="muted mt-4">
                      Política v{e.version} · {e.days} dias de contrato
                    </p>
                  </Card>
                );
              })}
          </div>
        </>
      ) : (
        <Card>
          <EmptyState
            icon="Zap"
            title="Regras que você pode entender"
            description="Selecione uma pessoa e uma data para verificar condições, preços e motivos de elegibilidade."
          />
        </Card>
      )}
    </>
  );
}
export function Ledger() {
  const { state } = useDemo();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const events = [...state.events]
    .sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id))
    .filter(
      (e) =>
        (filter === "all" || e.type === filter) &&
        normalize(
          `${e.id} ${e.title} ${state.people.find((p) => p.id === e.personId)?.name ?? ""}`,
        ).includes(normalize(query)),
    );
  return (
    <>
      <PageHeading
        title="O registro de cada escolha."
        description="Eventos administrativos com origem, responsável, versão e contexto."
      />
      <div className="ledger-note">
        <Icon name="Fingerprint" size={29} />
        <div>
          <strong>Registro append-only · representação demonstrativa</strong>
          <p>
            A interface apenas acrescenta eventos. O localStorage pode ser alterado fora da
            aplicação; hashes são fictícios e não oferecem integridade criptográfica.
          </p>
        </div>
      </div>
      <div className="toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar evento, ID ou pessoa" />
        <Badge tone="blue">{events.length} eventos</Badge>
      </div>
      <div className="mb-section">
        <Segments
          items={[
            { id: "all", label: "Todos" },
            ...(
              [
                "ACEITE",
                "RECUSA",
                "OFERTA",
                "POLÍTICA",
                "SUBSÍDIO",
                "ATIVAÇÃO",
                "PORTABILIDADE",
              ] as const
            ).map((t) => ({ id: t, label: t.charAt(0) + t.slice(1).toLowerCase() })),
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <Card>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Evento / identificador</th>
                <th>Timestamp</th>
                <th>Pessoa</th>
                <th>Tipo</th>
                <th>Origem</th>
                <th>Versão</th>
                <th>Hash fictício</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong className="text-xs font-medium">{e.title}</strong>
                    <br />
                    <code className="ledger-hash">{e.id}</code>
                    <br />
                    <small className="muted">{e.entity}</small>
                  </td>
                  <td className="numbers">
                    {dateLabel(e.at)}
                    <br />
                    <small className="muted">
                      {new Date(e.at).toLocaleTimeString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                      })}
                    </small>
                  </td>
                  <td>
                    {state.people.find((p) => p.id === e.personId)?.name ?? "Operação Vastor Capital"}
                  </td>
                  <td>
                    <Badge
                      tone={
                        e.type === "RECUSA" ? "neutral" : e.type === "ATIVAÇÃO" ? "green" : "blue"
                      }
                    >
                      {e.type}
                    </Badge>
                  </td>
                  <td>{e.actor}</td>
                  <td>v{e.version}</td>
                  <td>
                    <code className="ledger-hash">{e.hash}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!events.length && <EmptyState title="Nenhum evento neste filtro" />}
        <div className="table-footer">
          <span>{events.length} registros · dados fictícios</span>
          <span>Não há exclusão ou edição de eventos pela interface</span>
        </div>
      </Card>
    </>
  );
}
export function Movements() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState("Todos"),
    [busy, setBusy] = useState<string | null>(null);
  const moves = state.movements.filter((m) => filter === "Todos" || m.status === filter);
  return (
    <>
      <PageHeading
        title="Da escolha à proteção ativa."
        description="Acompanhe o envio e a confirmação de cada movimentação."
      />
      <div className="stat-grid">
        {["Pendente", "Enviada", "Confirmada", "Rejeitada"].map((status) => (
          <Stat
            key={status}
            label={status}
            value={state.movements.filter((m) => m.status === status).length}
            icon={status === "Confirmada" ? "CheckCheck" : "RefreshCw"}
            detail="Movimentações demonstrativas"
          />
        ))}
      </div>
      <div className="mb-section">
        <Segments
          items={["Todos", "Pendente", "Enviada", "Confirmada", "Rejeitada"].map((s) => ({
            id: s,
            label: s,
          }))}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <Card>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Profissional</th>
                <th>Produto / fornecedor</th>
                <th>Operação</th>
                <th>Data</th>
                <th>Status</th>
                <th>Tentativas</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((m) => {
                const p = productById(m.productId);
                return (
                  <tr key={m.id}>
                    <td>{state.people.find((p) => p.id === m.personId)?.name}</td>
                    <td>
                      {p?.name}
                      <br />
                      <small className="muted">
                        {providers.find((x) => x.id === p?.providerId)?.name}
                      </small>
                    </td>
                    <td>{m.operation}</td>
                    <td>{dateLabel(m.at)}</td>
                    <td>
                      <Badge
                        tone={
                          m.status === "Confirmada"
                            ? "green"
                            : m.status === "Rejeitada"
                              ? "red"
                              : "amber"
                        }
                      >
                        {m.status}
                      </Badge>
                    </td>
                    <td>{m.attempts}</td>
                    <td>
                      {m.status === "Confirmada" ? (
                        <span className="positive">
                          <Icon name="CheckCheck" size={15} />
                          Confirmada
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy !== null}
                          onClick={async () => {
                            setBusy(m.id);
                            await new Promise((r) => setTimeout(r, 600));
                            dispatch({
                              type: "confirmMovement",
                              id: m.id,
                              at: new Date().toISOString(),
                            });
                            setBusy(null);
                            toast.success(
                              "Movimento confirmado na demo. Carteira e histórico atualizados.",
                            );
                          }}
                        >
                          <Icon
                            name={busy === m.id ? "LoaderCircle" : "RefreshCw"}
                            className={busy === m.id ? "spin" : ""}
                            size={13}
                          />
                          {busy === m.id
                            ? "Processando..."
                            : m.attempts
                              ? "Reprocessar"
                              : "Simular confirmação"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!moves.length && (
          <EmptyState
            title="Nenhuma movimentação neste filtro"
            description="Aceite uma nova oferta no ambiente profissional para gerar uma movimentação."
          />
        )}
      </Card>
      <Disclaimer>
        Confirmação manual simulada. Não há envio de dados a fornecedores, seguradoras ou
        operadoras.
      </Disclaimer>
    </>
  );
}
