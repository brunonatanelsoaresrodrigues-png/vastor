"use client";
import { AdminDashboard, Eligibility, Ledger, Movements } from "./operations";
import { AdminRecords } from "./records";
import { People, PersonDetail } from "@/features/company/people";
import { Policy } from "@/features/company/policy";
import { Catalog, BenefitDetail } from "@/features/professional/catalog";
import { Finance } from "@/features/shared/finance";
import { Documents } from "@/features/shared/documents";
import { Settings } from "@/features/shared/settings";
import { EmptyState } from "@/components/shared";
export function AdminPage({ path }: { path: string[] }) {
  const [section, id] = path;
  if (!section) return <AdminDashboard />;
  if (section === "pessoas")
    return id ? <PersonDetail id={id} role="admin" /> : <People role="admin" />;
  if (section === "elegibilidade") return <Eligibility />;
  if (section === "eventos") return <Ledger />;
  if (section === "movimentacoes") return <Movements />;
  if (section === "produtos")
    return id ? <BenefitDetail id={id} role="admin" /> : <Catalog role="admin" />;
  if (section === "politicas") return <Policy />;
  if (section === "faturas") return <Finance role="admin" />;
  if (section === "documentos") return <Documents role="admin" />;
  if (section === "configuracoes") return <Settings role="admin" />;
  if (["contratantes", "ofertas", "decisoes", "adesoes", "fornecedores"].includes(section))
    return (
      <AdminRecords
        key={section}
        kind={section as "contratantes" | "ofertas" | "decisoes" | "adesoes" | "fornecedores"}
      />
    );
  return <EmptyState title="Página não encontrada" />;
}
