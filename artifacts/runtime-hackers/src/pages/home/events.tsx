import { Card, Badge } from "@/components/ui/core";
import { motion } from "framer-motion";
import { Calendar, MapPin, Tag } from "lucide-react";
import { useGetEvents } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";

export function EventsSection() {
  const { data: events, isLoading } = useGetEvents();

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'hackathon': return 'primary';
      case 'workshop': return 'secondary';
      case 'meetup': return 'accent';
      default: return 'default';
    }
  };

  return (
    <section id="events" className="py-24 bg-card/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 text-foreground">
            <span className="text-secondary">&gt;</span> UPCOMING_EVENTS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our latest hackathons, workshops, and tech talks. Level up your skills.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                  {event.imageUrl && (
                    <div className="h-48 w-full overflow-hidden -mx-6 -mt-6 mb-6">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mb-4">
                    <Badge variant={getCategoryColor(event.category) as any}>{event.category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground text-sm flex-grow mb-6">{event.description}</p>
                  
                  <div className="space-y-2 text-sm font-mono mt-auto">
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar size={16} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-mono text-muted-foreground">No events scheduled. Check back later!</h3>
          </div>
        )}
      </div>
    </section>
  );
}
