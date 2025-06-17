import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/order", label: "Order Online" },
    { href: "/gallery", label: "Gallery" },
    { href: "/reviews", label: "Reviews" },
    { href: "/booking", label: "Book Table" },
  ];

  const NavLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={`${
            mobile ? "block px-3 py-2" : ""
          } text-gray-700 hover:text-roos-brown transition-colors duration-200 ${
            location === link.href ? "text-roos-brown font-semibold" : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-3xl font-playfair font-bold text-roos-brown cursor-pointer">
                Roos Park
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <NavLinks />
              <Link href="/admin">
                <Button className="bg-roos-brown text-white hover:bg-roos-chocolate">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks mobile onLinkClick={() => setMobileMenuOpen(false)} />
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-roos-brown text-white hover:bg-roos-chocolate">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
