"use client";
import { DropdownMenu as Primitive } from "radix-ui";
import type { ReactNode } from "react";
export function Dropdown({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  return (
    <Primitive.Root>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content className="dropdown-content" align="end" sideOffset={10}>
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
export function DropdownItem({
  children,
  onSelect,
}: {
  children: ReactNode;
  onSelect: () => void;
}) {
  return (
    <Primitive.Item className="dropdown-item" onSelect={onSelect}>
      {children}
    </Primitive.Item>
  );
}
export const DropdownSeparator = () => <Primitive.Separator className="dropdown-separator" />;
