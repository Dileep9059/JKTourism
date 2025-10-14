import { Link, NavLink } from "react-router-dom";
import { IconMenu } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    isActive: boolean;
    disabled?: boolean;
  }[];
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                {disabled ? (
                  <span className="cursor-not-allowed text-muted-foreground">
                    {title}
                  </span>
                ) : (
                  <Link
                    to={href}
                    className={cn({ "text-muted-foreground": !isActive })}
                  >
                    {title}
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          "hidden items-center space-x-4 md:flex lg:space-x-6",
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) =>
          disabled ? (
            <span
              key={`${title}-${href}`}
              className="text-sm font-medium text-muted-foreground cursor-not-allowed"
            >
              {title}
            </span>
          ) : (
            <NavLink
              key={`${title}-${href}`}
              to={href}
              className={({ isActive: active }) =>
                cn(
                  "hover:text-primary text-sm font-medium transition-colors",
                  !isActive || !active ? "text-muted-foreground" : ""
                )
              }
            >
              {title}
            </NavLink>
          )
        )}
      </nav>
    </>
  );
}
