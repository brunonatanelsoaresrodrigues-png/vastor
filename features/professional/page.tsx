"use client";
import { useState } from "react";
import { useDemo } from "@/hooks/use-demo";
import { ProfessionalDashboard } from "./dashboard";
import { Assessment, ProtectionMap, Retirement } from "./assessment";
import { Catalog, BenefitDetail, Offers } from "./catalog";
import { Wallet } from "./wallet";
import { Documents } from "@/features/shared/documents";
import { Settings } from "@/features/shared/settings";
import { Finance } from "@/features/shared/finance";
import { PageHeading, Timeline, Segments, EmptyState } from "@/components/shared";
import { Card } from "@/components/ui/card";
export function History() {
  const { state } = useDemo();
  const [filter, setFilter] = useState("all");
  return (
    <>
      <PageHeading
        title="Suas escolhas contam uma história."
        description="Cada oferta, decisão e mudança de proteção, com contexto."
      />
      <div className="mb-section">
        <Segments
          items={[
            { id: "all", label: "Tudo" },
            { id: "ACEITE", label: "Aceites" },
            { id: "RECUSA", label: "Recusas" },
            { id: "PORTABILIDADE", label: "Portabilidade" },
            { id: "ATIVAÇÃO", label: "Ativações" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <Card className="padded">
        <Timeline
          events={state.events.filter(
            (e) => e.personId === "p1" && (filter === "all" || e.type === filter),
          )}
        />
      </Card>
    </>
  );
}
export function ProfessionalPage({ path }: { path: string[] }) {
  const [section, id] = path;
  if (!section) return <ProfessionalDashboard />;
  if (section === "indice" && id === "aposentadoria") return <Retirement />;
  if (section === "indice") return <Assessment />;
  if (section === "protecao") return <ProtectionMap />;
  if (section === "beneficios") return id ? <BenefitDetail id={id} /> : <Catalog />;
  if (section === "ofertas") return <Offers />;
  if (section === "carteira") return <Wallet />;
  if (section === "financeiro") return <Finance role="professional" />;
  if (section === "documentos") return <Documents role="professional" />;
  if (section === "historico") return <History />;
  if (section === "perfil") return <Settings role="professional" />;
  return <EmptyState title="Página não encontrada" />;
}
