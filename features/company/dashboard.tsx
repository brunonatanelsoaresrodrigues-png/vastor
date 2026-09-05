"use client";
import Link from "next/link";
import { useDemo } from "@/hooks/use-demo";
import { companyStats, companyEnrollments } from "@/lib/domain";
import { monthlyHistory } from "@/mocks/seed";
import { products } from "@/mocks/catalog";
import { money } from "@/lib/utils";
import { PageHeading, Stat, Badge, Progress, SectionHeading, Timeline } from "@/components/shared";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/charts";
import { PeopleTable, InviteButton } from "./people";
import { ExportDossierButton } from "./dossier";
export function CompanyDashboard({ indicators = false }: { indicators?: boolean }) {
  const { state } = useDemo();
  const stats = companyStats(state);
  const history = [
    ...monthlyHistory,
    {
      month: "Ago",
      coverage: stats.percent,
      subsidy: stats.subsidy,
      contracts: stats.contracts,
      platform: stats.platform,
    },
  ];
  const en = companyEnrollments(state).filter((e) => e.status === "active");
  const signed = state.people.filter((p) => p.signed).length;
  return (
    <>
      <PageHeading
        eyebrow="VETOR ENGENHARIA LTDA · DEMONSTRAÇÃO"
        title={
          indicators
            ? "Uma visão mais clara da sua operação."
            : "Proteção que conecta. Escolhas que ficam."
        }
        description="Agosto de 2026 · Acompanhe pessoas, custos e registros com transparência."
      >
        <InviteButton />
      </PageHeading>
      <div className="stat-grid">
        <Stat
          label="Prestadores ativos"
          value={stats.active}
          icon="Users"
          detail={`${state.people.length} profissionais no histórico`}
        />
        <Stat
          label="Com alguma cobertura"
          value={
            <>
              {stats.covered}
              <small> de {stats.active}</small>
            </>
          }
          icon="ShieldCheck"
          trend={`${stats.percent}%`}
          detail="de adesão entre ativos"
        />
        <Stat
          label="Subsídio do mês"
          value={money(stats.subsidy, 2)}
          icon="Gift"
          detail="Valor reservado · política aplicada"
        />
        <Stat
          label="Dossiês pendentes"
          value={stats.pending}
          icon="FolderCheck"
          detail="Aditivos exigem atenção"
        />
      </div>
      <div className="grid-two mb-section">
        <Card className="padded">
          <SectionHeading
            title="Mais proteção, ao longo do tempo"
            description="Profissionais ativos com alguma cobertura"
          />
          <div className="flex-between mb-2">
            <strong className="metric-inline">
              {stats.percent}
              <small>% de adesão</small>
            </strong>
            <Badge tone="blue">Últimos 6 meses · demo</Badge>
          </div>
          <TrendChart data={history} height={210} />
        </Card>
        <Card className="padded">
          <SectionHeading
            title="Proteção em diferentes formas"
            description="Adesão por benefício · contratos ativos"
          />
          <div className="pillars mt-7">
            {["telemedicina", "vida", "odonto", "farmacia", "wellhub"].map((id) => {
              const count = new Set(en.filter((e) => e.productId === id).map((e) => e.personId))
                .size;
              return (
                <div className="pillar-row" key={id}>
                  <div className="flex-between">
                    <span>{products.find((p) => p.id === id)?.name}</span>
                    <strong>
                      {Math.round((count / Math.max(stats.active, 1)) * 100)}%{" "}
                      <span className="muted">· {count} pessoas</span>
                    </strong>
                  </div>
                  <Progress
                    value={(count / Math.max(stats.active, 1)) * 100}
                    label={products.find((p) => p.id === id)?.name}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="grid-two mb-section">
        <div className="reconciliation-card">
          <div className="flex-between">
            <Icon name="Fingerprint" size={26} />
            <Badge tone="blue">ADESÃO FACULTATIVA</Badge>
          </div>
          <h3 className="mt-4">A autonomia também se documenta.</h3>
          <p>
            {state.decisions.length} decisões registradas. {stats.declined} delas são recusas.
            <br />
            Um histórico de escolhas que você pode reconstituir.
          </p>
          <Button asChild>
            <Link href="/empresa/dossies">
              Explorar dossiês
              <Icon name="ArrowRight" size={15} />
            </Link>
          </Button>
        </div>
        <Card className="padded">
          <SectionHeading title="Seu radar documental" />
          <div className="data-row">
            <span>Aditivos registrados</span>
            <strong>
              {signed} de {state.people.length}
            </strong>
          </div>
          <div className="data-row">
            <span>Ativações aguardando confirmação</span>
            <strong>{state.movements.filter((m) => m.status !== "Confirmada").length}</strong>
          </div>
          <div className="data-row">
            <span>Benefícios obrigatórios</span>
            <Badge tone="green">Nenhum</Badge>
          </div>
          <Link className="text-link mt-5" href="/empresa/documentos">
            Cuidar das pendências
            <Icon name="ArrowRight" size={13} />
          </Link>
        </Card>
      </div>
      {!indicators && (
        <>
          <SectionHeading
            title="Pessoas, no centro de tudo"
            description="Acompanhe a situação administrativa de cada prestador."
            href="/empresa/prestadores"
            action="Ver todos os prestadores"
          />
          <Card>
            <PeopleTable people={state.people.slice(0, 5)} compact />
            <div className="table-footer">
              <span>Mostrando 5 de {state.people.length} profissionais</span>
              <Link href="/empresa/prestadores" className="text-link">
                Ver lista completa
                <Icon name="ArrowRight" size={13} />
              </Link>
            </div>
          </Card>
        </>
      )}
      <div className="grid-two mt-6">
        <Card className="padded">
          <SectionHeading title="Últimos registros" href="/empresa/dossies" action="Ver dossiês" />
          <Timeline
            compact
            events={state.events
              .filter(
                (e) => !e.entity.startsWith("portability-") && !e.entity.startsWith("external-"),
              )
              .sort((a, b) => b.at.localeCompare(a.at))
              .slice(0, 3)}
          />
        </Card>
        <Card className="padded">
          <SectionHeading title="Pronto para reconstituir a história" />
          <p className="muted mb-5">
            Exporte ofertas, decisões, documentos e eventos de todos os profissionais. O filtro da
            tabela não limita o documento consolidado.
          </p>
          <ExportDossierButton />
          <p className="muted mt-4">Documento demonstrativo. Não constitui parecer jurídico.</p>
        </Card>
      </div>
    </>
  );
}
