import { Link, useLocation } from "wouter";
import { Moon, Sun, TerminalSquare, Menu, X, LogOut, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/core";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/#events" },
    { name: "Achievements", href: "/#achievements" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-background/80 backdrop-blur-lg border-border/50 py-3 shadow-lg" 
        : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(255,0,255,0.5)] transition-all">
              <TerminalSquare className="text-primary w-6 h-6" />
            </div>
            <span className="font-mono font-bold text-xl tracking-tight hidden sm:block">
              RUNTIME<span className="text-primary">_HACKERS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="font-mono text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </a>
              ))}
              {isAdmin && (
                <Link href="/admin" className="font-mono text-sm font-medium text-secondary hover:text-secondary-foreground transition-colors flex items-center gap-1">
                  <Shield size={14} /> Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4 border-l border-border/50 pl-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono opacity-80 hidden lg:block">
                    [{user?.username}]
                  </span>
                  <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                    <LogOut size={14} /> Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="neon" size="sm">Login_</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/50 shadow-xl p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-lg font-medium p-2 hover:bg-muted rounded-md"
            >
              {link.name}
            </a>
          ))}
          {isAdmin && (
            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-lg font-medium p-2 text-secondary hover:bg-secondary/10 rounded-md"
            >
              Admin Dashboard
            </Link>
          )}
          <hr className="border-border/50 my-2" />
          {isAuthenticated ? (
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { logout(); setMobileMenuOpen(false); }}>
              <LogOut size={18} /> Logout ({user?.username})
            </Button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="neon" className="w-full">Login_</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
