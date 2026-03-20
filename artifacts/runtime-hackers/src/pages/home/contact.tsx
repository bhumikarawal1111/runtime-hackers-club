import { Button, Input, Textarea, Label } from "@/components/ui/core";
import { Send, CheckCircle } from "lucide-react";
import { useSendContactMessage } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [success, setSuccess] = useState(false);
  const { mutate: sendMessage, isPending } = useSendContactMessage({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    }
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormValues) => {
    sendMessage({ data });
  };

  return (
    <section id="contact" className="py-24 bg-card/20 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 text-foreground">
            <span className="text-accent">Ping</span>_Us
          </h2>
          <p className="text-muted-foreground">
            Have a question? Want to collaborate? Send a transmission to our servers.
          </p>
        </div>

        <div className="bg-card border border-border/50 p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden">
          {/* Decorative Corner lines */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 opacity-50 rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-secondary/50 opacity-50 rounded-br-2xl"></div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-mono font-bold text-foreground mb-2">Transmission Received</h3>
              <p className="text-muted-foreground">We've logged your message and will respond shortly.</p>
              <Button className="mt-8" variant="outline" onClick={() => setSuccess(false)}>Send Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">IDENTIFIER (Name)</Label>
                  <Input id="name" placeholder="John Doe" {...register("name")} />
                  {errors.name && <p className="text-destructive text-xs mt-1 font-mono">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">COMMS_LINK (Email)</Label>
                  <Input id="email" type="email" placeholder="john@university.edu" {...register("email")} />
                  {errors.email && <p className="text-destructive text-xs mt-1 font-mono">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="subject">THREAD_TOPIC (Subject)</Label>
                <Input id="subject" placeholder="Collaboration / Inquiry" {...register("subject")} />
                {errors.subject && <p className="text-destructive text-xs mt-1 font-mono">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">PAYLOAD (Message)</Label>
                <Textarea id="message" placeholder="Type your message here..." {...register("message")} />
                {errors.message && <p className="text-destructive text-xs mt-1 font-mono">{errors.message.message}</p>}
              </div>
              
              <Button type="submit" size="lg" className="w-full gap-2 font-mono text-lg" isLoading={isPending}>
                <Send size={18} /> EXECUTE_SEND
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
