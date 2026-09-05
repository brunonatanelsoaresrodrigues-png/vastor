"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { productById, providers } from "@/mocks/catalog";
import { money, dateLabel } from "@/lib/utils";
import { PageHeading, Badge, Disclaimer, EmptyState, Segments } from "@/components/shared";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
export function Wallet() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState("all"),
    [port, setPort] = useState<{ id: string; keep: boolean } | null>(null);
  const en = state.enrollments.filter((e) => e.personId === "p1");
  const portable = en.filter((e) => e.status === "portability");
  const list = en.filter(
    (e) =>
      e.status !== "cancelled" &&
      e.status !== "portability" &&
      (filter === "all" ||
        (filter === "own" && !e.companyId) ||
        (filter === "sponsored" && e.companyId) ||
        (filter === "pending" && e.status === "pending")),
  );
  return (
    <>
      <PageHeading
        title="Uma carteira. Toda a sua proteção."
        description="O que cuida de você continua com você, independentemente de quem subsidia."
      >
        <Button variant="outline" asChild>
          <Link href="/app/beneficios">
            <Icon name="Plus" size={15} />
            Explorar proteções
          </Link>
        </Button>
      </PageHeading>
      {portable.map((e) => (
        <div className="portability-banner" key={e.id}>
          <div className="flex-between mb-3">
            <Badge tone="blue">
              <Icon name="RefreshCw" size={11} />
              PORTABILIDADE
            </Badge>
            <Icon name="ShieldCheck" size={22} />
          </div>
          <h3>Seu contrato com a Atlas Digital terminou.</h3>
          <p>
            Seu subsídio terminou, mas sua proteção não precisa terminar. Você decide como
            continuar.
          </p>
          <div className="flex-between mt-4">
            <strong className="text-sm">{productById(e.productId)?.name}</strong>
            <span className="muted">
              Antes: {money(e.price - 20)} → pagamento próprio:{" "}
              <strong>{money(e.price)}/mês</strong>
            </span>
          </div>
          <div className="portability-actions">
            <Button variant="outline" onClick={() => setPort({ id: e.id, keep: true })}>
              <Icon name="Check" size={15} />
              Continuar proteção
            </Button>
            <Button variant="outline" onClick={() => setPort({ id: e.id, keep: false })}>
              Cancelar cobertura
            </Button>
          </div>
        </div>
      ))}
      <div className="mb-section">
        <Segments
          items={[
            { id: "all", label: "Todas as proteções" },
            { id: "sponsored", label: "Com subsídio" },
            { id: "own", label: "Pagamento próprio" },
            { id: "pending", label: "Em ativação" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <div className="grid-three">
        {list.map((e) => {
          const p = productById(e.productId)!;
          return (
            <Card className="wallet-card" key={e.id}>
              <div className="flex-between">
                <span className="icon-tile">
                  <Icon name={p.icon} size={23} />
                </span>
                <Badge
                  tone={
                    e.status === "pending" ? "amber" : e.source === "Externo" ? "neutral" : "green"
                  }
                >
                  {e.status === "pending"
                    ? "Em ativação"
                    : e.source === "Externo"
                      ? "Proteção externa"
                      : e.source === "Portado"
                        ? "Portado"
                        : "Ativo"}
                </Badge>
              </div>
              <h3>{p.name}</h3>
              <p>{providers.find((x) => x.id === p.providerId)?.name}</p>
              <div className="data-rows">
                <div className="data-row">
                  <span>Início</span>
                  <strong>{dateLabel(e.startedAt)}</strong>
                </div>
                <div className="data-row">
                  <span>Valor do benefício</span>
                  <strong>{money(e.price, 2)}</strong>
                </div>
                <div className="data-row">
                  <span>Subsídio</span>
                  <strong>{money(e.subsidy, 2)}</strong>
                </div>
                <div className="data-row">
                  <span>Origem</span>
                  <strong>
                    {e.companyId === "vetor" ? "Vetor Engenharia" : "Pagamento próprio"}
                  </strong>
                </div>
              </div>
              <div className="wallet-total">
                <span>Você paga / mês</span>
                <strong>{money(e.price - e.subsidy, 2)}</strong>
              </div>
              <Button variant="outline" asChild className="w-full mt-5">
                <Link href={`/app/beneficios/${p.id}`}>
                  Ver condições
                  <Icon name="ArrowUpRight" size={14} />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>
      {!list.length && (
        <EmptyState
          title="Nenhuma proteção neste filtro"
          description="Suas novas adesões aparecerão aqui."
        />
      )}
      <Disclaimer>
        Proteções externas foram incluídas apenas como exemplo. Adesões em ativação ainda não
        representam cobertura confirmada. Nesta demonstração, a confirmação é feita em Admin →
        Movimentações.
      </Disclaimer>
      <Modal
        open={!!port}
        onOpenChange={(v) => {
          if (!v) setPort(null);
        }}
        title={port?.keep ? "Sua proteção continua com você" : "Cancelar esta cobertura?"}
        description={
          port?.keep
            ? "Você escolheu continuar com pagamento próprio, sem o subsídio da Atlas Digital."
            : "Esta ação encerra apenas a cobertura selecionada na demonstração."
        }
      >
        <Disclaimer>
          Nenhuma cobrança real será feita. A decisão de portabilidade ficará registrada no
          histórico.
        </Disclaimer>
        <div className="report-actions">
          <Button variant="outline" onClick={() => setPort(null)}>
            Voltar
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!port) return;
              dispatch({
                type: "port",
                id: port.id,
                continue: port.keep,
                at: new Date().toISOString(),
              });
              toast.success(
                port.keep
                  ? "Proteção portada. Sua escolha foi registrada."
                  : "Cancelamento demonstrativo registrado.",
              );
              setPort(null);
            }}
          >
            {port?.keep ? "Confirmar continuidade" : "Confirmar cancelamento"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
