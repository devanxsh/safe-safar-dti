import { type ReactNode } from "react";

interface ChildrenProps { children?: ReactNode }

export function TooltipProvider({ children }: ChildrenProps) {
  return <>{children}</>;
}

export function Tooltip({ children }: ChildrenProps) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: ChildrenProps) {
  return <>{children}</>;
}

export function TooltipContent({ children }: ChildrenProps) {
  return <>{children}</>;
}