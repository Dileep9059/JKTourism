import { cn } from '@/lib/utils'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Outlet } from 'react-router-dom'
import { GenericDialogProvider } from '@/features/users/components/server-side/GenericDialogProvider'
import { SearchProvider } from '@/context/search-context'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { InnerHeader } from './layout/structure/InnerHeader'

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

            <SidebarInset>
              <InnerHeader />
              <div className="flex flex-1 flex-col gap-4">
                {children ? children : <Outlet />}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </GenericDialogProvider>
      </SearchProvider>
    </>
  );
};

export default Sidebar;
