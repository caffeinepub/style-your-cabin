import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Home, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Top utility bar */}
      <div className="w-full bg-foreground text-background text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="flex-1" />
          <span className="font-sans tracking-widest uppercase text-[10px] opacity-80">
            Style Your Cabin – AI Interior Design
          </span>
          <div className="flex-1 flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              data-ocid="header.toggle"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-full px-2.5 py-1 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-3 h-3" />
              ) : (
                <Sun className="w-3 h-3" />
              )}
              <span className="text-[10px]">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link
              to="/"
              data-ocid="header.link"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="font-sans font-semibold text-xs tracking-[0.2em] uppercase text-foreground leading-tight">
                  STYLE YOUR CABIN
                </div>
                <div className="font-sans text-[10px] text-muted-foreground tracking-wider">
                  AI Interior Design
                </div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { label: "How it Works", href: "/#how-it-works" },
                { label: "Features", href: "/#features" },
                { label: "Styles", href: "/#styles" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  data-ocid="header.link"
                  className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link to="/design">
                <Button
                  size="sm"
                  data-ocid="header.primary_button"
                  className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-sans text-sm"
                >
                  Start Designing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
