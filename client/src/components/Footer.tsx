import { Link } from "wouter";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">EcoAzerbaijan</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dedicated to protecting and preserving Azerbaijan's rich natural heritage for future generations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Competitions
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Eco Events
              </Link>
            </nav>
          </div>

          {/* Get Involved */}
          <div className="space-y-4">
            <h3 className="font-semibold">Get Involved</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/competitions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Take a Quiz
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Join an Event
              </Link>
              <Link href="/problems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report Problems
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Baku, Azerbaijan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@ecoazerbaijan.az</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+994 12 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EcoAzerbaijan. All rights reserved. Protecting our environment together.
          </p>
        </div>
      </div>
    </footer>
  );
}
