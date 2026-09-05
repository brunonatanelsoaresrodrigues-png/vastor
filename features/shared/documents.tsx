"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import type { Document, Role } from "@/types";
import { PageHeading, Badge, Disclaimer, SearchField, EmptyState } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
import { dateLabel, normalize } from "@/lib/utils";
import { createDocumentHtml, downloadFile } from "@/lib/exports";
export function Documents({ role }: { role: Role }) {
  const { state, dispatch } = useDemo();
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState<Document | null>(null);
  const docs = state.documents.filter(
    (d) =>
      (role !== "professional" || d.personId === "p1") &&
      normalize(`${d.title} ${state.people.find((p) => p.id === d.personId)?.name}`).includes(
        normalize(query),
      ),
  );
  return (
    <>
      <PageHeading
        title={
          role === "professional" ? "Seus documentos, em um só lugar." : "Documentos da operação"
        }
        description="Organização e transparência em cada etapa da sua jornada."
      />
      <div className="toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Buscar documento ou profissional"
        />
        <Badge tone="blue">{docs.length} documentos</Badge>
      </div>
      <div className="grid-three">
        {docs.map((d) => (
          <Card className="doc-card" key={d.id}>
            <div className="flex-between">
              <span className="icon-tile">
                <Icon name="FileText" size={23} />
              </span>
              <Badge tone={d.status === "Disponível" ? "green" : "amber"}>{d.status}</Badge>
            </div>
            <h3>{d.title}</h3>
            <p>
              {state.people.find((p) => p.id === d.personId)?.name}
              <br />
              {dateLabel(d.date)} · {d.type}
            </p>
            <div className="doc-actions">
              <Button variant="outline" size="sm" onClick={() => setSelected(d)}>
                <Icon name="Eye" size={14} />
                Visualizar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={d.status === "Pendente"}
                onClick={() => {
                  downloadFile(`vastor-${d.id}-DEMO.html`, createDocumentHtml(d.title, d.content));
                  toast.success("Documento demonstrativo preparado.");
                }}
              >
                <Icon name="Download" size={14} />
                Baixar
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {!docs.length && <EmptyState title="Nenhum documento encontrado" />}
      <Disclaimer>
        Documentos e assinaturas são demonstrativos. Os arquivos HTML podem ser abertos e impressos
        ou salvos em PDF pelo navegador.
      </Disclaimer>
      <Modal
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        title={selected?.title ?? "Documento"}
        description="Documento demonstrativo. Sem assinatura eletrônica real."
      >
        <div className="dossier-preview">
          <p>{selected?.content}</p>
          <p className="mt-4">Identificador: {selected?.id}</p>
        </div>
        {selected?.status === "Pendente" && role !== "professional" && (
          <div className="report-actions">
            <Button
              variant="outline"
              onClick={() => {
                dispatch({ type: "document", id: selected.id, at: new Date().toISOString() });
                setSelected(null);
                toast.success("Registro documental simulado. Dossiê atualizado.");
              }}
            >
              Simular registro do aditivo
            </Button>
          </div>
        )}
        <Disclaimer>A Vastor Capital não substitui parecer jurídico ou trabalhista.</Disclaimer>
      </Modal>
    </>
  );
}
