"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 💡 Mobile Fail-Fast State: If a session check takes too long, we bypass the block
  const [forceShowForm, setForceShowForm] = useState(false);

  const {
    loginWithPassword,
    loginWithGoogle,
    user,
    loading: authLoading,
  } = useAuth();

  const router = useRouter();
  const isDisabled = loading || googleLoading;

  useEffect(() => {
    setMounted(true);

    // 💡 Mobile Performance Optimization:
    // If the auth hook doesn't confirm a valid session within 400ms,
    // immediately show the form anyway so mobile users aren't trapped on a spinner.
    const timer = setTimeout(() => {
      setForceShowForm(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Redirect authenticated users cleanly
  useEffect(() => {
    if (mounted && !authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, mounted, router]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Please fill in all required fields");
        return;
      }

      setLoading(true);
      await loginWithPassword(email, password);
      toast.success("Welcome back!");
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      setGoogleLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Welcome!");
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // 💡 Optimized Mobile Check: Show the form if forceShowForm hits true OR if auth explicitly finishes
  const isVerifyingSession = !mounted || (authLoading && !user && !forceShowForm);

  if (isVerifyingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4 gap-3">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
          Checking existing sessions...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] px-4 py-8 sm:px-6">
      <div className="absolute top-[-20%] left-[-10%] w-[260px] h-[260px] sm:w-[500px] sm:h-[500px] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] rounded-full bg-purple-200/30 blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/20 mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Student Copilot
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-wide mt-0.5">
            AI Study Assistant
          </p>
        </div>

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Welcome back</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled={isDisabled}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isDisabled && handleLogin()}
                  placeholder="name@university.edu"
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isDisabled}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isDisabled && handleLogin()}
                  placeholder="••••••••"
                  className="text-black w-full pl-10 pr-10 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition disabled:pointer-events-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isDisabled}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm py-2.5 rounded-xl transition shadow-sm mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="relative flex justify-center w-full max-w-sm mx-auto overflow-hidden rounded-full min-h-[44px]">
              {googleLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-slate-50 border border-gray-200 rounded-full cursor-not-allowed select-none animate-in fade-in duration-100">
                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                  <span className="text-xs font-semibold text-gray-500">
                    Connecting Google...
                  </span>
                </div>
              )}

              <div className={isDisabled ? "pointer-events-none opacity-50" : "w-full flex justify-center"}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="pill"
                  width="350"
                // 💡 Hint: set size to 'medium' programmatically on smaller break-points if the button clip drops
                />
              </div>
            </div>
          </div>

          <p className="text-center text-xs font-medium text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className={isDisabled ? "text-gray-400 pointer-events-none" : "text-blue-600 font-bold hover:underline"}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}