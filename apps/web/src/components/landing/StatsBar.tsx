import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { label: "Open Source", value: 100, suffix: "%" },
  { label: "Cloud Latency", value: 0, suffix: "ms" },
  { label: "Memory Footprint", value: 45, suffix: "MB" },
  { label: "Tracking Scripts", value: 0, suffix: "" },
];

export const StatsBar = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".stat-item", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    stats.forEach((stat, i) => {
      const el = document.getElementById(`stat-val-${i}`);
      const targetVal = stat.value;

      gsap.to(el, {
        innerText: targetVal,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        onUpdate: function () {
          if (el) {
            el.innerText = Math.ceil(this.targets()[0].innerText) + stat.suffix;
          }
        }
      });
    });

  }, { scope: container });

  return (
    <div ref={container} className="relative z-20 py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item text-center relative group"
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div
                id={`stat-val-${index}`}
                className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
              >
                0{stat.suffix}
              </div>
              <div className="text-sm text-neon-cyan font-mono uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
