import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../components/landing/Hero';
import { StatsBar } from '../components/landing/StatsBar';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { UserStory } from '../components/landing/UserStory';
import { Pricing } from '../components/landing/Pricing';
import { Roadmap } from '../components/landing/Roadmap';
import { Footer } from '../components/landing/Footer';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-abyss-950 text-white selection:bg-neon-cyan selection:text-abyss-950">
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <UserStory />
      <Pricing />
      <Roadmap />
      <Footer />
    </div>
  );
}
