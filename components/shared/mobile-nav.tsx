"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: readonly NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const handleNavigation = () => {
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Ouvrir le menu de navigation"
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80">
        <nav
          id="mobile-nav-menu"
          className="flex flex-col gap-4 pt-8"
          onKeyDown={handleKeyDown}
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavigation}
              className="text-base font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
