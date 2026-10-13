import { TrendingUp, Target, Clock, ArrowUpRight } from "lucide-react";

const caseStudies = [
  {
    id: 1,
    brand: "Oral Care Brand",
    industry: "Health & Beauty",
    challenge:
      "Stuck at $50k/month in Meta spend. Testing 5-10 ads weekly wasn't finding consistent winners. Creative fatigue was killing their scaling potential.",
    solution:
      "Implemented our modular production system: 49+ video variations weekly, systematic testing across hooks, angles, and formats. Deep research revealed audience language they'd never used in ads.",
    results: [
      { label: "Ad Spend Scaled", value: "3x", description: "From $50k to $150k/mo" },
      { label: "CPA Reduction", value: "-32%", description: "Lower acquisition cost" },
      { label: "Winner Rate", value: "4x", description: "More winning creatives" },
    ],
    resultSummary: "In 8 weeks: 3x ad spend scaled, 32% CPA reduction, 4x winner rate. They went from 1-2 \"maybe winners\" to 10+ proven performers rotating simultaneously.",
    timeline: "8 weeks",
    platform: "Meta",
    placeholderGradient: "from-emerald-500/20 to-teal-500/20",
  },
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="section-padding bg-nerdbatch-dark text-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6">
            Real Results, Real Brands
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            See how we've helped DTC brands scale their creative testing and
            unlock new levels of performance.
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Visual Side */}
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div
                  className={`relative aspect-[4/3] rounded-2xl bg-gradient-to-br ${study.placeholderGradient} border border-white/10 overflow-hidden`}
                >
                  {/* Placeholder pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%)`,
                        backgroundSize: "30px 30px",
                        backgroundPosition: "0 0, 15px 15px",
                      }}
                    />
                  </div>

                  {/* Platform badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        study.platform === "Meta"
                          ? "bg-blue-500 text-white"
                          : "bg-pink-500 text-white"
                      }`}
                    >
                      {study.platform}
                    </span>
                  </div>

                  {/* Central content placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-white/60" />
                      </div>
                      <p className="text-white/60 text-sm">Video showcase placeholder</p>
                    </div>
                  </div>

                  {/* Timeline badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white/70">{study.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                {/* Brand info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{study.brand}</h3>
                    <p className="text-gray-500 text-sm">{study.industry}</p>
                  </div>
                </div>

                {/* Challenge */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    The Challenge
                  </h4>
                  <p className="text-gray-400 leading-relaxed">{study.challenge}</p>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    Our Solution
                  </h4>
                  <p className="text-gray-400 leading-relaxed">{study.solution}</p>
                </div>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    The Result
                  </h4>
                  <p className="text-gray-400 leading-relaxed">{study.resultSummary}</p>
                </div>

                {/* Results Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {study.results.map((result) => (
                    <div
                      key={result.label}
                      className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl md:text-3xl font-black text-primary">
                          {result.value}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{result.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
