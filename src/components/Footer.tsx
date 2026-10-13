import { Instagram, Linkedin } from "lucide-react";
import nerdbatchLogoFooter from "@/assets/nerdbatch-logo-footer.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/nerdbatch/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/nerdbatch", label: "LinkedIn" },
  ];

  const footerLinks = [
    { name: "Process", href: "#process" },
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-nerdbatch-dark text-white section-padding !py-12">
      <div className="container-max">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={nerdbatchLogoFooter} 
              alt="NerdBatch" 
              className="h-8 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {currentYear} NerdBatch. All rights reserved.</p>
          <p>Creative Engineering for DTC Brands</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
