import { motion } from "framer-motion";
import { Zap, Shield, WifiOff, Cpu, Layers, Terminal } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Native Performance",
    description: "Built with Swift and optimized Rust bindings. Launches instantly, executes requests in microseconds.",
    color: "text-neon-cyan",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data never leaves your device. No cloud sync mandated, no telemetry that spies on your headers.",
    color: "text-electric-lime",
  },
  {
    icon: WifiOff,
    title: "Offline Ready",
    description: "Design APIs in flight or in a tunnel. Full functionality without an internet connection.",
    color: "text-electric-violet",
  },
  {
    icon: Cpu,
    title: "Low Resource Usage",
    description: "Sips RAM like a fine wine. Runs smoothly alongside your heavy Docker containers and IDEs.",
    color: "text-blue-400",
  },
  {
    icon: Layers,
    title: "Smart Tunneling",
    description: "Expose your localhost to the world instantly. Auto-generating URLs for webhooks testing.",
    color: "text-pink-400",
  },
  {
    icon: Terminal,
    title: "SDK Gen via Swagger",
    description: "Import OpenAPI/Swagger specs. Export client SDKs for any platform instantly. (Coming Soon)",
    color: "text-orange-400",
  },
  {
    icon: Zap,
    title: "Relay (Outray.dev)",
    description: "Built-in integration with Outray.dev. Tunnel localhost to the public web with zero config. (Coming Soon)",
    color: "text-purple-400",
  },
];

export const FeatureGrid = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Power Under the Hood</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We stripped away the bloat and focused on what matters: executing HTTP requests with precision and speed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-2xl group hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10"
            >
              <div className={`p-3 rounded-lg bg-white/5 w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
