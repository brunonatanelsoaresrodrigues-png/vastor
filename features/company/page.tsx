"use client";
import { CompanyDashboard } from "./dashboard";
import { People, PersonDetail } from "./people";
import { Dossiers } from "./dossier";
import { Policy } from "./policy";
import { Catalog, BenefitDetail } from "@/features/professional/catalog";
import { Documents } from "@/features/shared/documents";
import { Finance } from "@/features/shared/finance";
import { Settings } from "@/features/shared/settings";
import { EmptyState } from "@/components/shared";
export function CompanyPage({ path }: { path: string[] }) {
  const [section, id] = path;
  if (!section) return <CompanyDashboard />;
  if (section === "prestadores") return id ? <PersonDetail id={id} /> : <People />;
  if (section === "beneficios")
    return id ? <BenefitDetail id={id} role="company" /> : <Catalog role="company" />;
  if (section === "dossies") return <Dossiers />;
  if (section === "politica") return <Policy />;
  if (section === "financeiro") return <Finance role="company" />;
  if (section === "indicadores") return <CompanyDashboard indicators />;
  if (section === "documentos") return <Documents role="company" />;
  if (section === "configuracoes") return <Settings role="company" />;
  return <EmptyState title="Página não encontrada" />;
}
