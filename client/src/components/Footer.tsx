import { Link } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-gradient-to-b from-card to-green-50/50 dark:to-green-950/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-green-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-green-500/30">
                <Leaf className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">EcoFriendsAz</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dedicated to protecting and preserving Azerbaijan's rich natural heritage for future generations.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-green-700 dark:text-green-400">{t("quickLinks")}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("home")}
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("aboutUs")}
              </Link>
              <Link href="/competitions" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("competitions")}
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("ecoEvents")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-green-700 dark:text-green-400">{t("getInvolved")}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/competitions" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("takeQuiz")}
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("joinEvent")}
              </Link>
              <Link href="/problems" className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                {t("reportProblems")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-green-700 dark:text-green-400">{t("contactUs")}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <MapPin className="h-4 w-4 shrink-0 text-green-500 transition-transform group-hover:scale-110" />
                <span>Baku, Azerbaijan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <Mail className="h-4 w-4 shrink-0 text-green-500 transition-transform group-hover:scale-110" />
                <span>info@ecofriends.az</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <Phone className="h-4 w-4 shrink-0 text-green-500 transition-transform group-hover:scale-110" />
                <span>+994 12 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-green-200/50 dark:border-green-900/30 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EcoFriendsAz. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
