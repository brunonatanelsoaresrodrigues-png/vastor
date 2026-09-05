"use client";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shared";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="standalone-state">
      <Brand />
      <h1>Algo saiu do esperado.</h1>
      <p>Seus registros locais continuam salvos. Tente carregar esta tela novamente.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
