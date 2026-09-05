"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { companyStats, enrollmentTotals } from "@/lib/domain";
import { productById } from "@/mocks/catalog";
import { monthlyHistory } from "@/mocks/seed";
import { money } from "@/lib/utils";
import { createDocumentHtml, downloadFile } from "@/lib/exports";
import type { Role } from "@/types";
import { PageHeading, Stat, Badge, Disclaimer, SectionHeading } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { TrendChart, CostChart } from "@/components/charts";
export function Finance({ role }: { role: Role }) {
  const { state } = useDemo();
  const [month, setMonth] = useState("Agosto 2026");
  const professional = role === "professional";
  const en = state.enrollments.filter(
    (e) => e.personId === "p1" && (e.status === "active" || e.status === "pending"),
  );
  const totals = enrollmentTotals(en),
    stats = companyStats(state);
  const histories = [
    ...monthlyHistory,
    {
      month: "Ago",
      coverage: stats.percent,
      subsidy: stats.subsidy,
      contracts: stats.contracts,
      platform: stats.platform,
    },
  ];
  const selected =
    month === "Agosto 2026" ? histories[5] : month === "Julho 2026" ? histories[4] : histories[3];
  const estimatedTotal = selected.contracts + selected.subsidy + selected.platform;
  const multiplier = month === "Agosto 2026" ? 1 : month === "Julho 2026" ? 0.96 : 0.92;
  const invoiceAmount = professional
    ? totals.own * multiplier
    : selected.subsidy + selected.platform;
  return (
    <>
      <PageHeading
        title={professional ? "Clareza em cada valor." : "Financeiro da contratante"}
        description={
          professional
            ? "Veja como você e suas contratantes dividem o custo da sua proteção."
            : "Contratos, subsídios e plataforma em uma visão consolidada."
        }
      >
        <label className="sr-only" htmlFor="competence">
          Competência
        </label>
        <select
          className="input"
          id="competence"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {["Agosto 2026", "Julho 2026", "Junho 2026"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </PageHeading>
      <div className="stat-grid">
        {professional ? (
          <>
            <Stat
              label="Seu custo projetado"
              value={money(totals.own * multiplier, 2)}
              detail="Inclui proteções externas"
              icon="Wallet"
            />
            <Stat
              label="Subsídio recebido"
              value={money(totals.subsidy * multiplier, 2)}
              detail="Apoio da contratante"
              icon="Gift"
            />
            <Stat
              label="Valor dos benefícios"
              value={money(totals.total * multiplier, 2)}
              detail="Composição demonstrativa"
              icon="ShieldCheck"
            />
            <Stat
              label="Competência"
              value={month.split(" ")[0]}
              detail="Valores mensais simulados"
              icon="Clock"
            />
          </>
        ) : (
          <>
            <Stat
              label="Contratos ativos PJ"
              value={money(selected.contracts)}
              detail={`${stats.active} contratos no cenário atual`}
              icon="BriefcaseBusiness"
            />
            <Stat
              label="Subsídios"
              value={money(selected.subsidy, 2)}
              detail="Coberturas ativas e reservas"
              icon="Gift"
            />
            <Stat
              label="Taxa Vastor Capital"
              value={money(selected.platform)}
              detail="R$ 19 por contrato ativo"
              icon="Network"
            />
            <Stat
              label="Total projetado"
              value={money(estimatedTotal, 2)}
              detail={month}
              icon="Wallet"
            />
          </>
        )}
      </div>
      <div className="grid-two mb-section">
        <Card className="padded">
          <SectionHeading title={professional ? "Sua composição mensal" : "Evolução do custo"} />
          {professional ? (
            <div className="data-rows">
              {en.map((e) => (
                <div className="data-row" key={e.id}>
                  <span>
                    {productById(e.productId)?.name}
                    {e.source === "Externo" ? " · externo" : ""}
                  </span>
                  <strong>{money((e.price - e.subsidy) * multiplier, 2)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <CostChart data={histories} />
          )}
        </Card>
        <Card className="padded">
          <SectionHeading
            title={professional ? "Histórico de apoio recebido" : "Evolução dos subsídios"}
            description="Série histórica ilustrativa · últimos 6 meses"
          />
          <TrendChart
            currency
            data={
              professional
                ? histories.map((h, i) => ({ ...h, subsidy: totals.subsidy * (0.6 + i * 0.08) }))
                : histories
            }
            keys={[{ key: "subsidy", label: "Subsídio", color: "#487be1" }]}
            height={240}
          />
        </Card>
      </div>
      <Card>
        <div className="table-toolbar">
          <h2 className="card-title">
            {professional ? "Faturas demonstrativas" : "Fatura Vastor Capital da competência"}
          </h2>
          <Badge tone={month === "Agosto 2026" ? "blue" : "green"}>
            {month === "Agosto 2026" ? "Em aberto" : "Pago · demo"}
          </Badge>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Competência</th>
                <th>Valor ilustrativo</th>
                <th>Vencimento</th>
                <th>Documento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="numbers">FAT-DEMO-{month.slice(0, 3).toUpperCase()}-2026</td>
                <td>{month}</td>
                <td>{money(invoiceAmount, 2)}</td>
                <td>05 do mês seguinte</td>
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      downloadFile(
                        "vastor-fatura-DEMO.html",
                        createDocumentHtml(
                          "Fatura demonstrativa",
                          `Competência: ${month}\nValor: ${money(invoiceAmount, 2)}\nSem valor fiscal ou cobrança real.\n${professional ? "Inclui composição ilustrativa de despesas externas; a Vastor Capital não cobra esses valores." : "Subsídios e plataforma. Contratos PJ não são cobrados nesta fatura."}`,
                        ),
                      );
                      toast.success("Fatura demonstrativa preparada.");
                    }}
                  >
                    <Icon name="Download" size={14} />
                    Baixar
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      {!professional && (
        <Card className="padded mt-6">
          <SectionHeading
            title="Cenário de referência"
            description="Comparação ilustrativa com multiplicador de 1,75 sobre os contratos."
          />
          <div className="grid-three">
            <div>
              <p className="muted">PJ + Vastor Capital</p>
              <strong className="metric-inline">{money(estimatedTotal)}</strong>
            </div>
            <div>
              <p className="muted">CLT estimado · hipótese</p>
              <strong className="metric-inline">{money(selected.contracts * 1.75)}</strong>
            </div>
            <div>
              <p className="muted">Diferença estimada</p>
              <strong className="metric-inline">
                {money(selected.contracts * 1.75 - estimatedTotal)}
              </strong>
            </div>
          </div>
          <Disclaimer kind="warning">
            Estimativa de ordem de grandeza. Não constitui cálculo trabalhista ou de folha. O fator
            1,75 é fictício e não representa uma alíquota legal ou economia garantida.
          </Disclaimer>
        </Card>
      )}
      <Disclaimer>
        Valores projetados e competências anteriores são demonstrativos. Adesões pendentes são
        reservas, sem cobrança real. O comparativo usa apenas contratos ativos; contratos encerrados
        ficam fora da base.
      </Disclaimer>
    </>
  );
}
