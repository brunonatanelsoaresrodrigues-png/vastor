import type { Role } from "@/types";
export const roleHome: Record<Role, string> = {
  professional: "/app",
  company: "/empresa",
  admin: "/admin",
};
export const roleLabels: Record<Role, string> = {
  professional: "Profissional",
  company: "Contratante",
  admin: "Administração",
};
export const navigation: Record<
  Role,
  { label: string; href: string; icon: string; group?: string }[]
> = {
  professional: [
    { label: "Visão geral", href: "/app", icon: "LayoutDashboard", group: "MEU ESPAÇO" },
    { label: "Meu Índice", href: "/app/indice", icon: "Activity" },
    { label: "Minha proteção", href: "/app/protecao", icon: "ShieldCheck" },
    { label: "Benefícios", href: "/app/beneficios", icon: "Compass", group: "MINHAS ESCOLHAS" },
    { label: "Ofertas", href: "/app/ofertas", icon: "Gift" },
    { label: "Minha carteira", href: "/app/carteira", icon: "Wallet" },
    { label: "Financeiro", href: "/app/financeiro", icon: "CreditCard", group: "ORGANIZAÇÃO" },
    { label: "Documentos", href: "/app/documentos", icon: "FileText" },
    { label: "Histórico", href: "/app/historico", icon: "History" },
    { label: "Perfil", href: "/app/perfil", icon: "UserRound" },
  ],
  company: [
    {
      label: "Visão geral",
      href: "/empresa",
      icon: "LayoutDashboard",
      group: "GESTÃO DA CONTRATANTE",
    },
    { label: "Prestadores", href: "/empresa/prestadores", icon: "Users" },
    { label: "Benefícios", href: "/empresa/beneficios", icon: "Compass" },
    { label: "Política de subsídio", href: "/empresa/politica", icon: "SlidersHorizontal" },
    {
      label: "Dossiês",
      href: "/empresa/dossies",
      icon: "FolderCheck",
      group: "EVIDÊNCIA E CONTROLE",
    },
    { label: "Financeiro", href: "/empresa/financeiro", icon: "CreditCard" },
    { label: "Indicadores", href: "/empresa/indicadores", icon: "TrendingUp" },
    { label: "Documentos", href: "/empresa/documentos", icon: "FileText" },
    { label: "Configurações", href: "/empresa/configuracoes", icon: "Settings" },
  ],
  admin: [
    { label: "Visão geral", href: "/admin", icon: "LayoutDashboard", group: "OPERAÇÃO VASTOR CAPITAL" },
    { label: "Pessoas", href: "/admin/pessoas", icon: "Users" },
    { label: "Contratantes", href: "/admin/contratantes", icon: "Building2" },
    { label: "Ofertas", href: "/admin/ofertas", icon: "Gift" },
    { label: "Decisões", href: "/admin/decisoes", icon: "ListChecks" },
    { label: "Adesões", href: "/admin/adesoes", icon: "ShieldCheck" },
    { label: "Produtos", href: "/admin/produtos", icon: "Compass", group: "INFRAESTRUTURA" },
    { label: "Fornecedores", href: "/admin/fornecedores", icon: "Network" },
    { label: "Elegibilidade", href: "/admin/elegibilidade", icon: "Zap" },
    { label: "Políticas", href: "/admin/politicas", icon: "SlidersHorizontal" },
    { label: "Faturas", href: "/admin/faturas", icon: "CreditCard" },
    { label: "Movimentações", href: "/admin/movimentacoes", icon: "RefreshCw" },
    { label: "Eventos", href: "/admin/eventos", icon: "Fingerprint" },
    { label: "Documentos", href: "/admin/documentos", icon: "FileText" },
  ],
};
