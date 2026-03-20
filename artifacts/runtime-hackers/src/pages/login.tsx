import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button, Input, Label, Card } from "@/components/ui/core";
import { TerminalSquare, User, Shield, ArrowLeft } from "lucide-react";
import { useLogin } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCurrentUserQueryKey } from "@workspace/api-client-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [errorMsg, setErrorMsg] = useState("");
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    setTimeout(() => setLocation(isAdmin ? "/admin" : "/"), 0);
  }

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: () => {
        // Invalidate user query to fetch fresh auth state
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        setLocation(role === "admin" ? "/admin" : "/");
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.error || "Login failed. Invalid credentials.");
      }
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg("");
    loginMutation.mutate({
      data: { ...data, role }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 font-mono transition-colors z-20">
        <ArrowLeft size={16} /> RETURN_TO_BASE
      </Link>

      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-2xl border-border z-10 relative shadow-2xl shadow-primary/5">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 border border-border shadow-inner">
            <TerminalSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-mono font-bold text-center">SYSTEM_AUTH</h1>
          <p className="text-muted-foreground text-sm mt-2">Identify yourself to proceed.</p>
        </div>

        {/* Custom Role Tabs */}
        <div className="flex p-1 bg-muted rounded-lg mb-8 border border-border">
          <button
            type="button"
            className={`flex-1 py-2 font-mono text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${role === "student" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => { setRole("student"); setErrorMsg(""); }}
          >
            <User size={16} /> STUDENT
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-mono text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${role === "admin" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => { setRole("admin"); setErrorMsg(""); }}
          >
            <Shield size={16} /> ADMIN
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="username">IDENTIFIER (Username)</Label>
            <Input id="username" {...register("username")} autoFocus />
            {errors.username && <p className="text-destructive text-xs mt-1 font-mono">{errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">ACCESS_CODE (Password)</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-destructive text-xs mt-1 font-mono">{errors.password.message}</p>}
          </div>

          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm font-mono rounded-md">
              ERROR: {errorMsg}
            </div>
          )}

          <Button type="submit" variant="neon" className="w-full font-mono text-lg mt-4 h-12" isLoading={loginMutation.isPending}>
            {role === "admin" ? "ELEVATE_PRIVILEGES" : "AUTHENTICATE"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
