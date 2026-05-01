import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("login"); // login | magic | register
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Supabase Auth integration placeholder — for now, just navigate to dashboard
    setTimeout(() => {
      setLoading(false);
      if (mode === "magic") {
        setSent(true);
      } else {
        navigate("/");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-ae-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-slate-900 font-bold text-xl mx-auto mb-4">
            AE
          </div>
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-white">
            Audit<span className="text-brand">Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Enterprise Audit Automation Platform</p>
        </div>

        <Card className="border-ae-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">
              {mode === "login" ? "Sign in to your account" : mode === "magic" ? "Magic link sign in" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {mode === "login" ? "Enter your credentials to access your engagements" : mode === "magic" ? "We'll email you a secure sign-in link" : "Start your free trial — no credit card required"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-6">
                <Mail className="h-12 w-12 text-brand mx-auto mb-4" />
                <p className="text-sm text-white font-medium">Check your email</p>
                <p className="text-xs text-slate-400 mt-1">We sent a sign-in link to <span className="text-brand">{email}</span></p>
                <Button variant="ghost" size="sm" className="mt-4" onClick={() => { setSent(false); setMode("login"); }}>
                  Back to login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="partner@yourfirm.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {mode !== "magic" && (
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required={mode !== "magic"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "register" && (
                  <div className="space-y-2">
                    <Label>Firm Name</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input placeholder="Your Firm LLP" className="pl-10" />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Please wait..." : mode === "magic" ? "Send Magic Link" : mode === "register" ? "Create Account" : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>

                {mode === "login" && (
                  <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setMode("magic")}>
                    <Mail className="h-4 w-4" /> Sign in with Magic Link
                  </Button>
                )}
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="w-full border-t border-ae-border pt-3">
              {mode === "login" ? (
                <p className="text-xs text-slate-400 text-center">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} className="text-brand hover:underline cursor-pointer">Start free trial</button>
                </p>
              ) : (
                <p className="text-xs text-slate-400 text-center">
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-brand hover:underline cursor-pointer">Sign in</button>
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-[9px] gap-1">
                <Lock className="h-2.5 w-2.5" /> 256-bit encrypted
              </Badge>
              <Badge variant="secondary" className="text-[9px]">UK GDPR compliant</Badge>
              <Badge variant="secondary" className="text-[9px]">SOC 2 ready</Badge>
            </div>
          </CardFooter>
        </Card>

        <p className="text-[10px] text-slate-600 text-center mt-6">
          AuditEngine v10 &middot; Indus Nexus Limited &middot; auditengine.agency
        </p>
      </div>
    </div>
  );
}
