"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import { companyStats, companyEnrollments, currentPolicy, enrollmentTotals } from "@/lib/domain";
import { productById } from "@/mocks/catalog";
import { dateLabel, money, normalize } from "@/lib/utils";
import { createDossierHtml, downloadFile } from "@/lib/exports";
import {
  PageHeading,
  Stat,
  Avatar,
  Badge,
  Timeline,
  Disclaimer,
  SearchField,
  Segments,
  EmptyState,
} from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
export function ExportDossierButton({ personId }: { personId?: string }) {
  const { state } = useDemo();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await new Promise((r) => setTimeout(r, 500));
          downloadFile(
            `vastor-dossie-${personId ?? "consolidado"}-DEMO.html`,
            createDossierHtml(state, personId),
          );
          toast.success("Dossiê demonstrativo gerado com sucesso.");
        } catch {
          toast.error("Não foi possível gerar o dossiê. Tente novamente.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <Icon name={busy ? "LoaderCircle" : "Download"} className={busy ? "spin" : ""} size={15} />
      {busy ? "Gerando documento..." : "Exportar dossiê"}
    </Button>
  );
}
export function Dossier({ personId }: { personId: string }) {
  const { state } = useDemo();
  const p = state.people.find((p) => p.id === personId);
  if (!p) return <EmptyState title="Profissional não encontrado" />;
  const policy = currentPolicy(state),
    offers = state.offers.filter((o) => o.personId === p.id && o.companyId === "vetor"),
    decisions = state.decisions.filter((d) => offers.some((o) => o.id === d.offerId));
  return (
    <div className="dossier-preview">
      <span className="dossier-stamp">VASTOR CAPITAL · DOCUMENTO DEMONSTRATIVO</span>
      <h2>Dossiê de autonomia</h2>
      <div className="dossier-meta">
        <strong>{p.name}</strong>
        <p>
          {p.cnpj} · Vetor Engenharia Ltda
          <br />
          Contrato iniciado em {dateLabel(p.startedAt)} · {p.active ? "ativo" : "encerrado"}
        </p>
      </div>
      <Disclaimer>
        Documento demonstrativo. Não constitui parecer jurídico. Registros locais, sem validade de
        assinatura eletrônica ou garantia de imutabilidade.
      </Disclaimer>
      <h3>01 · Identificação e contrato</h3>
      <p>
        {p.occupation} · contrato mensal de {money(p.contract)}. Adesão facultativa a cada
        benefício, sem condicionamento do contrato de prestação.
      </p>
      <h3>02 · Política e subsídios</h3>
      <p>
        Política de referência v{policy?.version}: teto {money(policy?.cap ?? 0)}, participação{" "}
        {policy?.participation}%. Cada oferta preserva a própria versão.
        <br />
        Subsídio reservado nesta contratante:{" "}
        {money(enrollmentTotals(companyEnrollments(state, p.id)).subsidy, 2)}.
      </p>
      <h3>03 · Ofertas, aceites e recusas</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Política</th>
              <th>Decisão</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => {
              const d = decisions.find((d) => d.offerId === o.id);
              return (
                <tr key={o.id}>
                  <td>{productById(o.productId)?.name}</td>
                  <td>v{o.policyVersion}</td>
                  <td>
                    <Badge tone={!d ? "blue" : d.choice === "accepted" ? "green" : "neutral"}>
                      {!d ? "Pendente" : d.choice === "accepted" ? "Aceito" : "Recusado"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h3>04 · Alterações, portabilidade e documentos</h3>
      <p>
        {p.active
          ? "Contrato ativo. A continuidade de cobertura após encerramento depende da escolha do profissional e das condições do produto."
          : "Contrato encerrado. Subsídio encerrado e proteção portada na demonstração."}
      </p>
      <p>
        Aditivo: {p.signed ? "registrado na demonstração" : "pendente"}. As versões de política
        anteriores permanecem disponíveis no histórico.
      </p>
      <h3>05 · Trilha de eventos</h3>
      <Timeline
        events={state.events.filter(
          (e) =>
            e.personId === p.id &&
            !e.entity.startsWith("portability-") &&
            !e.entity.startsWith("external-"),
        )}
      />
      <div className="report-actions">
        <ExportDossierButton personId={p.id} />
      </div>
    </div>
  );
}
export function Dossiers() {
  const { state } = useDemo();
  const stats = companyStats(state);
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [selected, setSelected] = useState<string | null>(null);
  const people = state.people.filter(
    (p) =>
      normalize(p.name).includes(normalize(query)) &&
      (filter === "all" ||
        (filter === "pending" && !p.signed) ||
        (filter === "complete" && p.signed)),
  );
  return (
    <>
      <PageHeading
        eyebrow="AUTONOMIA, COM HISTÓRICO"
        title="Cada escolha deixa um registro."
        description="Ofertas, decisões, subsídios e documentos reunidos por profissional."
      >
        <ExportDossierButton />
      </PageHeading>
      <div className="stat-grid">
        <Stat
          label="Aditivos registrados"
          value={`${state.people.filter((p) => p.signed).length} / ${state.people.length}`}
          icon="FileCheck2"
          detail="Documentos demonstrativos"
        />
        <Stat
          label="Decisões"
          value={state.decisions.length}
          icon="ListChecks"
          detail={`${stats.accepted} aceites + ${stats.declined} recusas`}
        />
        <Stat
          label="Recusas registradas"
          value={stats.declined}
          icon="Fingerprint"
          detail="Liberdade de escolha documentada"
        />
        <Stat
          label="Contratos com portabilidade"
          value={state.people.filter((p) => !p.active).length}
          icon="RefreshCw"
          detail="Continuidade independente"
        />
      </div>
      <div className="ledger-note">
        <Icon name="ShieldCheck" size={27} />
        <div>
          <strong>Na Vastor Capital, dizer não também é registrado.</strong>
          <p>
            Recusas fazem parte do histórico. Nenhum benefício é obrigatório neste cenário
            demonstrativo.
          </p>
        </div>
        <Badge tone="green">0 obrigatórios</Badge>
      </div>
      <div className="toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar profissional" />
        <Segments
          items={[
            { id: "all", label: "Todos" },
            { id: "pending", label: "Pendentes", count: stats.pending },
            { id: "complete", label: "Completos" },
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
                <th>Profissional</th>
                <th>Aditivo</th>
                <th>Decisões</th>
                <th>Documento</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="person-cell">
                      <Avatar name={p.name} />
                      <div>
                        <strong>{p.name}</strong>
                        <small>{p.cnpj}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge tone={p.signed ? "green" : "amber"}>
                      {p.signed ? "Registrado" : "Pendente"}
                    </Badge>
                  </td>
                  <td>{state.decisions.filter((d) => d.personId === p.id).length} registradas</td>
                  <td>
                    <Button size="sm" variant="outline" onClick={() => setSelected(p.id)}>
                      <Icon name="Eye" size={14} />
                      Abrir dossiê
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!people.length && (
          <EmptyState
            title={filter === "pending" ? "Nenhum dossiê pendente" : "Nenhum dossiê encontrado"}
            description="Ajuste a busca ou selecione outro filtro."
          />
        )}
      </Card>
      <Disclaimer>
        A exportação consolidada inclui todos os profissionais, independentemente do filtro da tela.
        O arquivo HTML contém a trilha e pode ser impresso ou salvo em PDF pelo navegador.
      </Disclaimer>
      <Modal
        wide
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        title="Dossiê de autonomia"
        description="Preview do documento individual da demonstração."
      >
        {selected && <Dossier personId={selected} />}
      </Modal>
    </>
  );
}
