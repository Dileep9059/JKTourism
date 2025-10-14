import { cn } from '@/lib/utils'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Outlet } from 'react-router-dom'
import { GenericDialogProvider } from '@/features/users/components/server-side/GenericDialogProvider'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from './ui/sidebar'

interface Props {
  children?: React.ReactNode
}


const Sidebar = ({ children }: Props) => {
  return (
    <>
      <SearchProvider>
        <GenericDialogProvider<unknown>>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div
              id="content"
              className={cn(
                "ml-auto w-full max-w-full",
                "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
                "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
                "sm:transition-[width] sm:duration-200 sm:ease-linear",
                "flex h-svh flex-col",
                "group-data-[scroll-locked=1]/body:h-full",
                "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
              )}
            >
              {children ? children : <Outlet />}
            </div>
          </SidebarProvider>
        </GenericDialogProvider>
      </SearchProvider>
    </>
  );
};

export default Sidebar;
