"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { questions } from "@/mocks/seed";
import { products } from "@/mocks/catalog";
import { protection, retirement } from "@/lib/domain";
import { money, shortMoney } from "@/lib/utils";
import {
  PageHeading,
  ScoreRing,
  Progress,
  Badge,
  Disclaimer,
  BackLink,
  Stat,
} from "@/components/shared";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendChart } from "@/components/charts";
export function Assessment() {
  const { state, dispatch } = useDemo();
  const [answers, setAnswers] = useState<Record<string, number>>({}),
    [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const result = protection(state);
  return (
    <>
      <PageHeading
        eyebrow="UM OLHAR PARA O QUE IMPORTA"
        title="Como está sua proteção?"
        description="Seis perguntas. Um próximo passo mais claro."
      />
      <div className="detail-layout">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (answered < 6) {
              toast.warning("Responda às seis perguntas antes de calcular.");
              return;
            }
            dispatch({ type: "assessment", answers });
            setSubmitted(true);
            toast.success("Seu Índice de Proteção foi atualizado.");
          }}
        >
          <div className="flex-between mb-3">
            <span className="muted">Seu diagnóstico</span>
            <Badge tone="blue">{answered} de 6 perguntas</Badge>
          </div>
          <div className="mb-6">
            <Progress value={(answered / 6) * 100} label="Perguntas respondidas" />
          </div>
          {questions.map((q, i) => (
            <Card className="question-card" key={q.id}>
              <fieldset>
                <legend className="question-heading">
                  <span className="question-number">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <small>{q.label.toUpperCase()}</small>
                    <h3>{q.title}</h3>
                  </span>
                </legend>
                <div className="question-options">
                  {q.options.map(([label, value]) => (
                    <label className="question-option" key={label}>
                      <input
                        type="radio"
                        name={q.id}
                        value={value}
                        checked={answers[q.id] === value}
                        required
                        onChange={() => {
                          setAnswers((a) => ({ ...a, [q.id]: value }));
                          setSubmitted(false);
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </Card>
          ))}
          <Button className="w-full" type="submit">
            Ver meu Índice de Proteção
            <Icon name="ArrowRight" size={16} />
          </Button>
        </form>
        <div className="sticky-card">
          <Card className="score-result">
            <div className="eyebrow">
              {submitted ? "SEU DIAGNÓSTICO ATUALIZADO" : "SEU PONTO DE PARTIDA"}
            </div>
            <ScoreRing score={result.score} />
            <Badge tone="blue">
              {submitted ? "Respostas registradas" : "Cenário demonstrativo"}
            </Badge>
            <h3>{result.title}</h3>
            <p>
              {submitted
                ? "Suas respostas e coberturas ativas ajudam a identificar onde começar."
                : "Responda às perguntas para personalizar esta visão. As informações são privadas e não aparecem para a empresa."}
            </p>
            <div className="pillars text-left">
              {result.pillars.map((p) => (
                <div className="pillar-row" key={p.id}>
                  <div className="flex-between">
                    <span>{p.label}</span>
                    <strong>{p.score}%</strong>
                  </div>
                  <Progress value={p.score} label={p.label} />
                </div>
              ))}
            </div>
            <Button variant="outline" asChild>
              <Link href="/app/protecao">
                Ver meu mapa de proteção
                <Icon name="ArrowRight" size={14} />
              </Link>
            </Button>
          </Card>
          <Disclaimer>
            Índice educativo, com pesos iguais entre seis pilares. Não mede saúde clínica nem
            substitui avaliação especializada. Benefícios de desconto não elevam o score.
          </Disclaimer>
          <Link href="/app/indice/aposentadoria" className="mini-benefit mt-5">
            <div className="icon-tile">
              <Icon name="TrendingUp" />
            </div>
            <div>
              <strong>Olhe para o seu futuro</strong>
              <small>Simule sua aposentadoria</small>
            </div>
            <Icon name="ArrowUpRight" size={15} />
          </Link>
        </div>
      </div>
    </>
  );
}
export function ProtectionMap() {
  const { state } = useDemo();
  const { pillars } = protection(state);
  return (
    <>
      <PageHeading
        title="Seu mapa de proteção"
        description="Seis pilares para uma vida profissional com mais tranquilidade."
      >
        <Button variant="outline" asChild>
          <Link href="/app/indice">
            <Icon name="Activity" size={16} />
            Atualizar Índice
          </Link>
        </Button>
      </PageHeading>
      <div className="grid-three">
        {pillars.map((p) => {
          const related = products.filter((b) => b.pillar === p.id);
          const icon = {
            saude: "HeartPulse",
            renda: "ShieldCheck",
            vida: "HeartHandshake",
            aposentadoria: "TrendingUp",
            reserva: "Landmark",
            trabalho: "BriefcaseBusiness",
          }[p.id];
          return (
            <Card className="padded" key={p.id}>
              <div className="flex-between">
                <span className="icon-tile">
                  <Icon name={icon} size={24} />
                </span>
                <Badge tone={p.score >= 75 ? "green" : p.score >= 40 ? "amber" : "neutral"}>
                  {p.score >= 75
                    ? "Protegida"
                    : p.score >= 40
                      ? "Proteção parcial"
                      : "Merece atenção"}
                </Badge>
              </div>
              <h2 className="card-title mt-5">{p.label}</h2>
              <strong className="metric-inline">
                {p.score}
                <small> / 100</small>
              </strong>
              <Progress value={p.score} label={p.label} />
              <p className="muted mt-4">
                {p.score >= 75
                  ? "Mantenha suas coberturas atualizadas e revise as condições periodicamente."
                  : "Existe espaço para fortalecer este pilar. Conheça suas opções antes de decidir."}
              </p>
              <div className="mt-4 min-h-12">
                {related.slice(0, 2).map((b) => (
                  <p key={b.id} className="muted">
                    {b.name}
                  </p>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link
                  href={
                    p.id === "aposentadoria"
                      ? "/app/indice/aposentadoria"
                      : related[0]
                        ? `/app/beneficios/${related[0].id}`
                        : "/app/beneficios/reserva"
                  }
                >
                  {p.id === "aposentadoria" ? "Simular meu futuro" : "Explorar este pilar"}
                  <Icon name="ArrowUpRight" size={14} />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>
      <Disclaimer>
        Proteção declarada e coberturas ativas são combinadas sem somar benefícios equivalentes. O
        Índice é privado e não é disponibilizado à contratante.
      </Disclaimer>
    </>
  );
}
export function Retirement() {
  const [age, setAge] = useState("35"),
    [retire, setRetire] = useState("65"),
    [income, setIncome] = useState("8000"),
    [contribution, setContribution] = useState(500);
  const result =
    age !== "" && income !== ""
      ? retirement({
          age: Number(age),
          retire: Number(retire),
          income: Number(income),
          contribution,
        })
      : null;
  return (
    <>
      <BackLink href="/app/indice" label="Meu Índice de Proteção" />
      <PageHeading
        eyebrow="O FUTURO COMEÇA EM PEQUENOS PASSOS"
        title="Mais possibilidades para o seu amanhã."
        description="Explore como um aporte mensal pode construir uma renda complementar."
      />
      <div className="detail-layout">
        <Card className="padded">
          <h2 className="card-title mb-5">Seu cenário</h2>
          <div className="fields-two">
            <div>
              <label className="field-label" htmlFor="sim-age">
                Idade atual
              </label>
              <Input
                id="sim-age"
                type="number"
                min={18}
                max={80}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="sim-sex">
                Referência de idade
              </label>
              <select
                id="sim-sex"
                className="input"
                value={retire}
                onChange={(e) => setRetire(e.target.value)}
              >
                <option value="65">65 anos · homem</option>
                <option value="62">62 anos · mulher</option>
              </select>
            </div>
          </div>
          <div className="field mt-5">
            <label className="field-label" htmlFor="sim-income">
              Faturamento mensal (R$)
            </label>
            <Input
              id="sim-income"
              type="number"
              min="0"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
          <div className="range-control">
            <label htmlFor="sim-contribution">
              Aporte mensal além do DAS<strong>{money(contribution)}</strong>
            </label>
            <input
              id="sim-contribution"
              type="range"
              min={0}
              max={5000}
              step={50}
              value={contribution}
              onChange={(e) => setContribution(Number(e.target.value))}
            />
            <div className="range-ends">
              <span>R$ 0</span>
              <span>R$ 5.000</span>
            </div>
          </div>
          <Disclaimer>
            Premissas: retorno real hipotético de 4% ao ano, aportes ao final do mês e retiradas por
            25 anos, com o mesmo retorno. Sem impostos ou taxas. Valores reais de hoje.
          </Disclaimer>
        </Card>
        <Card className="padded">
          <div className="eyebrow">UMA VISÃO DO SEU FUTURO</div>
          <p className="muted">DAS + renda dos aportes</p>
          <div className="metric-inline">
            {result ? money(result.total) : "—"}
            <small> / mês</small>
          </div>
          <div className="data-rows mt-5">
            <div className="data-row">
              <span>Somente DAS · hipótese</span>
              <strong>{money(1621)}</strong>
            </div>
            <div className="data-row">
              <span>Renda complementar estimada</span>
              <strong>{result ? money(result.payout) : "—"}</strong>
            </div>
            <div className="data-row">
              <span>Capital acumulado</span>
              <strong>{result ? money(result.capital) : "—"}</strong>
            </div>
            <div className="data-row">
              <span>Reposição do faturamento</span>
              <strong>
                {result?.replacement !== null && result?.replacement !== undefined
                  ? `${Math.round(result.replacement)}%`
                  : "Não aplicável"}
              </strong>
            </div>
          </div>
          {result && (
            <p className="muted mt-5">
              {result.years > 0
                ? `${result.years} anos de aportes até os ${retire} anos.`
                : "Você já atingiu a idade de referência. Não há período futuro de acumulação neste cenário."}
            </p>
          )}
          {!result && (
            <p role="alert" className="field-error mt-5">
              Informe uma idade entre 18 e 80 anos e faturamento igual ou maior que zero.
            </p>
          )}
        </Card>
      </div>
      {result && (
        <Card className="padded mt-6">
          <div className="flex-between mb-4">
            <h2 className="card-title">A construção do seu patrimônio</h2>
            <Badge tone="blue">{shortMoney(result.capital)} estimados</Badge>
          </div>
          <TrendChart
            data={result.points}
            x="year"
            currency
            height={260}
            keys={[
              { key: "capital", label: "Patrimônio", color: "#4878df" },
              { key: "saved", label: "Aportes", color: "#9bacbf" },
            ]}
          />
          <div className="flex-between mt-3">
            <small className="muted">Azul: patrimônio com retorno hipotético</small>
            <small className="muted">Cinza: soma dos aportes</small>
          </div>
        </Card>
      )}
      <Disclaimer kind="warning">
        Estimativa educativa. Não constitui recomendação de investimento nem cálculo previdenciário
        oficial. O benefício-base de R$ 1.621 é uma hipótese de salário mínimo de 2026, condicionada
        ao cumprimento dos requisitos previdenciários e ao histórico contributivo. Idade,
        isoladamente, não garante aposentadoria.
      </Disclaimer>
    </>
  );
}
