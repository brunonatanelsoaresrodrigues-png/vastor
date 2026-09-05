"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDemo } from "@/hooks/use-demo";
import { roleHome } from "@/lib/navigation";
import type { Role } from "@/types";
import { Brand, Badge } from "@/components/shared";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
const schema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido.")),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  remember: z.boolean(),
});

const protectionPreview = [
  { label: "Saúde", score: 100 },
  { label: "Renda", score: 25 },
  { label: "Futuro", score: 50 },
];

export function Login() {
  const { login } = useDemo();
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [forgot, setForgot] = useState(false),
    [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });
  const enter = async (role: Role, remember = false) => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 450));
    login(role, remember);
    router.push(roleHome[role]);
  };

  const submit = handleSubmit((values) => {
    setError("");
    const role: Role | undefined =
      values.email === "profissional@vastor.demo"
        ? "professional"
        : values.email === "empresa@vastor.demo"
          ? "company"
          : values.email === "admin@vastor.demo"
            ? "admin"
            : undefined;

    if (!role) {
      setError("E-mail não reconhecido neste ambiente. Use um dos acessos demonstrativos acima.");
      return;
    }
    if (values.password !== "123456") {
      setError("Senha incorreta para a demonstração. Use 123456.");
      return;
    }
    void enter(role, values.remember);
  });

  return (
    <div className="login-page">
      <section className="login-story">
        <Brand light />
        <div className="login-story-content">
          <span className="story-eyebrow">
            <span />
            INDEPENDÊNCIA COM PROTEÇÃO
          </span>
          <h2>
            Seu trabalho muda.
            <br />
            Sua proteção
            <br />
            <em>continua.</em>
          </h2>
          <p>
            Proteção para quem trabalha por CNPJ.
            <br />
            Liberdade para escolher o que faz sentido para você.
          </p>
          <div
            className="login-product-preview"
            role="img"
            aria-label="Prévia demonstrativa do Índice de Proteção: 67 de 100, com três dos seis pilares exibidos"
          >
            <div className="product-preview-top">
              <span>VISÃO DO PROFISSIONAL</span>
              <span className="product-preview-status">
                <i /> CENÁRIO DEMONSTRATIVO
              </span>
            </div>
            <div className="product-preview-summary">
              <div>
                <span>ÍNDICE DE PROTEÇÃO</span>
                <strong>
                  67<small>/100</small>
                </strong>
              </div>
              <span className="product-preview-level">Proteção intermediária</span>
            </div>
            <div className="product-preview-bars">
              {protectionPreview.map((pillar) => (
                <div className="product-preview-pillar" key={pillar.label}>
                  <div>
                    <span>{pillar.label}</span>
                    <strong>{pillar.score}%</strong>
                  </div>
                  <span className="product-preview-track">
                    <i style={{ width: `${pillar.score}%` }} />
                  </span>
                </div>
              ))}
            </div>
            <div className="product-preview-footer">
              <Icon name="ShieldCheck" size={17} />
              <span>6 pilares para orientar escolhas e próximos passos.</span>
            </div>
          </div>
        </div>
        <div className="login-mobile-story">
          <span>PROTEÇÃO PARA QUEM TRABALHA POR CNPJ</span>
          <strong>Liberdade para escolher o que faz sentido.</strong>
        </div>
        <div className="story-footer">
          <span>
            <Icon name="LockKeyhole" size={14} />
            Sua proteção é sua.
          </span>
          <span>Você no controle. Sempre.</span>
        </div>
      </section>
      <section className="login-form-panel">
        <div className="login-top">
          <Badge tone="amber" dot>
            AMBIENTE DEMONSTRATIVO
          </Badge>
          <span className="login-secure-label">
            <Icon name="LockKeyhole" size={13} />
            Acesso protegido
          </span>
        </div>
        <div className="login-form-wrap">
          <header className="login-copy">
            <h1>Sua proteção acompanha você.</h1>
            <p className="login-intro">
              Explore cada visão do produto ou entre para acompanhar suas escolhas.
            </p>
          </header>
          <section className="demo-access" aria-labelledby="demo-access-title">
            <div className="demo-access-heading">
              <div>
                <span>ACESSO RÁPIDO</span>
                <h3 id="demo-access-title">Escolha uma visão demonstrativa</h3>
              </div>
              <Icon name="ChevronDown" size={17} />
            </div>
            <div className="demo-logins">
              {(
                [
                  {
                    r: "professional",
                    name: "Profissional",
                    description: "Sua proteção, suas escolhas",
                    icon: "UserRound",
                  },
                  {
                    r: "company",
                    name: "Empresa",
                    description: "Gestão com autonomia",
                    icon: "Building2",
                  },
                  {
                    r: "admin",
                    name: "Administrador",
                    description: "Toda a operação Vastor Capital",
                    icon: "Network",
                  },
                ] as const
              ).map((item) => (
                <button
                  type="button"
                  key={item.r}
                  disabled={busy}
                  onClick={() => void enter(item.r)}
                  aria-label={`Entrar como ${item.name.toLowerCase()}`}
                >
                  <span className="demo-role-icon">
                    <Icon name={item.icon} size={19} />
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>
                  <Icon name="ArrowUpRight" size={16} />
                </button>
              ))}
            </div>
            <div className="demo-note" role="note">
              <span className="demo-note-icon">
                <Icon name="Info" size={16} />
              </span>
              <span>
                <strong>Dados 100% fictícios.</strong> Os cartões entram diretamente. Para testar o
                formulário, use profissional, empresa ou admin <b>@vastor.demo</b> e a senha
                <b> 123456</b>.
              </span>
            </div>
          </section>
          <div className="login-divider">
            <span>ou acesse com e-mail</span>
          </div>
          <form onSubmit={submit} className="login-form" noValidate aria-busy={busy}>
            <label className="field-label" htmlFor="email">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              disabled={busy}
              {...register("email", { onChange: () => setError("") })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p className="field-error" id="email-error">
                {errors.email.message}
              </p>
            )}
            <label className="field-label" htmlFor="password">
              Senha
            </label>
            <div className="password-field">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                autoComplete="current-password"
                disabled={busy}
                {...register("password", { onChange: () => setError("") })}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((v) => !v)}
              >
                <Icon name="Eye" size={17} />
              </Button>
            </div>
            {errors.password && (
              <p className="field-error" id="password-error">
                {errors.password.message}
              </p>
            )}
            <div className="login-options">
              <label className="check-label">
                <input type="checkbox" {...register("remember")} />
                Manter acesso neste navegador
              </label>
              <button type="button" className="text-link" onClick={() => setForgot(true)}>
                Esqueci minha senha
              </button>
            </div>
            {error && (
              <p role="alert" aria-live="polite" className="field-error login-credential-error">
                {error}
              </p>
            )}
            <Button type="submit" className="login-submit" disabled={busy}>
              {busy ? (
                <>
                  <span>Entrando…</span>
                  <Icon name="LoaderCircle" className="spin" />
                </>
              ) : (
                <>
                  Entrar na minha conta
                  <Icon name="ArrowRight" size={17} />
                </>
              )}
            </Button>
          </form>
        </div>
        <div className="login-footer">
          <span>© 2026 Vastor Capital</span>
          <span>Proteção. Liberdade. Autonomia.</span>
        </div>
      </section>
      <Modal
        open={forgot}
        onOpenChange={setForgot}
        title="Acesso à demonstração"
        description="Não há envio de e-mail ou recuperação real de senha."
      >
        <p>
          Todos os perfis de demonstração utilizam a senha <strong>123456</strong>. Você também pode
          entrar pelos botões de acesso rápido.
        </p>
        <Button onClick={() => setForgot(false)} className="mt-6">
          Entendi
        </Button>
      </Modal>
    </div>
  );
}
