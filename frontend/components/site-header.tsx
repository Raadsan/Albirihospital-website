import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-blue-100 bg-white/85 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div>
          <h1 className="text-base font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="hidden text-xs text-slate-500 sm:block">Albiri Hospital management portal</p>
        </div>
      </div>
    </header>
  )
}
