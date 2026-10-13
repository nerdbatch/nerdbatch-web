import { Video, Users, Target } from "lucide-react";

const stats = [
  {
    icon: Video,
    value: "49",
    label: "videos weekly",
    description: "For a leading oral care brand",
  },
  {
    icon: Users,
    value: "12",
    label: "team members",
    description: "100% focused on volume creative",
  },
  {
    icon: Target,
    value: "DTC",
    label: "brand specialists",
    description: "Scaling Meta & TikTok spend",
  },
];

const SocialProof = () => {
  return (
    <section className="section-padding bg-muted/50 border-y border-border">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Trusted by Brands Ready to Scale
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-black mb-2">
                {stat.value}
                {stat.value !== "DTC" && <span className="text-primary">+</span>}
              </div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
