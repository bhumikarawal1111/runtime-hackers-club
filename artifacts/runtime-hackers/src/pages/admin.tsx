import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Button, Card, Badge, Dialog, Input, Label, Textarea } from "@/components/ui/core";
import { useAuth } from "@/hooks/use-auth";
import { CalendarPlus, Trophy, MessageSquare, Plus, ArrowLeft } from "lucide-react";
import { 
  useGetEvents, 
  useCreateEvent, 
  getGetEventsQueryKey,
  useGetAchievements,
  useCreateAchievement,
  getGetAchievementsQueryKey,
  useGetContactMessages 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatDate } from "@/lib/utils";

// --- SCHEMAS ---
const eventSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  date: z.string().min(1, "Date required"),
  location: z.string().min(1, "Location required"),
  category: z.string().min(1, "Category required"),
  imageUrl: z.string().optional(),
});

const achievementSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  year: z.coerce.number().min(2000, "Valid year required"),
  awardedTo: z.string().min(1, "Recipient required"),
  category: z.string().min(1, "Category required"),
  icon: z.string().optional(),
});

type Tab = "events" | "achievements" | "messages";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);

  // Queries
  const { data: events, isLoading: eventsLoading } = useGetEvents({ query: { enabled: isAdmin } });
  const { data: achievements, isLoading: achievementsLoading } = useGetAchievements({ query: { enabled: isAdmin } });
  const { data: messages, isLoading: messagesLoading } = useGetContactMessages({ query: { enabled: isAdmin } });

  // Mutations
  const createEventMut = useCreateEvent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() });
        setEventDialogOpen(false);
        eventForm.reset();
      }
    }
  });

  const createAchievementMut = useCreateAchievement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAchievementsQueryKey() });
        setAchievementDialogOpen(false);
        achievementForm.reset();
      }
    }
  });

  // Forms
  const eventForm = useForm<z.infer<typeof eventSchema>>({ resolver: zodResolver(eventSchema) });
  const achievementForm = useForm<z.infer<typeof achievementSchema>>({ resolver: zodResolver(achievementSchema) });

  // Auth Guard
  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (!isAuthenticated || !isAdmin) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-border/50 pb-6">
            <div>
              <Link href="/" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-4 transition-colors">
                <ArrowLeft size={14} className="mr-1" /> Back to Site
              </Link>
              <h1 className="text-3xl font-mono font-bold text-foreground">COMMAND_CENTER</h1>
              <p className="text-muted-foreground mt-1">Logged in as Administrator: {user?.name}</p>
            </div>
            
            <div className="flex bg-muted p-1 rounded-lg border border-border">
              <button 
                onClick={() => setActiveTab("events")} 
                className={`px-4 py-2 text-sm font-mono font-bold rounded-md flex items-center gap-2 ${activeTab === "events" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <CalendarPlus size={16} /> EVENTS
              </button>
              <button 
                onClick={() => setActiveTab("achievements")} 
                className={`px-4 py-2 text-sm font-mono font-bold rounded-md flex items-center gap-2 ${activeTab === "achievements" ? "bg-background text-secondary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Trophy size={16} /> AWARDS
              </button>
              <button 
                onClick={() => setActiveTab("messages")} 
                className={`px-4 py-2 text-sm font-mono font-bold rounded-md flex items-center gap-2 ${activeTab === "messages" ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MessageSquare size={16} /> INBOX
              </button>
            </div>
          </div>

          {/* TAB CONTENT: EVENTS */}
          {activeTab === "events" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-mono font-bold">Manage Events</h2>
                <Button onClick={() => setEventDialogOpen(true)} className="gap-2"><Plus size={16} /> New Event</Button>
              </div>

              {eventsLoading ? <p className="text-muted-foreground">Loading events...</p> : (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted font-mono uppercase text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {events?.length ? events.map(e => (
                        <tr key={e.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{e.title}</td>
                          <td className="px-6 py-4 font-mono">{formatDate(e.date)}</td>
                          <td className="px-6 py-4"><Badge>{e.category}</Badge></td>
                          <td className="px-6 py-4 text-muted-foreground">{e.location}</td>
                        </tr>
                      )) : <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No events found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-mono font-bold">Manage Achievements</h2>
                <Button onClick={() => setAchievementDialogOpen(true)} className="gap-2"><Plus size={16} /> Add Award</Button>
              </div>

              {achievementsLoading ? <p className="text-muted-foreground">Loading achievements...</p> : (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted font-mono uppercase text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Recipient</th>
                        <th className="px-6 py-4">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {achievements?.length ? achievements.map(a => (
                        <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{a.title}</td>
                          <td className="px-6 py-4 font-mono">{a.year}</td>
                          <td className="px-6 py-4">{a.awardedTo}</td>
                          <td className="px-6 py-4"><Badge variant="secondary">{a.category}</Badge></td>
                        </tr>
                      )) : <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No achievements found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: MESSAGES */}
          {activeTab === "messages" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-mono font-bold mb-6">Inbox / Transmissions</h2>
              {messagesLoading ? <p className="text-muted-foreground">Loading messages...</p> : (
                <div className="grid grid-cols-1 gap-4">
                  {messages?.length ? messages.map(m => (
                    <Card key={m.id} className="!p-0">
                      <div className="p-6 border-b border-border/50 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{m.subject}</h3>
                            <p className="text-sm font-mono text-muted-foreground mt-1">From: <a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.name} &lt;{m.email}&gt;</a></p>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded border border-border">
                            {formatDate(m.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 text-foreground whitespace-pre-wrap font-sans text-sm">
                        {m.message}
                      </div>
                    </Card>
                  )) : <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground">Inbox is empty.</div>}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* CREATE EVENT DIALOG */}
      <Dialog isOpen={eventDialogOpen} onClose={() => setEventDialogOpen(false)} title="Create New Event">
        <form onSubmit={eventForm.handleSubmit(data => createEventMut.mutate({ data }))} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...eventForm.register("title")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date (YYYY-MM-DD)</Label>
              <Input type="date" {...eventForm.register("date")} />
            </div>
            <div>
              <Label>Category</Label>
              <Input placeholder="Hackathon, Workshop..." {...eventForm.register("category")} />
            </div>
          </div>
          <div>
            <Label>Location</Label>
            <Input {...eventForm.register("location")} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...eventForm.register("description")} />
          </div>
          <div>
            <Label>Image URL (Optional)</Label>
            <Input {...eventForm.register("imageUrl")} placeholder="https://..." />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createEventMut.isPending}>Create Event</Button>
          </div>
        </form>
      </Dialog>

      {/* CREATE ACHIEVEMENT DIALOG */}
      <Dialog isOpen={achievementDialogOpen} onClose={() => setAchievementDialogOpen(false)} title="Log Achievement">
        <form onSubmit={achievementForm.handleSubmit(data => createAchievementMut.mutate({ data }))} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...achievementForm.register("title")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Year</Label>
              <Input type="number" {...achievementForm.register("year")} />
            </div>
            <div>
              <Label>Category</Label>
              <Input {...achievementForm.register("category")} />
            </div>
          </div>
          <div>
            <Label>Awarded To (Team / Person)</Label>
            <Input {...achievementForm.register("awardedTo")} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...achievementForm.register("description")} />
          </div>
          <div>
            <Label>Icon Type (Trophy, Award, Star, Cpu)</Label>
            <Input {...achievementForm.register("icon")} placeholder="Trophy" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAchievementDialogOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createAchievementMut.isPending}>Add Achievement</Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}
