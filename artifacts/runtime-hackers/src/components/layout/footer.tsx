import { TerminalSquare, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TerminalSquare className="text-primary w-6 h-6" />
              <span className="font-mono font-bold text-xl tracking-tight">
                RUNTIME<span className="text-primary">_HACKERS</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering students through code. We build, we break, we innovate. Join the premier college hacker community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Github size={18} /></a>
              <a href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-secondary hover:text-secondary-foreground transition-all"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transition-all"><Linkedin size={18} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-mono font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li><a href="/#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/#events" className="text-muted-foreground hover:text-primary transition-colors">Upcoming Events</a></li>
              <li><a href="/#achievements" className="text-muted-foreground hover:text-primary transition-colors">Achievements</a></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-mono font-bold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail size={16} className="text-secondary" /> hello@runtimehackers.edu</li>
              <li className="flex items-center gap-2"><TerminalSquare size={16} className="text-accent" /> CS Building, Room 404</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm font-mono text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Runtime Hackers. All rights reserved. System online.</p>
        </div>
      </div>
    </footer>
  );
}
