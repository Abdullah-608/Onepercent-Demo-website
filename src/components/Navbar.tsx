"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { flushSync } from "react-dom";
import { BOOK_CALL_URL, navLinks } from "@/lib/content";
import { buttonOutline, buttonPrimary } from "@/lib/ui";
import { syne } from "@/lib/fonts";

export default function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkTheme = currentTheme === "dark";

  // Close the mobile menu on navigation, and on Escape
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }
  useEffect(() => {
    if (!menuOpen) return;
    // Lock page scroll behind the menu (Lenis drives scrolling site-wide)
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDarkTheme ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-background/80 backdrop-blur-md border border-accent/20 rounded-2xl flex items-center justify-between px-4 sm:px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.04)]">
      {/* Logo */}
      <Link href="/" className="text-lg sm:text-xl font-bold tracking-widest uppercase flex-shrink-0">
        ONE PERCENT
      </Link>

      {/* Links */}
      <div className="hidden lg:flex items-center justify-center gap-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest flex-1">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`relative py-1 transition-opacity after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-current after:origin-left after:transition-transform after:duration-300 ${
              isActive(l.href) ? "after:scale-x-100" : "after:scale-x-0 hover:opacity-60"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Buttons & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Link href="/estimate" className={`hidden sm:block px-5 py-2.5 text-xs ${buttonOutline}`}>
          Get Estimation
        </Link>
        <a href={BOOK_CALL_URL} className={`hidden sm:block px-5 py-2.5 text-xs ${buttonPrimary}`}>
          Book a call
        </a>

        {/* Simple & Elegant Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="relative p-2 ml-1 rounded-full overflow-hidden border border-accent/20 bg-accent/5 hover:bg-accent/15 transition-all duration-300"
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
            {isDarkTheme ? (
              <Sun className="absolute inset-0 w-5 h-5 animate-in spin-in-90 fade-in duration-300" />
            ) : (
              <Moon className="absolute inset-0 w-5 h-5 animate-in spin-in-90 fade-in duration-300" />
            )}
          </div>
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden p-2 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/15 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </nav>

    {/* Mobile menu */}
    <div
      id="mobile-menu"
      className={`lg:hidden fixed inset-0 z-40 bg-background text-foreground flex flex-col justify-between px-6 pt-32 pb-10 transition-[opacity,visibility] duration-300 ${
        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <ul className="flex flex-col">
        {navLinks.map((l, i) => (
          <li key={l.href} className="border-b border-foreground/10">
            <Link
              href={l.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(l.href) ? "page" : undefined}
              style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }}
              className={`block py-4 text-[clamp(2rem,9vw,3.5rem)] font-extrabold uppercase tracking-[-0.03em] leading-none transition-[opacity,transform] duration-500 ${
                menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } ${isActive(l.href) ? "" : "text-foreground/40 hover:text-foreground"} ${syne.className}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3">
        <a href={BOOK_CALL_URL} className={`w-full py-4 text-sm ${buttonPrimary}`}>
          Book a call
        </a>
        <Link href="/estimate" onClick={() => setMenuOpen(false)} className={`w-full py-4 text-sm ${buttonOutline}`}>
          Get Estimation
        </Link>
      </div>
    </div>
    </>
  );
}

