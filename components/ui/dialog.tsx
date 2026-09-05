"use client";
import { Dialog as Primitive } from "radix-ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Portal>
        <Primitive.Overlay className="modal-overlay" />
        <Primitive.Content
          className={`modal-content ${wide ? "modal-wide" : ""}`}
          aria-describedby={description ? undefined : undefined}
        >
          <Primitive.Title className="modal-title">{title}</Primitive.Title>
          <Primitive.Description className={description ? "muted modal-description" : "sr-only"}>
            {description ?? "Janela de interação da demonstração Vastor Capital."}
          </Primitive.Description>
          <Primitive.Close className="modal-close" aria-label="Fechar janela">
            <X size={18} />
          </Primitive.Close>
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
