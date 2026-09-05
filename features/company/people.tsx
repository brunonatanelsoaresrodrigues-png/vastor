"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { companyEnrollments, enrollmentTotals } from "@/lib/domain";
import { productById } from "@/mocks/catalog";
import { money, normalize, dateLabel } from "@/lib/utils";
import {
  PageHeading,
  Avatar,
  Badge,
  SearchField,
  Segments,
  EmptyState,
  BackLink,
  Stat,
  Timeline,
  Disclaimer,
  SectionHeading,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
import type { Person, Role } from "@/types";
import { Dossier } from "@/features/company/dossier";
const inviteSchema = z.object({
  name: z.string().min(3, "Informe um nome fictício."),
  email: z
    .email("E-mail inválido.")
    .refine((v) => v.endsWith("@vastor.demo"), "Use um e-mail fictício @vastor.demo."),
});
export function InviteButton() {
  const { dispatch } = useDemo();
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof inviteSchema>>({ resolver: zodResolver(inviteSchema) });
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon name="Plus" size={15} />
        Convidar prestador
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Um convite para mais proteção"
        description="Simule um convite. Nenhuma mensagem será enviada."
      >
        <form
          className="invite-form"
          onSubmit={handleSubmit(async (v) => {
            setBusy(true);
            await new Promise((r) => setTimeout(r, 400));
            dispatch({ type: "invite", ...v, at: new Date().toISOString() });
            setBusy(false);
            setOpen(false);
            reset();
            toast.success("Convite demonstrativo registrado. Nenhum e-mail enviado.");
          })}
        >
          <div>
            <label className="field-label" htmlFor="invite-name">
              Nome fictício
            </label>
            <Input id="invite-name" placeholder="Ex.: Paula Demo" {...register("name")} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="invite-email">
              E-mail fictício
            </label>
            <Input id="invite-email" placeholder="paula@vastor.demo" {...register("email")} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>
          <Disclaimer>
            A oferta é facultativa. O convite não cria contrato ou vínculo e fica apenas no
            histórico da demo.
          </Disclaimer>
          <Button disabled={busy}>
            {busy ? <Icon name="LoaderCircle" className="spin" /> : "Registrar convite demo"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
export function PeopleTable({
  people,
  base = "/empresa/prestadores",
  compact = false,
}: {
  people: Person[];
  base?: string;
  compact?: boolean;
}) {
  const { state } = useDemo();
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Profissional</th>
            {!compact && <th>Contrato desde</th>}
            <th>Proteções</th>
            <th>Decisões</th>
            {!compact && (
              <>
                <th>Contrato / mês</th>
                <th>Subsídio</th>
              </>
            )}
            <th>Dossiê</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {people.map((p) => {
            const en = companyEnrollments(state, p.id);
            const dec = state.decisions.filter((d) => d.personId === p.id);
            return (
              <tr key={p.id}>
                <td>
                  <Link className="person-cell" href={`${base}/${p.id}`}>
                    <Avatar name={p.name} />
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {p.cnpj}
                        {!p.active ? " · contrato encerrado" : ""}
                      </small>
                    </div>
                  </Link>
                </td>
                {!compact && <td>{dateLabel(p.startedAt)}</td>}
                <td>
                  <div className="table-tags">
                    {en.slice(0, 2).map((e) => (
                      <Badge key={e.id} tone={e.status === "pending" ? "amber" : "neutral"}>
                        {productById(e.productId)?.name}
                      </Badge>
                    ))}
                    {en.length > 2 && <Badge>+{en.length - 2}</Badge>}
                    {!en.length && (
                      <span className="muted">{p.active ? "Sem cobertura" : "Portado"}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="positive">
                    {dec.filter((d) => d.choice === "accepted").length} aceites
                  </span>
                  <br />
                  <small className="muted">
                    {dec.filter((d) => d.choice === "declined").length} recusas
                  </small>
                </td>
                {!compact && (
                  <>
                    <td className="numbers">{money(p.contract)}</td>
                    <td className="numbers">{money(enrollmentTotals(en).subsidy, 2)}</td>
                  </>
                )}
                <td>
                  <Badge tone={p.signed ? "green" : "amber"} dot>
                    {p.signed ? "Completo" : "Pendente"}
                  </Badge>
                </td>
                <td>
                  <Link
                    className="table-link"
                    aria-label={`Ver ${p.name}`}
                    href={`${base}/${p.id}`}
                  >
                    <Icon name="ArrowUpRight" size={15} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!people.length && (
        <EmptyState
          title="Nenhum profissional encontrado"
          description="Ajuste a busca ou selecione outro filtro."
        />
      )}
    </div>
  );
}
export function People({ role = "company" }: { role?: Role }) {
  const { state } = useDemo();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const has = (id: string) => companyEnrollments(state, id).some((e) => e.status === "active");
  const filtered = state.people.filter(
    (p) =>
      normalize(`${p.name} ${p.cnpj}`).includes(normalize(query)) &&
      (filter === "all" ||
        (filter === "covered" && has(p.id)) ||
        (filter === "none" && !has(p.id) && p.active) ||
        (filter === "declined" &&
          state.decisions.some((d) => d.personId === p.id && d.choice === "declined")) ||
        (filter === "pending" && !p.signed) ||
        (filter === "ported" && !p.active)),
  );
  return (
    <>
      <PageHeading
        title={role === "admin" ? "Pessoas na Vastor Capital" : "Pessoas que fazem parte."}
        description="Proteção, escolhas e registros de cada profissional, em uma visão."
      >
        <InviteButton />
      </PageHeading>
      <div className="toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nome ou CNPJ fictício"
        />
        <span className="muted">
          {state.people.length} profissionais · {state.people.filter((p) => p.active).length}{" "}
          contratos ativos
        </span>
      </div>
      <div className="mb-section">
        <Segments
          items={[
            { id: "all", label: "Todos", count: state.people.length },
            { id: "covered", label: "Com cobertura" },
            { id: "none", label: "Sem cobertura" },
            { id: "declined", label: "Com recusa" },
            { id: "pending", label: "Dossiê pendente" },
            { id: "ported", label: "Portabilidade" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <Card>
        <PeopleTable
          people={filtered}
          base={role === "admin" ? "/admin/pessoas" : "/empresa/prestadores"}
        />
        <div className="table-footer">
          <span>
            {filtered.length} de {state.people.length} profissionais
          </span>
          <span>Identificadores fictícios · sem CPF/CNPJ real</span>
        </div>
      </Card>
      <Disclaimer>
        A contratante vê somente informações administrativas. Dados clínicos, atendimentos e
        respostas ao Índice de Proteção são privados.
      </Disclaimer>
    </>
  );
}
export function PersonDetail({ id, role = "company" }: { id: string; role?: Role }) {
  const { state } = useDemo();
  const [dossier, setDossier] = useState(false);
  const p = state.people.find((p) => p.id === id);
  if (!p) return <EmptyState title="Profissional não encontrado" />;
  const en = companyEnrollments(state, id),
    dec = state.decisions.filter((d) => d.personId === id),
    events = state.events.filter(
      (e) =>
        e.personId === id &&
        !e.entity.startsWith("portability-") &&
        !e.entity.startsWith("external-"),
    );
  return (
    <>
      <BackLink
        href={role === "admin" ? "/admin/pessoas" : "/empresa/prestadores"}
        label="Todos os profissionais"
      />
      <div className="person-header">
        <Avatar name={p.name} size="large" />
        <div>
          <h1>{p.name}</h1>
          <p>
            {p.cnpj} · {p.occupation}
            <br />
            Contrato desde {dateLabel(p.startedAt)}
          </p>
        </div>
        <Badge tone={p.active ? "green" : "neutral"} dot>
          {p.active ? "Contrato ativo" : "Contrato encerrado"}
        </Badge>
      </div>
      <div className="stat-grid">
        <Stat
          label="Proteções na contratante"
          value={en.length}
          icon="ShieldCheck"
          detail="Ativas e em ativação"
        />
        <Stat
          label="Escolhas registradas"
          value={dec.length}
          icon="ListChecks"
          detail={`${dec.filter((d) => d.choice === "declined").length} recusas · escolhas independentes`}
        />
        <Stat
          label="Subsídio reservado"
          value={money(enrollmentTotals(en).subsidy, 2)}
          icon="Gift"
          detail="Na competência atual"
        />
        <Stat
          label="Dossiê"
          value={p.signed ? "Completo" : "Pendente"}
          icon="FolderCheck"
          detail={p.signed ? "Aditivo e registros disponíveis" : "Aditivo requer atenção"}
        />
      </div>
      <div className="detail-layout">
        <Card className="padded">
          <SectionHeading
            title="Cada escolha tem uma história"
            description="Eventos administrativos, com responsáveis e versões."
          />
          <Timeline events={events} />
        </Card>
        <div className="stack">
          <Card className="padded">
            <SectionHeading title="Benefícios desta contratante" />
            {en.map((e) => (
              <div key={e.id} className="data-row">
                <span>{productById(e.productId)?.name}</span>
                <Badge tone={e.status === "active" ? "green" : "amber"}>
                  {e.status === "active" ? "Ativo" : "Em ativação"}
                </Badge>
              </div>
            ))}
            {!en.length && (
              <p className="muted">Nenhuma cobertura subsidiada por esta contratante.</p>
            )}
            <div className="data-row mt-3">
              <span>Contrato mensal</span>
              <strong>{money(p.contract)}</strong>
            </div>
          </Card>
          <div className="reconciliation-card">
            <Icon name="Fingerprint" size={26} />
            <h3 className="mt-4">
              Escolhas que podem
              <br />
              ser reconstituídas.
            </h3>
            <p>Oferta, decisão, política e documento reunidos em um único dossiê.</p>
            <Button onClick={() => setDossier(true)}>
              Visualizar dossiê
              <Icon name="ArrowUpRight" size={14} />
            </Button>
          </div>
          <Disclaimer>
            Nenhum índice individual, informação de saúde ou proteção externa é apresentado à
            contratante.
          </Disclaimer>
        </div>
      </div>
      <Modal
        wide
        open={dossier}
        onOpenChange={setDossier}
        title="Dossiê individual"
        description="Documento demonstrativo. Não constitui parecer jurídico."
      >
        <Dossier personId={id} />
      </Modal>
    </>
  );
}
