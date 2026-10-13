import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import nerdbatchLogo from "@/assets/nerdbatch-logo-horizontal.png";
import PromoBanner from "@/components/PromoBanner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Volume", href: "#volume" },
    { name: "Process", href: "#process" },
    { name: "Our Work", href: "#work" },
    { name: "Services", href: "#services" },
  ];

  return (
    <>
      <PromoBanner />
      <nav
        className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container-max section-padding !py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src={nerdbatchLogo} 
              alt="NerdBatch" 
              className="h-6 md:h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button variant="primary" size="sm" asChild>
              <a href="#contact">Let's Talk Volume</a>
            </Button>
          </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-fade-in">
            <div className="section-padding !py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button variant="primary" className="mt-4" asChild>
                <a href="#contact">Let's Talk Volume</a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
