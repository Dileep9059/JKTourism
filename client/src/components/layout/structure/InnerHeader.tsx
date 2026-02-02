import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "@/components/search";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { e } from "@/components/utils/crypto"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}


export const InnerHeader = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(20);

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const setPreviousPage = async () => {
      const result = await e(window.location.pathname);
      localStorage.setItem("_|_", result);
    };
    setPreviousPage();
  }, []);



  return (
    <header
      className={cn(
        "bg-background sticky top-0 flex h-16 items-center gap-3 p-4 sm:gap-4 z-50",
        className
      )}
      {...props}
    >
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />
      {children}

      <div className="ml-auto flex items-center space-x-4">
        <Search />
        {/* <NotificationDropdown /> */}
        {/* <ThemeSwitch /> */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

InnerHeader.displayName = "Header";
