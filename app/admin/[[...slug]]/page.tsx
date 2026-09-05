import { AppShell } from "@/components/app-shell";
import { AdminPage } from "@/features/admin/page";
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return (
    <AppShell role="admin">
      <AdminPage path={slug} />
    </AppShell>
  );
}
