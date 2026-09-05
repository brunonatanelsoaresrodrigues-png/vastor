"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { products, providers, productById } from "@/mocks/catalog";
import { eligibility, currentPolicy, companyEnrollments } from "@/lib/domain";
import { money, normalize, dateLabel } from "@/lib/utils";
import type { Product, Role } from "@/types";
import {
  Badge,
  PageHeading,
  SearchField,
  Segments,
  EmptyState,
  Disclaimer,
  BackLink,
} from "@/components/shared";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
const categories = [
  "Todos",
  "Saúde",
  "Bem-estar",
  "Proteção",
  "Financeiro",
  "Trabalho",
  "Educação",
  "Vantagens",
];
export function BenefitCard({
  product: p,
  base = "/app/beneficios",
  professional = true,
}: {
  product: Product;
  base?: string;
  professional?: boolean;
}) {
  const { state } = useDemo();
  const e = eligibility(state, "p1", p);
  const owned = state.enrollments.find(
    (x) =>
      x.personId === "p1" &&
      x.productId === p.id &&
      x.companyId === "vetor" &&
      ["active", "pending"].includes(x.status),
  );
  const decision = state.decisions.find((d) => d.personId === "p1" && d.productId === p.id);
  return (
    <Card className="benefit-card">
      <div className="benefit-top">
        <span
          className={`icon-tile ${p.category === "Bem-estar" ? "green" : p.category === "Trabalho" ? "amber" : ""}`}
        >
          <Icon name={p.icon} size={23} />
        </span>
        <Badge tone={professional ? (owned ? "green" : !e.eligible ? "amber" : "blue") : "neutral"}>
          {professional
            ? owned
              ? owned.status === "pending"
                ? "Em ativação"
                : "Na sua carteira"
              : decision?.choice === "declined"
                ? "Recusa registrada"
                : e.eligible
                  ? "Elegível"
                  : "Indisponível"
            : p.category}
        </Badge>
      </div>
      <h3>{p.name}</h3>
      <p className="benefit-description">{p.description}</p>
      <div className="benefit-price">
        <div>
          <small>{professional ? "Você paga" : "Preço demonstrativo"}</small>
          <strong>
            {money(
              professional ? (owned ? owned.price - owned.subsidy : e.finalPrice) : p.price,
              2,
            )}
            <span>/mês</span>
          </strong>
        </div>
        {professional && (
          <div className="benefit-original">
            <small>Preço cheio {money(p.price, 2)}</small>
            <b>{money(owned?.subsidy ?? e.subsidy, 2)} de subsídio</b>
          </div>
        )}
      </div>
      <Button asChild variant="outline">
        <Link href={`${base}/${p.id}`}>
          Ver benefício
          <Icon name="ArrowUpRight" size={14} />
        </Link>
      </Button>
    </Card>
  );
}
export function Catalog({ role = "professional" }: { role?: Role }) {
  const { state } = useDemo();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("Todos");
  const filtered = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      normalize(`${p.name} ${p.description}`).includes(normalize(query)),
  );
  const professional = role === "professional",
    base = professional
      ? "/app/beneficios"
      : role === "company"
        ? "/empresa/beneficios"
        : "/admin/produtos";
  const used = companyEnrollments(state, "p1").reduce((a, e) => a + e.subsidy, 0);
  return (
    <>
      <PageHeading
        eyebrow={professional ? "NO SEU TEMPO, DO SEU JEITO" : "CATÁLOGO DEMONSTRATIVO"}
        title={professional ? "Benefícios que fazem sentido para você." : "Catálogo de benefícios"}
        description={
          professional
            ? "Conheça as possibilidades. A escolha é sempre sua."
            : "Proteção, saúde e bem-estar para diferentes jornadas profissionais."
        }
      />
      {professional && (
        <div className="catalog-summary">
          <Icon name="Gift" size={24} />
          <div>
            <strong>
              Você tem {money(Math.max(0, (currentPolicy(state)?.cap ?? 0) - used), 2)} de subsídio
              disponível.
            </strong>
            <p>
              Vetor Engenharia participa com {currentPolicy(state)?.participation}% por produto, até
              o teto de {money(currentPolicy(state)?.cap ?? 0)} / mês. O saldo é compartilhado entre
              suas escolhas.
            </p>
          </div>
          <Link href="/app/financeiro" className="text-link">
            Entenda seu saldo
            <Icon name="ArrowUpRight" size={13} />
          </Link>
        </div>
      )}
      <div className="toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar benefício" />
        <span className="muted">{filtered.length} possibilidades para explorar</span>
      </div>
      <div className="mb-section">
        <Segments
          items={categories.map((c) => ({ id: c, label: c }))}
          value={category}
          onChange={setCategory}
        />
      </div>
      <div className="benefit-grid">
        {filtered.map((p) => (
          <BenefitCard key={p.id} product={p} base={base} professional={professional} />
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="Nenhum benefício encontrado"
          description="Experimente outra categoria ou palavra."
        />
      )}
      <Disclaimer>
        Catálogo, preços e fornecedores demonstrativos. Wellhub é uma referência de marca e não
        implica parceria comercial.
      </Disclaimer>
    </>
  );
}
export function BenefitDetail({ id, role = "professional" }: { id: string; role?: Role }) {
  const { state, dispatch } = useDemo();
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null),
    [busy, setBusy] = useState(false);
  const p = productById(id);
  if (!p) return <EmptyState title="Benefício não encontrado" />;
  const e = eligibility(state, "p1", p),
    professional = role === "professional";
  const owned = companyEnrollments(state, "p1").find((x) => x.productId === p.id);
  const decision = state.decisions.find((d) => d.personId === "p1" && d.productId === p.id);
  const pendingOffer = state.offers.find(
    (o) =>
      o.personId === "p1" &&
      o.productId === p.id &&
      !state.decisions.some((d) => d.offerId === o.id),
  );
  const provider = providers.find((x) => x.id === p.providerId);
  const locked = !!owned || (!!decision && !pendingOffer);
  const confirm = async () => {
    if (!choice) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 350));
    dispatch({ type: "decide", productId: p.id, choice, at: new Date().toISOString() });
    toast.success(
      choice === "accepted"
        ? "Aceite registrado. Aguardando ativação simulada."
        : "Decisão registrada. Sua recusa não altera o contrato.",
    );
    setChoice(null);
    setBusy(false);
  };
  return (
    <>
      <BackLink
        href={
          professional
            ? "/app/beneficios"
            : role === "company"
              ? "/empresa/beneficios"
              : "/admin/produtos"
        }
        label="Todos os benefícios"
      />
      <div className="detail-layout">
        <Card>
          <div className="detail-intro">
            <div className="icon-tile">
              <Icon name={p.icon} size={31} />
            </div>
            <Badge tone="blue">{p.category}</Badge>
            <h1 className="mt-3">{p.name}</h1>
            <p>{p.description}</p>
            <p className="mt-3 text-xs">Oferecido por {provider?.name}</p>
          </div>
          <div className="detail-section">
            <h3>O que está incluído</h3>
            <p className="muted">{p.coverage}</p>
          </div>
          <div className="detail-section">
            <h3>Condições com clareza</h3>
            <ul className="check-list">
              {p.conditions.map((c) => (
                <li key={c}>
                  <Icon name="CheckCircle2" size={16} />
                  {c}
                </li>
              ))}
            </ul>
            <div className="data-rows mt-3">
              <div className="data-row">
                <span>Carência</span>
                <strong>{p.waiting}</strong>
              </div>
              <div className="data-row">
                <span>Início estimado</span>
                <strong>Após confirmação do fornecedor na demo</strong>
              </div>
              <div className="data-row">
                <span>Política de referência</span>
                <strong>v{e.version} · adesão facultativa</strong>
              </div>
            </div>
          </div>
          <div className="detail-section">
            <h3>Perguntas frequentes</h3>
            <div className="faq">
              <details>
                <summary>Sou obrigada a aceitar?</summary>
                <p>
                  Não. Você pode aceitar ou recusar. Sua decisão não altera seu contrato de
                  prestação de serviços.
                </p>
              </details>
              <details>
                <summary>O que acontece se meu contrato terminar?</summary>
                <p>
                  O subsídio da contratante termina. Você poderá avaliar a continuidade por
                  pagamento próprio, conforme as condições do produto.
                </p>
              </details>
              <details>
                <summary>Existe cobrança nesta demonstração?</summary>
                <p>
                  Não. Todos os valores, termos e ativações são fictícios. Nenhum pagamento é
                  realizado.
                </p>
              </details>
            </div>
            <Link
              className="text-link mt-5"
              href={
                professional
                  ? "/app/documentos"
                  : role === "company"
                    ? "/empresa/documentos"
                    : "/admin/documentos"
              }
            >
              <Icon name="FileText" size={15} />
              Consultar documentos demonstrativos
            </Link>
          </div>
        </Card>
        <div className="sticky-card">
          <Card className="padded">
            <div className="eyebrow">TRANSPARÊNCIA EM CADA ESCOLHA</div>
            <h2 className="card-title">{professional ? "Sua escolha" : "Condições do produto"}</h2>
            <div className="data-rows mt-4">
              <div className="data-row">
                <span>Valor do benefício</span>
                <strong>{money(p.price, 2)} / mês</strong>
              </div>
              {professional && (
                <div className="data-row">
                  <span>Subsídio da contratante</span>
                  <strong className="positive">− {money(owned?.subsidy ?? e.subsidy, 2)}</strong>
                </div>
              )}
            </div>
            <div className="price-total">
              <span>{professional ? "Você paga" : "Preço cheio"}</span>
              <strong>
                {money(
                  professional ? (owned ? owned.price - owned.subsidy : e.finalPrice) : p.price,
                  2,
                )}
              </strong>
            </div>
            {professional ? (
              <>
                <Badge tone={owned ? "green" : locked ? "neutral" : e.eligible ? "blue" : "amber"}>
                  {owned
                    ? owned.status === "pending"
                      ? "Aguardando ativação"
                      : "Proteção ativa"
                    : locked
                      ? "Decisão já registrada"
                      : e.eligible
                        ? "Elegível para esta oferta"
                        : "Condições não atendidas"}
                </Badge>
                {!e.eligible && (
                  <ul className="check-list mt-4">
                    {e.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                {locked ? (
                  <Link href="/app/historico" className="text-link mt-5">
                    Ver sua decisão no histórico
                    <Icon name="ArrowRight" size={14} />
                  </Link>
                ) : (
                  <div className="equal-actions">
                    <Button
                      variant="outline"
                      disabled={!e.eligible}
                      onClick={() => setChoice("accepted")}
                    >
                      <Icon name="Check" size={16} />
                      Quero contratar
                    </Button>
                    <Button variant="outline" onClick={() => setChoice("declined")}>
                      <Icon name="X" size={16} />
                      Não quero agora
                    </Button>
                  </div>
                )}
                <p className="muted mt-4">
                  Aceitar e recusar têm o mesmo valor. A escolha é sua e fica registrada.
                </p>
              </>
            ) : (
              <p className="muted mt-4">
                A adesão é realizada pelo profissional em seu próprio ambiente.
              </p>
            )}
            <Disclaimer>
              O subsídio respeita o saldo total da política no momento da decisão. Não há
              contratação real.
            </Disclaimer>
          </Card>
          <div className="disclaimer">
            <Icon name="LockKeyhole" size={15} />
            <span>Informações clínicas nunca são compartilhadas com a contratante.</span>
          </div>
        </div>
      </div>
      <Modal
        open={choice !== null}
        onOpenChange={(v) => {
          if (!v && !busy) setChoice(null);
        }}
        title={choice === "accepted" ? "Confirmar sua escolha" : "Confirmar decisão"}
        description={
          choice === "accepted"
            ? `Você está escolhendo aderir a ${p.name} na demonstração.`
            : "Você está escolhendo não aderir a este benefício neste momento."
        }
      >
        <p className="muted">Essa decisão não altera seu contrato de prestação de serviços.</p>
        {choice === "accepted" && (
          <div className="price-total">
            <span>Custo mensal demonstrativo</span>
            <strong>{money(e.finalPrice, 2)}</strong>
          </div>
        )}
        <Disclaimer>
          Seu aceite, ou sua recusa, será registrado no histórico. Nenhuma cobrança ou assinatura
          real será realizada.
        </Disclaimer>
        <div className="report-actions">
          <Button variant="outline" disabled={busy} onClick={() => setChoice(null)}>
            Voltar
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => void confirm()}>
            {busy ? (
              <Icon name="LoaderCircle" className="spin" />
            ) : choice === "accepted" ? (
              "Confirmar adesão demo"
            ) : (
              "Confirmar recusa"
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function Offers() {
  const { state } = useDemo();
  const [filter, setFilter] = useState("pending");
  const all = state.offers
    .filter((o) => o.personId === "p1")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const list = all.filter((o) => {
    const decision = state.decisions.find((d) => d.offerId === o.id);
    return filter === "all" || (filter === "pending" && !decision) || decision?.choice === filter;
  });
  return (
    <>
      <PageHeading
        title="Suas ofertas. Suas escolhas."
        description="Cada decisão é independente. Recusar também faz parte."
      />
      <Segments
        items={[
          {
            id: "pending",
            label: "Aguardando decisão",
            count: all.filter((o) => !state.decisions.some((d) => d.offerId === o.id)).length,
          },
          { id: "all", label: "Todas" },
          { id: "accepted", label: "Aceitas" },
          { id: "declined", label: "Recusadas" },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <div className="stack mt-6">
        {list.map((o) => {
          const p = productById(o.productId)!;
          const d = state.decisions.find((d) => d.offerId === o.id);
          return (
            <Card className="padded" key={o.id}>
              <div className="flex-between">
                <div className="person-cell">
                  <span className="icon-tile">
                    <Icon name={p.icon} />
                  </span>
                  <div>
                    <strong>{p.name}</strong>
                    <small>
                      Recebida em {dateLabel(o.createdAt)} · política v{o.policyVersion}
                    </small>
                  </div>
                </div>
                <Badge tone={!d ? "blue" : d.choice === "accepted" ? "green" : "neutral"}>
                  {!d ? "Aguardando decisão" : d.choice === "accepted" ? "Aceito" : "Recusado"}
                </Badge>
              </div>
              <div className="flex-between mt-5">
                <span className="muted">
                  Preço cheio: {money(o.price, 2)} · subsídio sujeito ao saldo
                </span>
                <Button variant="outline" asChild>
                  <Link href={`/app/beneficios/${p.id}`}>
                    {d ? "Ver benefício" : "Ver oferta e decidir"}
                    <Icon name="ArrowRight" size={14} />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      {!list.length && (
        <Card className="mt-6">
          <EmptyState
            title="Nenhuma oferta pendente"
            description="Tudo certo por aqui. Você já decidiu sobre as ofertas deste filtro."
            icon="CheckCircle2"
          >
            <Button variant="outline" asChild>
              <Link href="/app/beneficios">Explorar benefícios</Link>
            </Button>
          </EmptyState>
        </Card>
      )}
    </>
  );
}
