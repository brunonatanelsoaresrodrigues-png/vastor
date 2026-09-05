"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDemo } from "@/hooks/use-demo";
import type { Role } from "@/types";
import { navigation, roleHome, roleLabels } from "@/lib/navigation";
import { normalize } from "@/lib/utils";
import { products } from "@/mocks/catalog";
import { Brand, Avatar, Badge, LoadingScreen, SearchField, EmptyState } from "@/components/shared";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown-menu";
export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const { state, ready, session, login, logout } = useDemo();
  const router = useRouter(),
    pathname = usePathname();
  const [mobile, setMobile] = useState(false),
    [command, setCommand] = useState(false),
    [query, setQuery] = useState(""),
    [switcher, setSwitcher] = useState(false),
    [help, setHelp] = useState(false);
  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace("/login");
    else if (session.role !== role) router.replace(roleHome[session.role]);
  }, [ready, session, role, router]);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  const nav = navigation[role];
  const active = [...nav]
    .reverse()
    .find(
      (n) =>
        pathname === n.href || (n.href !== roleHome[role] && pathname.startsWith(n.href + "/")),
    );
  const pendingOffers = state.offers.filter(
    (o) => o.personId === "p1" && !state.decisions.some((d) => d.offerId === o.id),
  ).length;
  const go = (href: string) => {
    router.push(href);
    setMobile(false);
    setCommand(false);
  };
  const searchItems = [
    ...nav.map((n) => ({ name: n.label, href: n.href, icon: n.icon, type: "Página" })),
    ...(role !== "professional"
      ? state.people.map((p) => ({
          name: p.name,
          href: `${role === "company" ? "/empresa/prestadores" : "/admin/pessoas"}/${p.id}`,
          icon: "UserRound",
          type: "Profissional",
        }))
      : products.map((p) => ({
          name: p.name,
          href: `/app/beneficios/${p.id}`,
          icon: p.icon,
          type: "Benefício",
        }))),
  ].filter((n) => normalize(n.name).includes(normalize(query)));
  const menu = (
    <>
      <Link href={roleHome[role]} className="brand-link">
        <Brand />
      </Link>
      <div className="workspace-label">
        <span className="workspace-icon">
          <Icon
            name={
              role === "professional" ? "UserRound" : role === "company" ? "Building2" : "Network"
            }
            size={17}
          />
        </span>
        <div>
          <strong>
            {role === "professional"
              ? "Meu espaço"
              : role === "company"
                ? "Vetor Engenharia"
                : "Operação Vastor Capital"}
          </strong>
          <span>{roleLabels[role]}</span>
        </div>
        <Icon name="ChevronDown" size={14} />
      </div>
      <nav className="side-nav" aria-label="Navegação principal">
        {nav.map((n) => (
          <div key={n.href}>
            {n.group && <p className="nav-group">{n.group}</p>}
            <Link
              href={n.href}
              onClick={() => setMobile(false)}
              className={`nav-item ${active?.href === n.href ? "active" : ""}`}
              aria-current={active?.href === n.href ? "page" : undefined}
            >
              <Icon name={n.icon} size={18} />
              <span>{n.label}</span>
              {n.label === "Ofertas" && role === "professional" && pendingOffers > 0 && (
                <b className="nav-count">{pendingOffers}</b>
              )}
              {n.label === "Dossiês" && <span className="nav-dot" />}
            </Link>
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="mini-shield">
            <Icon name="ShieldCheck" size={17} />
          </span>
          <strong>Sua proteção vai com você.</strong>
          <p>
            Liberdade para escolher.
            <br />
            Tranquilidade para seguir.
          </p>
        </div>
        <Button variant="ghost" className="help-link" onClick={() => setHelp(true)}>
          <Icon name="LifeBuoy" />
          Central de ajuda
          <Icon name="ArrowUpRight" size={14} />
        </Button>
        <div className="sidebar-version">
          <span className="status-dot" />
          Todos os sistemas em demo<span>v1.0</span>
        </div>
      </div>
    </>
  );
  if (!ready || !session || session.role !== role) return <LoadingScreen />;
  return (
    <div className={`app-shell ${state.preferences.compact ? "compact" : ""}`}>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">{menu}</aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <Button
              className="mobile-menu"
              size="icon"
              variant="ghost"
              aria-label="Abrir navegação"
              onClick={() => setMobile(true)}
            >
              <Icon name="Menu" />
            </Button>
            <span className="breadcrumb-root">{roleLabels[role]}</span>
            <Icon name="ChevronRight" size={13} />
            <span className="breadcrumb-current">{active?.label ?? "Detalhes"}</span>
          </div>
          <div className="topbar-actions">
            <Button variant="ghost" className="global-search" onClick={() => setCommand(true)}>
              <Icon name="Search" size={16} />
              <span>Buscar na Vastor Capital</span>
              <kbd>⌃ K</kbd>
            </Button>
            <span className="header-demo">DEMO</span>
            <Dropdown
              trigger={
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Notificações"
                  className="notification-button"
                >
                  <Icon name="Bell" size={19} />
                  {state.preferences.notifications && <i />}
                </Button>
              }
            >
              <div className="dropdown-heading">
                Seu radar <Badge tone="blue">Demo</Badge>
              </div>
              {state.documents.some((d) => d.status === "Pendente") && role !== "professional" && (
                <DropdownItem onSelect={() => go(`${roleHome[role]}/documentos`)}>
                  <Icon name="FileText" />
                  <div>
                    <strong>Documentação pendente</strong>
                    <small>Ver aditivos que precisam de atenção</small>
                  </div>
                </DropdownItem>
              )}
              {[...state.events]
                .filter((e) => role !== "professional" || e.personId === "p1")
                .sort((a, b) => b.at.localeCompare(a.at))
                .slice(0, 3)
                .map((e) => (
                  <DropdownItem
                    key={e.id}
                    onSelect={() =>
                      go(
                        role === "professional"
                          ? "/app/historico"
                          : role === "company"
                            ? "/empresa/dossies"
                            : "/admin/eventos",
                      )
                    }
                  >
                    <Icon name="Fingerprint" />
                    <div>
                      <strong>{e.title}</strong>
                      <small>Registro demonstrativo</small>
                    </div>
                  </DropdownItem>
                ))}
            </Dropdown>
            <div className="header-divider" />
            <Dropdown
              trigger={
                <button className="profile-trigger" aria-label="Abrir menu do perfil">
                  <Avatar
                    name={
                      role === "professional"
                        ? state.profile.name
                        : role === "company"
                          ? "Vetor Engenharia"
                          : "Admin Vastor Capital"
                    }
                    size="small"
                  />
                  <Icon name="ChevronDown" size={13} />
                </button>
              }
            >
              <div className="dropdown-heading">
                <div>
                  <strong>{session.name}</strong>
                  <small>{session.email}</small>
                </div>
              </div>
              <DropdownSeparator />
              <DropdownItem
                onSelect={() =>
                  go(
                    role === "professional"
                      ? "/app/perfil"
                      : role === "company"
                        ? "/empresa/configuracoes"
                        : "/admin/configuracoes",
                  )
                }
              >
                <Icon name="UserRound" />
                Minha conta e preferências
              </DropdownItem>
              <DropdownItem onSelect={() => setSwitcher(true)}>
                <Icon name="RefreshCw" />
                Trocar perfil demo
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                onSelect={() => {
                  logout();
                  router.replace("/login");
                }}
              >
                <Icon name="LogOut" />
                Sair
              </DropdownItem>
            </Dropdown>
          </div>
        </header>
        <main id="main-content" className="page-content">
          {children}
          <footer className="app-footer">
            <span>
              <Icon name="ShieldCheck" size={13} />
              Vastor Capital · Estratégia e visão de longo prazo
            </span>
            <span>Ambiente demonstrativo · dados fictícios</span>
          </footer>
        </main>
      </div>
      <Modal open={mobile} onOpenChange={setMobile} title="Navegação Vastor Capital">
        <div className="mobile-sidebar">{menu}</div>
      </Modal>
      <Modal
        open={command}
        onOpenChange={setCommand}
        title="Encontre na Vastor Capital"
        description="Busque páginas, profissionais e benefícios. Atalho Ctrl + K."
      >
        <SearchField value={query} onChange={setQuery} placeholder="O que você está procurando?" />
        <div className="command-results">
          {searchItems.slice(0, 12).map((i) => (
            <button key={i.href} onClick={() => go(i.href)}>
              <Icon name={i.icon} />
              <span>{i.name}</span>
              <small>{i.type}</small>
              <Icon name="ArrowUpRight" size={14} />
            </button>
          ))}
          {!searchItems.length && (
            <EmptyState
              title="Nenhum resultado"
              description="Tente um nome ou uma página diferente."
            />
          )}
        </div>
      </Modal>
      <Modal
        open={switcher}
        onOpenChange={setSwitcher}
        title="Um produto. Três perspectivas."
        description="As decisões continuam salvas ao trocar de perfil."
      >
        <div className="role-options">
          {(["professional", "company", "admin"] as Role[]).map((r) => (
            <Button
              key={r}
              variant="outline"
              onClick={() => {
                login(r);
                setSwitcher(false);
                router.push(roleHome[r]);
              }}
            >
              <Icon
                name={
                  r === "professional" ? "UserRound" : r === "company" ? "Building2" : "Network"
                }
              />
              {roleLabels[r]}
              <Icon name="ArrowRight" size={16} />
            </Button>
          ))}
        </div>
      </Modal>
      <Modal
        open={help}
        onOpenChange={setHelp}
        title="Como explorar a Vastor Capital"
        description="Uma demonstração de proteção e autonomia."
      >
        <div className="help-content">
          <h3>1. Comece pelo seu Índice</h3>
          <p>Responda às seis perguntas e conheça as lacunas de proteção.</p>
          <h3>2. Faça suas escolhas</h3>
          <p>Aceite ou recuse uma oferta. A adesão aguarda confirmação simulada do fornecedor.</p>
          <h3>3. Troque de perspectiva</h3>
          <p>
            No menu do perfil, acesse a empresa para ver o dossiê. No Admin, confirme a movimentação
            e acompanhe os eventos.
          </p>
          <h3>Seus dados nesta demo</h3>
          <p>
            As mudanças ficam neste navegador. Não use informações pessoais reais. A demo não
            substitui parecer jurídico ou trabalhista.
          </p>
        </div>
      </Modal>
    </div>
  );
}
