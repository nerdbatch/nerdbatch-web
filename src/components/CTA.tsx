import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTA = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-background text-foreground px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="container-max">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Ready to scale?</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6">
            Ready to stop betting on{" "}
            <span className="relative inline-block">
              one creative?
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            If you're spending $100K+/month on Meta or TikTok and want more winners, faster... let's talk.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="group" asChild>
              <a href="https://calendly.com/mary-nerdbatch/30min" target="_blank" rel="noopener noreferrer">
                Book a Strategy Call
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          {/* Alternative Contact */}
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="text-sm">
              Or email us at{" "}
              <a
                href="mailto:hello@nerdbatch.com"
                className="text-nerdbatch-gold hover:underline font-medium"
              >
                hello@nerdbatch.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
