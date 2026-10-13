import { Search, FileText, Film, LineChart, Play } from "lucide-react";
import ProcessAnimation from "@/components/ProcessAnimation";
import researchMp4 from "@/assets/process-research.mp4";
import researchWebm from "@/assets/process-research.webm";
import researchPoster from "@/assets/process-research-poster.jpg";
import preproductionMp4 from "@/assets/process-preproduction.mp4";
import preproductionWebm from "@/assets/process-preproduction.webm";
import preproductionPoster from "@/assets/process-preproduction-poster.jpg";
import productionMp4 from "@/assets/process-production.mp4";
import productionWebm from "@/assets/process-production.webm";
import productionPoster from "@/assets/process-production-poster.jpg";
import optimizationMp4 from "@/assets/process-optimization.mp4";
import optimizationWebm from "@/assets/process-optimization.webm";
import optimizationPoster from "@/assets/process-optimization-poster.jpg";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Research & Strategy",
    description:
      "We extract verbatim quotes from your real audience: Amazon reviews, Reddit, TikTok comments, YouTube, forums. Each quote becomes 5-10 unique hooks.",
    gif: { mp4: researchMp4, webm: researchWebm, poster: researchPoster },
    gifLabel: "Audience research extraction",
  },
  {
    icon: FileText,
    number: "02",
    title: "Pre-Production",
    description:
      "Scripts refined with AI + human oversight. Storyboards, AI voiceovers, and modular structures planned for maximum variation potential.",
    gif: { mp4: preproductionMp4, webm: preproductionWebm, poster: preproductionPoster },
    gifLabel: "Script & storyboard creation",
  },
  {
    icon: Film,
    number: "03",
    title: "Production",
    description:
      "Each editor delivers 1.5 videos daily. Every piece reviewed before delivery. You see progress in real-time.",
    gif: { mp4: productionMp4, webm: productionWebm, poster: productionPoster },
    gifLabel: "Daily video production",
  },
  {
    icon: LineChart,
    number: "04",
    title: "Optimization",
    description:
      "Weekly calls to review winners. We analyze what worked, produce variations of winning structures, and test new angles simultaneously.",
    gif: { mp4: optimizationMp4, webm: optimizationWebm, poster: optimizationPoster },
    gifLabel: "Winner analysis & iteration",
  },
];

const Process = () => {
  return (
    <section id="process" className="py-20 md:py-24 bg-background px-6 md:px-12 lg:px-24">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-nerdbatch-gold text-sm font-semibold tracking-widest uppercase">
            How We Work
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6">
            Our Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A proven system for producing high-volume creative that performs.
            From research to results in record time.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                {/* Step Card */}
                <div className="relative bg-muted/50 rounded-2xl overflow-hidden hover:bg-muted transition-colors duration-300 h-full">
                  {/* GIF/Video Area */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border overflow-hidden">
                    {step.gif ? (
                      <ProcessAnimation {...step.gif} label={step.gifLabel} />
                    ) : (
                      <>
                        {/* Placeholder pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%, transparent 75%, hsl(var(--muted)) 75%)`,
                              backgroundSize: "16px 16px",
                              backgroundPosition: "0 0, 8px 8px",
                            }}
                          />
                        </div>

                        {/* Play indicator for GIF */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* GIF label */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                        {step.gifLabel}
                      </span>
                    </div>

                    {/* Number Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-4 shadow-sm">
                      <step.icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
