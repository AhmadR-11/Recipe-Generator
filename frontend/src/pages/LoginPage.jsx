import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChefHat, ArrowLeft, Mail, Zap, Sparkles, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { signInWithMagicLink, demoLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    if (countdown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithMagicLink(email);
      if (result.success) {
        setEmailSent(true);
      } else {
        if (result.message?.toLowerCase().includes("too many requests")) {
          setError(
            "You've requested too many login links. Please wait 30 seconds before trying again. This limit may apply per device or IP. For testing, try using a different browser, incognito window, or wait before trying again."
          );
          setCountdown(30);
        } else {
          setError(
            result.message || "Failed to send magic link. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error sending magic link:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const user = demoLogin(email || "demo@example.com");
    if (user) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/3 to-teal-500/3 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5 text-slate-400" />
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-8 w-8 text-emerald-400" />
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    AI Recipe Generator
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30">
                {emailSent ? (
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                ) : (
                  <Mail className="h-10 w-10 text-emerald-400" />
                )}
              </div>
              <Sparkles className="h-5 w-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {emailSent ? "Magic Link Sent! ✨" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            {emailSent
              ? `We've sent a secure login link to ${email}`
              : "Enter your email to receive a magic login link"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
              <AlertDescription>
                {error}
                {countdown > 0 && ` (${countdown}s)`}
              </AlertDescription>
            </Alert>
          )}

          {!emailSent ? (
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-200 flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email address</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="chef@kitchen.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 text-lg"
                    disabled={isLoading || countdown > 0}
                  />
                </div>

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                  disabled={isLoading || !email || countdown > 0}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending magic link...</span>
                    </div>
                  ) : countdown > 0 ? (
                    `Try again in ${countdown}s`
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Send Magic Link</span>
                    </div>
                  )}
                </Button>

                <div className="flex items-center space-x-2 text-sm text-slate-400 bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>We'll send you a secure login link. No password required!</span>
                </div>
              </div>

              {/* Demo Login Section */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600/50" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-slate-800 px-4 text-slate-400 font-medium">
                    Or try demo
                  </span>
                </div>
              </div>

              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 bg-transparent h-12 text-lg rounded-xl transition-all duration-300"
              >
                <Zap className="h-5 w-5 mr-2" />
                Quick Demo Access
              </Button>

              <p className="text-sm text-slate-400 text-center leading-relaxed">
                Skip the email step and try the app immediately
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Email Sent Successfully</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Click the secure link in your email to sign in. The link will expire in 15 minutes for your security.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent h-12 rounded-xl"
              >
                Use Different Email
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600/50" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-slate-800 px-4 text-slate-400">Or continue</span>
                </div>
              </div>

              <Button
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              >
                <Zap className="h-5 w-5 mr-2" />
                Continue with Demo
              </Button>

              <p className="text-sm text-slate-400 leading-relaxed">
                Didn't receive the email? Check your spam folder or use demo login to continue.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}