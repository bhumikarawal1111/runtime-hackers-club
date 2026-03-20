import { Card } from "@/components/ui/core";
import { motion } from "framer-motion";
import { Trophy, Award, Star, Cpu } from "lucide-react";
import { useGetAchievements } from "@workspace/api-client-react";

export function AchievementsSection() {
  const { data: achievements, isLoading } = useGetAchievements();

  const getIcon = (iconName?: string) => {
    switch(iconName?.toLowerCase()) {
      case 'award': return <Award className="w-8 h-8 text-secondary" />;
      case 'star': return <Star className="w-8 h-8 text-primary" />;
      case 'cpu': return <Cpu className="w-8 h-8 text-accent" />;
      default: return <Trophy className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <section id="achievements" className="py-24 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 text-foreground">
            <span className="text-primary">Hall_Of_</span>FAME
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A track record of excellence. We don't just participate; we dominate.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:border-primary/50 transition-colors">
                  <div className="w-16 h-16 mx-auto bg-background rounded-2xl flex items-center justify-center border border-border shadow-inner mb-4">
                    {getIcon(achievement.icon)}
                  </div>
                  <div className="font-mono text-sm text-muted-foreground mb-2">{achievement.year} &bull; {achievement.category}</div>
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{achievement.description}</p>
                  <div className="inline-block bg-muted px-3 py-1 rounded-md text-xs font-bold text-foreground">
                    Awarded to: {achievement.awardedTo}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-mono">No achievements logged yet. The history is being written.</p>
          </div>
        )}
      </div>
    </section>
  );
}
