import { TrendingUp, RefreshCw, BarChart3 } from "lucide-react";

const advantages = [
  {
    icon: TrendingUp,
    title: "More Angles = More Winners",
    description:
      "More angles tested means more winners found. We attack multiple hooks simultaneously so you're not betting everything on one creative.",
  },
  {
    icon: RefreshCw,
    title: "Stay Ahead of Fatigue",
    description:
      "Winners burn out. We produce new variations before fatigue hits, so you always have the next winner ready.",
  },
  {
    icon: BarChart3,
    title: "Scale What Works",
    description:
      "When a creative wins, we know why. We analyze winners, replicate the structure, and scale what works while testing what's next.",
  },
];

const VolumeAdvantage = () => {
  return (
    <section id="volume" className="py-24 md:py-32 bg-nerdbatch-dark text-white px-6 md:px-12 lg:px-24">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Why Volume Wins
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6">
            The Volume Advantage
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            In performance creative, more shots on goal means more wins. Here's why
            high-volume testing outperforms the competition.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {advantages.map((advantage, index) => (
            <div
              key={advantage.title}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <advantage.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {advantage.description}
              </p>

              {/* Number indicator */}
              <div className="absolute top-6 right-6 text-6xl font-black text-white/5 group-hover:text-primary/10 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolumeAdvantage;
