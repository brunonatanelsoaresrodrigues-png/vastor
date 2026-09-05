import { AppShell } from "@/components/app-shell";
import { CompanyPage } from "@/features/company/page";
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return (
    <AppShell role="company">
      <CompanyPage path={slug} />
    </AppShell>
  );
}
