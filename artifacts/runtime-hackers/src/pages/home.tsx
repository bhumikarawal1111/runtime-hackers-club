import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/pages/home/hero";
import { EventsSection } from "@/pages/home/events";
import { AchievementsSection } from "@/pages/home/achievements";
import { ContactSection } from "@/pages/home/contact";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        
        {/* Simple About Section */}
        <section id="about" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-mono font-bold mb-6">
                  <span className="text-secondary">INIT</span>_ABOUT
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Runtime Hackers was founded on a simple principle: theory is good, but building is better. 
                    We are a collective of driven students dedicated to pushing the boundaries of what's possible with code.
                  </p>
                  <p>
                    From competitive programming and hackathons to open-source contributions and community workshops, 
                    we provide the environment, resources, and network for you to excel in the tech industry.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-6 rounded-2xl border border-border/50 text-center shadow-lg">
                  <div className="text-4xl font-bold font-mono text-primary mb-2">500+</div>
                  <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Active Members</div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border/50 text-center shadow-lg">
                  <div className="text-4xl font-bold font-mono text-secondary mb-2">50+</div>
                  <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Events Yearly</div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border/50 text-center shadow-lg">
                  <div className="text-4xl font-bold font-mono text-accent mb-2">25+</div>
                  <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Hackathons Won</div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border/50 text-center shadow-lg">
                  <div className="text-4xl font-bold font-mono text-foreground mb-2">2018</div>
                  <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Established</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EventsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
