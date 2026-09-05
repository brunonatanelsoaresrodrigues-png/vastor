import { AppShell } from "@/components/app-shell";
import { ProfessionalPage } from "@/features/professional/page";
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return (
    <AppShell role="professional">
      <ProfessionalPage path={slug} />
    </AppShell>
  );
}
