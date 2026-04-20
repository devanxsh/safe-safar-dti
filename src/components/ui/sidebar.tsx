import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

type SidebarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

interface ChildrenProps { children?: React.ReactNode }

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: ChildrenProps) {
  const [open, setOpen] = React.useState(true)

  const toggleSidebar = () => setOpen(!open)

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: ChildrenProps) {
  const { open } = useSidebar()

  return (
    <div
      style={{
        width: open ? "250px" : "60px",
        transition: "0.3s",
        background: "#111",
        color: "white",
        height: "100vh",
        padding: "10px",
      }}
    >
      {children}
    </div>
  )
}

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <button onClick={toggleSidebar} style={{ marginBottom: "10px" }}>
      Toggle
    </button>
  )
}

export function SidebarContent({ children }: ChildrenProps) {
  return <div>{children}</div>
}

export function SidebarMenu({ children }: ChildrenProps) {
  return <ul style={{ listStyle: "none", padding: 0 }}>{children}</ul>
}

export function SidebarMenuItem({ children }: ChildrenProps) {
  return <li style={{ padding: "8px 0" }}>{children}</li>
}

export function SidebarMenuButton({ children }: ChildrenProps) {
  return (
    <button
      style={{
        background: "none",
        border: "none",
        color: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}