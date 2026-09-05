"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn, initials, dateLabel } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/brand";
import type { Event } from "@/types";
export { Brand };
export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red";
  dot?: boolean;
}) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <i />}
      {children}
    </span>
  );
}
export function Avatar({
  name,
  size = "normal",
}: {
  name: string;
  size?: "normal" | "small" | "large";
}) {
  return <span className={`avatar avatar-${size}`}>{initials(name)}</span>;
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}
export function SectionHeading({
  title,
  description,
  href,
  action = "Ver todos",
}: {
  title: string;
  description?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {action}
          <Icon name="ArrowRight" size={15} />
        </Link>
      )}
    </div>
  );
}
export function Stat({
  label,
  value,
  detail,
  icon,
  trend,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  icon: string;
  trend?: string;
}) {
  return (
    <Card className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon name={icon} />
        </span>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-bottom">
        {trend && (
          <span className="positive">
            <Icon name="TrendingUp" size={13} />
            {trend}
          </span>
        )}
        {detail && <span>{detail}</span>}
      </div>
    </Card>
  );
}
export function Disclaimer({
  children,
  kind = "info",
}: {
  children?: ReactNode;
  kind?: "info" | "warning";
}) {
  return (
    <div className={`disclaimer ${kind}`}>
      <Icon name="Info" size={16} />
      <span>
        {children ??
          "Ambiente demonstrativo. Todos os dados são fictícios. Nenhuma contratação, cobrança ou integração real."}
      </span>
    </div>
  );
}
export function EmptyState({
  title = "Nada por aqui ainda",
  description = "Os novos registros aparecerão aqui.",
  icon = "FolderCheck",
  children,
}: {
  title?: string;
  description?: string;
  icon?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-field">
      <Icon name="Search" size={17} />
      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <Button variant="ghost" size="icon" aria-label="Limpar busca" onClick={() => onChange("")}>
          <Icon name="X" size={14} />
        </Button>
      )}
    </div>
  );
}
export function Segments({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="segments" aria-label="Filtros">
      {items.map((i) => (
        <Button
          key={i.id}
          variant="ghost"
          className={value === i.id ? "selected" : ""}
          aria-pressed={value === i.id}
          onClick={() => onChange(i.id)}
        >
          {i.label}
          {i.count !== undefined && <span>{i.count}</span>}
        </Button>
      ))}
    </div>
  );
}
export function Timeline({ events, compact = false }: { events: Event[]; compact?: boolean }) {
  if (!events.length) return <EmptyState title="Nenhum evento encontrado" />;
  return (
    <div className={cn("timeline", compact && "timeline-compact")}>
      {[...events]
        .sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id))
        .map((e) => (
          <div className="timeline-event" key={e.id}>
            <span
              className={`timeline-icon ${e.type === "RECUSA" ? "neutral" : e.type === "ATIVAÇÃO" ? "green" : "blue"}`}
            >
              <Icon
                name={
                  e.type === "RECUSA"
                    ? "X"
                    : e.type === "ATIVAÇÃO"
                      ? "Check"
                      : e.type === "OFERTA"
                        ? "Gift"
                        : e.type === "POLÍTICA"
                          ? "SlidersHorizontal"
                          : e.type === "DOCUMENTO"
                            ? "FileCheck2"
                            : "Fingerprint"
                }
                size={15}
              />
            </span>
            <div className="timeline-body">
              <div className="flex-between">
                <strong>{e.title}</strong>
                <span className="event-date">{dateLabel(e.at)}</span>
              </div>
              {!compact && <p>{e.detail}</p>}
              <div className="timeline-meta">
                {e.actor}
                {!compact && (
                  <>
                    {" "}
                    ·{" "}
                    {new Date(e.at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/Sao_Paulo",
                    })}{" "}
                    · v{e.version} · <code>{e.id}</code>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label ?? "Progresso"}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}
export function ScoreRing({ score, small = false }: { score: number; small?: boolean }) {
  return (
    <div
      className={cn("score-ring", small && "score-small")}
      style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}
    >
      <div>
        <strong>{score}</strong>
        <span>de 100</span>
      </div>
    </div>
  );
}
export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Carregando Vastor Capital">
      <Brand />
      <div className="loading-bars">
        <span />
        <span />
        <span />
      </div>
      <p className="muted">Preparando sua experiência</p>
    </div>
  );
}
export function BackLink({ href, label = "Voltar" }: { href: string; label?: string }) {
  return (
    <Link className="back-link" href={href}>
      <Icon name="ArrowLeft" size={15} />
      {label}
    </Link>
  );
}
