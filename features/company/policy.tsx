"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { currentPolicy, companyEnrollments } from "@/lib/domain";
import { DEMO_DATE } from "@/mocks/seed";
import { dateLabel, money } from "@/lib/utils";
import { PageHeading, SectionHeading, Badge, Disclaimer, Stat } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
import type { SubsidyPolicy } from "@/types";
const policySchema = z.object({
  cap: z.number().min(0).max(1000),
  participation: z.number().min(0).max(100),
  minDays: z.number().int().min(0).max(3650),
  effectiveAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
    .refine(
      (v) => Number.isFinite(Date.parse(v)) && v >= DEMO_DATE,
      "Use a data da demo (28/08/2026) ou uma data posterior.",
    ),
});
export function Policy() {
  const { state, dispatch } = useDemo();
  const policy = currentPolicy(state)!;
  const [cap, setCap] = useState(policy.cap),
    [share, setShare] = useState(policy.participation),
    [open, setOpen] = useState(false),
    [selected, setSelected] = useState<SubsidyPolicy | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof policySchema>>({
    resolver: zodResolver(policySchema),
    defaultValues: { cap: 180, participation: 70, minDays: 90, effectiveAt: "2026-09-01" },
  });
  const eligible = state.people.filter(
    (p) =>
      p.active &&
      p.signed &&
      (Date.parse(DEMO_DATE) - Date.parse(p.startedAt)) / 86400000 >= policy.minDays,
  );
  const estimated = eligible.reduce(
    (a, p) =>
      a +
      Math.min(
        cap,
        (companyEnrollments(state, p.id).reduce((n, e) => n + e.price, 0) * share) / 100,
      ),
    0,
  );
  const v = selected ?? policy;
  return (
    <>
      <PageHeading
        eyebrow="LIBERDADE DE ESCOLHA, COM REGRAS CLARAS"
        title="Uma política que apoia. Sem obrigar."
        description="Cada versão é preservada. Cada oferta sabe qual regra estava em vigor."
      >
        <Button onClick={() => setOpen(true)}>
          <Icon name="Plus" size={15} />
          Criar nova versão
        </Button>
      </PageHeading>
      <div className="detail-layout">
        <div className="stack">
          <Card className="padded">
            <div className="flex-between mb-5">
              <h2 className="card-title">
                {selected ? `Política v${v.version}` : "Política vigente"}
              </h2>
              <Badge tone="blue">
                v{v.version} ·{" "}
                {v.effectiveAt > DEMO_DATE ? "Agendada" : selected ? "Histórico" : "Vigente"}
              </Badge>
            </div>
            <div className="data-rows">
              <div className="data-row">
                <span>Modelo</span>
                <strong>Cofinanciado</strong>
              </div>
              <div className="data-row">
                <span>Teto por profissional</span>
                <strong>{money(v.cap)} / mês</strong>
              </div>
              <div className="data-row">
                <span>Participação da contratante</span>
                <strong>{v.participation}%</strong>
              </div>
              <div className="data-row">
                <span>Elegibilidade</span>
                <strong>A partir de {v.minDays} dias</strong>
              </div>
              <div className="data-row">
                <span>Adesão</span>
                <Badge tone="green">Facultativa</Badge>
              </div>
              <div className="data-row">
                <span>Vigência</span>
                <strong>{dateLabel(v.effectiveAt)}</strong>
              </div>
            </div>
            {selected && (
              <Button variant="ghost" className="mt-4" onClick={() => setSelected(null)}>
                Voltar à política vigente
              </Button>
            )}
            <Disclaimer>
              A data de referência desta demo é 28/08/2026. Uma nova versão não altera ofertas ou
              adesões já registradas. A simulação abaixo não aplica mudanças.
            </Disclaimer>
          </Card>
          <Card className="padded">
            <SectionHeading
              title="Explore um novo cenário"
              description="Simulação de custo com a carteira atual, sem alterar a política."
            />
            <div className="range-control">
              <label htmlFor="policy-cap">
                Teto por profissional<strong>{money(cap)}</strong>
              </label>
              <input
                id="policy-cap"
                type="range"
                min={0}
                max={1000}
                step={10}
                value={cap}
                onChange={(e) => setCap(Number(e.target.value))}
              />
              <div className="range-ends">
                <span>R$ 0</span>
                <span>R$ 1.000</span>
              </div>
            </div>
            <div className="range-control">
              <label htmlFor="policy-share">
                Participação da contratante<strong>{share}%</strong>
              </label>
              <input
                id="policy-share"
                type="range"
                min={0}
                max={100}
                value={share}
                onChange={(e) => setShare(Number(e.target.value))}
              />
              <div className="range-ends">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="grid-three mt-7">
              <div>
                <p className="muted">Custo mensal estimado</p>
                <strong className="metric-inline">{money(estimated)}</strong>
              </div>
              <div>
                <p className="muted">Profissionais elegíveis</p>
                <strong className="metric-inline">{eligible.length}</strong>
              </div>
              <div>
                <p className="muted">Custo médio</p>
                <strong className="metric-inline">
                  {money(estimated / Math.max(eligible.length, 1))}
                </strong>
              </div>
            </div>
            <Disclaimer>
              Adesão mantida conforme a carteira atual. A simulação não prevê comportamento futuro
              nem compromete valores.
            </Disclaimer>
          </Card>
        </div>
        <div className="stack">
          <Card>
            <div className="padded">
              <h2 className="card-title">Uma história de evolução</h2>
              <p className="muted mt-1">Versões anteriores nunca são sobrescritas.</p>
            </div>
            {[...state.policies].reverse().map((p) => (
              <div className="policy-version" key={p.id}>
                <span className="icon-tile">
                  <Icon name="FileCheck2" size={19} />
                </span>
                <div>
                  <strong>Política v{p.version}</strong>
                  <small>
                    {dateLabel(p.effectiveAt)} · {money(p.cap)}
                  </small>
                  <Badge
                    tone={
                      p.effectiveAt > DEMO_DATE ? "amber" : p.id === policy.id ? "green" : "neutral"
                    }
                  >
                    {p.effectiveAt > DEMO_DATE
                      ? "Agendada"
                      : p.id === policy.id
                        ? "Vigente"
                        : "Histórico"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Visualizar política v${p.version}`}
                  onClick={() => setSelected(p)}
                >
                  <Icon name="Eye" size={16} />
                </Button>
              </div>
            ))}
          </Card>
          <div className="ledger-note">
            <Icon name="Fingerprint" size={25} />
            <div>
              <strong>Versionamento com contexto</strong>
              <p>O dossiê preserva a versão da oferta, mesmo quando a política evolui.</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Uma nova versão. O histórico fica."
        description="A nova política será registrada sem sobrescrever as anteriores."
      >
        <form
          onSubmit={handleSubmit((data) => {
            dispatch({ type: "policy", policy: { ...data, createdAt: new Date().toISOString() } });
            toast.success(
              `Política v${Math.max(...state.policies.map((p) => p.version)) + 1} criada. Histórico preservado.`,
            );
            setOpen(false);
            reset();
          })}
        >
          <div className="fields-two">
            <div className="field">
              <label className="field-label" htmlFor="new-cap">
                Teto mensal (R$)
              </label>
              <Input id="new-cap" type="number" {...register("cap", { valueAsNumber: true })} />
              {errors.cap && <p className="field-error">Informe um valor entre 0 e 1.000.</p>}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="new-share">
                Participação (%)
              </label>
              <Input
                id="new-share"
                type="number"
                {...register("participation", { valueAsNumber: true })}
              />
              {errors.participation && <p className="field-error">Informe de 0 a 100%.</p>}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="new-days">
                Tempo mínimo (dias)
              </label>
              <Input
                id="new-days"
                type="number"
                {...register("minDays", { valueAsNumber: true })}
              />
              {errors.minDays && <p className="field-error">Informe de 0 a 3.650 dias.</p>}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="new-date">
                Início da vigência
              </label>
              <Input id="new-date" type="date" min={DEMO_DATE} {...register("effectiveAt")} />
              {errors.effectiveAt && <p className="field-error">{errors.effectiveAt.message}</p>}
            </div>
          </div>
          <Disclaimer>
            Adesão facultativa permanece obrigatória como regra do produto. Contratações existentes
            não são recalculadas.
          </Disclaimer>
          <div className="report-actions">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Voltar
            </Button>
            <Button type="submit">Registrar nova versão</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
