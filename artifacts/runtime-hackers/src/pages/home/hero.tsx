import { Button } from "@/components/ui/core";
import { motion } from "framer-motion";
import { ChevronRight, Code } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20 dark:opacity-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.png)` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-6 shadow-[0_0_15px_rgba(255,0,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            System Status: ONLINE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            <span className="block text-foreground">Welcome to</span>
            <span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent glitch-text font-mono mt-2"
              data-text="RUNTIME_HACKERS"
            >
              RUNTIME_HACKERS
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            The premier college coding club. We don't just write code—we build the future. 
            Join the collective of developers, designers, and disruptive thinkers.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="gap-2 shadow-[0_0_20px_rgba(255,0,255,0.4)] group">
              Join The Collective <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-secondary text-secondary hover:bg-secondary/10">
              <Code className="w-5 h-5" /> View Protocol_Events
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-[30px] h-[50px] rounded-full border-2 border-muted-foreground flex justify-center pt-2">
          <div className="w-1 h-3 bg-muted-foreground rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
