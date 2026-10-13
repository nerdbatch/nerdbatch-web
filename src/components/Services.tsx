import { Layers, Target, Workflow } from "lucide-react";

const services = [
  {
    icon: Layers,
    title: "High-Volume Creative Production",
    description:
      "Up to 55 videos per week with systematic testing frameworks. We produce at scale without sacrificing quality or strategic thinking.",
    features: ["Batch production workflows", "Systematic A/B testing", "Weekly delivery cycles"],
  },
  {
    icon: Target,
    title: "Meta & TikTok Optimization",
    description:
      "Built for how algorithms actually work in 2025: diversity of angles, not just polished creatives.",
    features: ["Platform-specific formats", "Hook optimization", "Trend integration"],
  },
  {
    icon: Workflow,
    title: "Full Creative Pipeline",
    description:
      "Pre-production through launch: scripts, AI voiceovers, editing, static/GIF variants. Everything you need, nothing you don't.",
    features: ["End-to-end production", "AI-powered efficiency", "Multi-format delivery"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-foreground text-background px-6 md:px-12 lg:px-24">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            What We Do
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6">
            Services Built for Scale
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto text-lg">
            Everything you need to run high-volume creative testing
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-8 rounded-2xl border border-background/20 bg-background/5 hover:bg-background/10 hover:border-primary/40 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <service.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4 text-background">{service.title}</h3>
              <p className="text-background/70 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-background/70">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
