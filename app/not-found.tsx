import Link from "next/link";
import { Brand } from "@/components/shared";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="standalone-state">
      <Brand />
      <span className="error-number">404</span>
      <h1>Este caminho ainda não existe.</h1>
      <p>Vamos voltar para um lugar conhecido?</p>
      <Button asChild>
        <Link href="/login">Voltar à Vastor Capital</Link>
      </Button>
    </div>
  );
}
