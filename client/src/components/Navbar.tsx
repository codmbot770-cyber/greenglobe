import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation, Language } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Menu, User, LogOut, Trophy, Calendar, Globe, Check, Sun, Moon } from "lucide-react";
import { useState } from "react";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("aboutUs") },
    { href: "/competitions", label: t("competitions") },
    { href: "/events", label: t("ecoEvents") },
    { href: "/community", label: t("community") },
    { href: "/problems", label: t("problems") },
  ];

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-green-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-green-500/30 group-hover:shadow-xl">
            <Leaf className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
          </div>
          <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent" data-testid="text-logo">
            EcoFriends
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                size="sm"
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  location === link.href 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                    : "hover:text-green-600 dark:hover:text-green-400"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 transition-all duration-300 hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900/30"
                data-testid="button-language-switcher"
              >
                <Globe className="h-4 w-4 text-green-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center justify-between cursor-pointer"
                  data-testid={`button-lang-${lang.code}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    {lang.label}
                  </span>
                  {language === lang.code && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="h-9 w-9 transition-all duration-300 hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900/30"
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-green-600" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
          </Button>

          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-green-500/50" data-testid="button-user-menu">
                  <Avatar className="h-9 w-9 ring-2 ring-green-500/20">
                    <AvatarImage
                      src={user.profileImageUrl || undefined}
                      alt={user.firstName || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {(user.firstName || user.lastName) && (
                      <p className="font-medium" data-testid="text-user-name">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground" data-testid="text-user-email">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/competitions" className="flex items-center gap-2 cursor-pointer">
                    <Trophy className="h-4 w-4" />
                    {t("myCompetitions")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/events" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    {t("myEvents")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="flex items-center gap-2 cursor-pointer text-destructive" data-testid="button-logout">
                    <LogOut className="h-4 w-4" />
                    {t("logOut")}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/api/login">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 btn-glow" data-testid="button-login">
                {t("signIn")}
              </Button>
            </a>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900/30" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-green-600">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  EcoFriends
                </span>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={location === link.href ? "secondary" : "ghost"}
                      className={`w-full justify-start text-base transition-all duration-300 ${
                        location === link.href 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                          : ""
                      }`}
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">{t("theme")}</p>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={theme === "light" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toggleTheme()}
                    className={`flex-1 gap-2 ${
                      theme === "light" ? "bg-green-100 dark:bg-green-900/30" : ""
                    }`}
                    data-testid="button-theme-light-mobile"
                  >
                    <Sun className="h-4 w-4" />
                    {t("lightMode")}
                  </Button>
                  <Button
                    variant={theme === "dark" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toggleTheme()}
                    className={`flex-1 gap-2 ${
                      theme === "dark" ? "bg-green-100 dark:bg-green-900/30" : ""
                    }`}
                    data-testid="button-theme-dark-mobile"
                  >
                    <Moon className="h-4 w-4" />
                    {t("darkMode")}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{t("language")}</p>
                <div className="flex flex-col gap-1">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setLanguage(lang.code)}
                      className={`justify-start gap-2 ${
                        language === lang.code ? "bg-green-100 dark:bg-green-900/30" : ""
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                      {language === lang.code && <Check className="h-4 w-4 ml-auto text-green-600" />}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
