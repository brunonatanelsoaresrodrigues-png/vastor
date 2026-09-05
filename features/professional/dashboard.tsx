"use client";
import { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/hooks/use-demo";
import {
  activeEnrollments,
  enrollmentTotals,
  protection,
  currentPolicy,
  companyEnrollments,
} from "@/lib/domain";
import { money } from "@/lib/utils";
import { products } from "@/mocks/catalog";
import { Icon } from "@/components/icons";
import {
  Badge,
  PageHeading,
  SectionHeading,
  Stat,
  ScoreRing,
  Progress,
  Timeline,
} from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
export function ProfessionalDashboard() {
  const { state, dispatch } = useDemo();
  const [step, setStep] = useState(0);
  const { score, title, pillars, weakest } = protection(state);
  const active = activeEnrollments(state, "p1"),
    totals = enrollmentTotals(active);
  const offers = state.offers.filter(
    (o) => o.personId === "p1" && !state.decisions.some((d) => d.offerId === o.id),
  );
  const used = companyEnrollments(state, "p1").reduce((a, e) => a + e.subsidy, 0),
    remaining = Math.max(0, (currentPolicy(state)?.cap ?? 0) - used);
  const risk = weakest[0];
  return (
    <>
      <PageHeading
        title={`Bom dia, ${state.profile.name.split(" ")[0]}.`}
        description="Um novo dia para cuidar do que importa."
      >
        <span className="date-pill">
          <Icon name="Clock" size={14} />
          Sexta-feira, 28 de agosto de 2026
        </span>
      </PageHeading>
      <div className="welcome-banner">
        <div>
          <span className="eyebrow">SUA PROTEÇÃO É SUA</span>
          <h2>
            Seu trabalho muda.
            <br />
            <span>Sua proteção continua.</span>
          </h2>
          <p>Contratantes podem ajudar no custo. Você continua no controle.</p>
          <Link href="/app/carteira" className="text-link">
            Conheça sua carteira de proteção
            <Icon name="ArrowRight" size={13} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <Icon name="ShieldCheck" />
          <span className="banner-mini one">
            <Icon name="Heart" size={11} />
            Cuidado com você
          </span>
          <span className="banner-mini two">
            <Icon name="Check" size={11} />
            Liberdade para escolher
          </span>
        </div>
      </div>
      <div className="stat-grid">
        <Stat
          label="Proteções ativas"
          value={active.length}
          icon="ShieldCheck"
          detail="Vastor Capital e proteções externas"
        />
        <Stat
          label="Subsídio recebido"
          value={money(totals.subsidy, 2)}
          icon="Gift"
          detail="Apoio da sua contratante"
        />
        <Stat
          label="Seu custo mensal"
          value={money(totals.own, 2)}
          icon="Wallet"
          detail="Inclui proteção externa"
        />
        <Stat
          label="Ofertas para você"
          value={
            <>
              {offers.length}
              <small> disponíveis</small>
            </>
          }
          icon="Compass"
          detail="Você decide, sem obrigação"
        />
      </div>
      <div className="professional-main">
        <Card className="protection-card">
          <div className="flex-between">
            <h2 className="card-title">Seu Índice de Proteção</h2>
            <Badge tone="blue">6 pilares</Badge>
          </div>
          <div className="protection-score">
            <ScoreRing score={score} />
            <Badge tone="amber">{title}</Badge>
            <span className="score-change">
              {state.assessmentCompleted
                ? "Atualizado com suas respostas"
                : "Diagnóstico demonstrativo inicial"}
            </span>
          </div>
          <div className="pillars">
            {pillars.map((p) => (
              <div className="pillar-row" key={p.id}>
                <div className="flex-between">
                  <span>{p.label}</span>
                  <strong>{p.score}%</strong>
                </div>
                <Progress value={p.score} label={p.label} />
              </div>
            ))}
          </div>
          <div className="protection-footer">
            <span>Um olhar completo sobre sua proteção</span>
            <Link href="/app/indice" className="text-link">
              Atualizar meu Índice
              <Icon name="ArrowRight" size={13} />
            </Link>
          </div>
        </Card>
        <Card className="next-step">
          <div className="eyebrow">
            SEU PRÓXIMO PASSO
            <Icon name="Sparkles" size={14} className="inline ml-2" />
          </div>
          <h3>
            {risk
              ? `Mais tranquilidade para ${risk.id === "renda" ? "sua renda" : risk.id === "reserva" ? "os imprevistos" : "o seu futuro"}.`
              : "Sua proteção está bem distribuída."}
          </h3>
          <p>
            {risk
              ? `O pilar ${risk.label.toLowerCase()} merece sua atenção. Entenda sua exposição antes de escolher o próximo passo.`
              : "Revise as condições das suas coberturas e mantenha suas informações atualizadas."}
          </p>
          <Button asChild>
            <Link href={risk?.id === "renda" ? "/app/beneficios/renda" : "/app/protecao"}>
              Ver formas de me proteger
              <Icon name="ArrowRight" size={15} />
            </Link>
          </Button>
          <div className="risk-numbers">
            <div>
              <small>2 MESES SEM FATURAR</small>
              <strong>{money(state.people[0].contract * 2)}</strong>
            </div>
            <div>
              <small>RESERVA ILUSTRATIVA</small>
              <strong>{money(8200)}</strong>
            </div>
            <div>
              <small>LACUNA DE RECEITA</small>
              <strong>{money(Math.max(0, state.people[0].contract * 2 - 8200))}</strong>
            </div>
          </div>
        </Card>
      </div>
      <SectionHeading
        title="Escolhas que cuidam de você"
        description="Proteção e bem-estar, no seu tempo."
        href="/app/beneficios"
        action="Explorar benefícios"
      />
      <div className="grid-three mb-section">
        {[
          products.find((p) => p.id === "renda")!,
          products.find((p) => p.id === "psicologia")!,
          products.find((p) => p.id === "wellhub")!,
        ].map((p) => (
          <Link key={p.id} href={`/app/beneficios/${p.id}`} className="mini-benefit">
            <div className="icon-tile">
              <Icon name={p.icon} size={20} />
            </div>
            <div>
              <strong>{p.name}</strong>
              <small>A partir de {money(p.price)} / mês · preço cheio</small>
            </div>
            <Icon name="ArrowUpRight" size={16} />
          </Link>
        ))}
      </div>
      <div className="grid-two">
        <Card className="padded">
          <SectionHeading
            title="Suas últimas escolhas"
            href="/app/historico"
            action="Ver histórico"
          />
          <Timeline
            compact
            events={state.events
              .filter((e) => e.personId === "p1")
              .sort((a, b) => b.at.localeCompare(a.at))
              .slice(0, 3)}
          />
        </Card>
        <Card className="padded">
          <SectionHeading title="Um apoio para suas escolhas" />
          <div className="flex-between mb-4">
            <div>
              <p className="muted">Saldo disponível na política</p>
              <strong className="metric-inline">
                {money(remaining, 2)}
                <small> / mês</small>
              </strong>
            </div>
            <span className="icon-tile">
              <Icon name="Gift" size={24} />
            </span>
          </div>
          <Progress
            value={(used / (currentPolicy(state)?.cap || 1)) * 100}
            label="Subsídio utilizado"
          />
          <div className="flex-between mt-3">
            <small className="muted">{money(used, 2)} reservado</small>
            <small className="muted">Teto de {money(currentPolicy(state)?.cap ?? 0)}</small>
          </div>
          <p className="muted mt-5">
            Vetor Engenharia apoia sua proteção. A escolha de cada benefício continua sendo sua.
          </p>
          <Link className="text-link mt-4" href="/app/ofertas">
            Ver minhas ofertas
            <Icon name="ArrowRight" size={13} />
          </Link>
        </Card>
      </div>
      <Modal
        open={!state.onboarded}
        onOpenChange={(v) => {
          if (!v) dispatch({ type: "onboard" });
        }}
        title="Bem-vinda à Vastor Capital"
        description="Três passos para conhecer seu espaço de proteção."
      >
        <div className="onboarding-steps">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i <= step ? "active" : ""} />
          ))}
        </div>
        <div className="onboarding-content">
          <div className="icon-tile">
            <Icon name={["ShieldCheck", "Activity", "Compass"][step]} size={34} />
          </div>
          <h3>
            {["Sua proteção é sua.", "Entenda onde você está.", "Escolha no seu tempo."][step]}
          </h3>
          <p>
            {
              [
                "Contratantes podem ajudar no custo. Você continua no controle das escolhas, mesmo quando seu trabalho muda.",
                "Seis perguntas para olhar para sua saúde, renda, família, futuro, reserva e trabalho.",
                "Aceitar e recusar são escolhas igualmente válidas. Tudo fica registrado, sem alterar seu contrato de prestação.",
              ][step]
            }
          </p>
        </div>
        <div className="flex-between mt-6">
          <Button variant="ghost" onClick={() => dispatch({ type: "onboard" })}>
            Explorar depois
          </Button>
          <Button onClick={() => (step < 2 ? setStep(step + 1) : dispatch({ type: "onboard" }))}>
            {step < 2 ? "Próximo" : "Começar"}
            <Icon name="ArrowRight" size={15} />
          </Button>
        </div>
      </Modal>
    </>
  );
}
