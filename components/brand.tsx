import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandProps = {
  light?: boolean;
  compact?: boolean;
  className?: string;
  priority?: boolean;
};

export function Brand({
  light = false,
  compact = false,
  className,
  priority = false,
}: BrandProps) {
  return (
    <span
      className={cn("brand", light && "brand-light", compact && "brand-compact", className)}
      aria-label="Vastor Capital"
    >
      <span className="brand-logo-symbol" aria-hidden="true">
        <Image
          src={light ? "/vastor-symbol-dark.png" : "/vastor-symbol-transparent.png"}
          alt=""
          fill
          sizes={compact ? "34px" : "40px"}
          priority={priority}
        />
      </span>
      <span className="brand-logo-type" aria-hidden="true">
        <strong>VASTOR</strong>
        <span>CAPITAL</span>
      </span>
    </span>
  );
}
