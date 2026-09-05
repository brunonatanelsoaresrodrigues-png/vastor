"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDemo } from "@/hooks/use-demo";
import type { Role } from "@/types";
import { PageHeading, Avatar, Disclaimer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { Icon } from "@/components/icons";
const profileSchema = z.object({
  name: z.string().min(3, "Informe ao menos 3 caracteres."),
  occupation: z.string().min(2, "Informe uma atividade."),
  email: z
    .email("Informe um e-mail válido.")
    .refine((v) => v.endsWith("@vastor.demo"), "Use um endereço fictício @vastor.demo."),
});
export function Settings({ role }: { role: Role }) {
  const { state, dispatch, reset } = useDemo();
  const [confirm, setConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: state.profile,
  });
  return (
    <>
      <PageHeading
        title={
          role === "professional" ? "Seu espaço, do seu jeito." : "Configurações da demonstração"
        }
        description="Gerencie seu perfil e suas preferências locais."
      />
      <Card>
        <div className="settings-section">
          <div className="person-cell">
            <Avatar
              name={
                role === "professional"
                  ? state.profile.name
                  : role === "company"
                    ? "Vetor Engenharia"
                    : "Administrador Vastor Capital"
              }
              size="large"
            />
            <div>
              <strong>
                {role === "professional"
                  ? state.profile.name
                  : role === "company"
                    ? "Vetor Engenharia Ltda"
                    : "Administrador Vastor Capital"}
              </strong>
              <small>Perfil demonstrativo · sem autenticação real</small>
            </div>
          </div>
        </div>
        {role === "professional" && (
          <form
            className="settings-section"
            onSubmit={handleSubmit((profile) => {
              dispatch({ type: "profile", profile });
              toast.success("Perfil demonstrativo atualizado.");
            })}
          >
            <h3>Informações do perfil</h3>
            <div className="fields-two">
              <div className="field">
                <label htmlFor="profile-name" className="field-label">
                  Nome fictício
                </label>
                <Input id="profile-name" {...register("name")} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>
              <div className="field">
                <label htmlFor="profile-occupation" className="field-label">
                  Atividade profissional
                </label>
                <Input id="profile-occupation" {...register("occupation")} />
                {errors.occupation && <p className="field-error">{errors.occupation.message}</p>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="profile-email" className="field-label">
                E-mail demonstrativo
              </label>
              <Input id="profile-email" {...register("email")} />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>
            <Button type="submit">Salvar alterações</Button>
          </form>
        )}
        <div className="settings-section">
          <h3>Preferências</h3>
          <label className="settings-toggle">
            <div>
              <strong>Notificações da demonstração</strong>
              <p>Mostrar o indicador de novidades no painel.</p>
            </div>
            <input
              type="checkbox"
              checked={state.preferences.notifications}
              onChange={(e) => {
                dispatch({
                  type: "preferences",
                  preferences: { ...state.preferences, notifications: e.target.checked },
                });
                toast.success("Preferência atualizada.");
              }}
            />
          </label>
          <label className="settings-toggle">
            <div>
              <strong>Tabelas compactas</strong>
              <p>Reduzir o espaçamento entre registros.</p>
            </div>
            <input
              type="checkbox"
              checked={state.preferences.compact}
              onChange={(e) =>
                dispatch({
                  type: "preferences",
                  preferences: { ...state.preferences, compact: e.target.checked },
                })
              }
            />
          </label>
        </div>
        <div className="settings-section">
          <h3>Recomeçar a apresentação</h3>
          <p className="muted mb-5">
            Restaure ofertas, decisões, políticas, perfil e demais dados locais ao cenário inicial.
          </p>
          <Button variant="outline" onClick={() => setConfirm(true)}>
            <Icon name="RefreshCw" size={15} />
            Restaurar demonstração
          </Button>
        </div>
      </Card>
      <Disclaimer>
        Não insira dados pessoais reais. Esta aplicação não fornece controle de acesso de produção;
        os perfis são apenas uma simulação de navegação.
      </Disclaimer>
      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        title="Restaurar os dados da demo?"
        description="As alterações feitas neste navegador serão substituídas pelo cenário fictício inicial."
      >
        <div className="report-actions">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Voltar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              reset();
              setConfirm(false);
            }}
          >
            Restaurar demo
          </Button>
        </div>
      </Modal>
    </>
  );
}
