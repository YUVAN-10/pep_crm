import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PepLogo } from '../../assets/logo/PepLogo';
import Input from '../../components/forms/Input';
import Checkbox from '../../components/forms/Checkbox';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Mail, Lock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@pepsoftwares.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { showSuccess } = useNotifications();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    showSuccess('Welcome back, Admin!');
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    showSuccess('Signed in with Google workspace account.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 font-sans">
      {/* Left Side: Brand Visual with Floating Glowing Elements */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-[#35135F] via-[#2A0F4D] to-[#120524] text-white">
        {/* Abstract Glowing Mesh / Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-purple-600/30 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] right-[15%] w-64 h-64 rounded-full bg-fuchsia-500/15 blur-2xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <PepLogo size={42} showText={true} variant="light" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Enterprise v2.4
          </span>
        </div>

        {/* Middle Hero Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 my-auto py-12 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
            Software Agency SaaS Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-heading leading-tight tracking-tight text-white">
            Manage your software business <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">beautifully</span>.
          </h1>

          <p className="mt-4 text-purple-200/80 text-base leading-relaxed">
            Unified clients, pipeline tracking, sprint tasks, invoice billing, and real-time agency analytics crafted for high-performance engineering teams.
          </p>

          {/* Social Proof / Stats Badge */}
          <div className="mt-8 pt-8 border-t border-purple-500/20 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-white font-heading">₹84.5L</p>
              <p className="text-xs text-purple-200/70">Monthly Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-heading">34+</p>
              <p className="text-xs text-purple-200/70">Active Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-heading">99.8%</p>
              <p className="text-xs text-purple-200/70">SLA Delivery</p>
            </div>
          </div>
        </motion.div>

        {/* Left Bottom Security Note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-purple-300/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SOC-2 Type II Certified & End-to-End Encrypted Cloud CRM</span>
        </div>
      </div>

      {/* Right Side: Glass Login Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-900/50 backdrop-blur-lg relative">
        {/* Glowing aura behind form */}
        <div className="absolute w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-[26px] p-8 sm:p-10 shadow-2xl border border-slate-100 relative z-10"
        >
          {/* Card Header */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Sign In to PEP CRM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your corporate credentials to access the workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="Corporate Email Address"
              type="email"
              icon={Mail}
              placeholder="name@pepsoftwares.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Remember me for 30 days"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link will be sent to your work email.');
                }}
                className="text-xs font-semibold text-brand-primary hover:text-brand-deep hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                variant="orange"
                size="lg"
                fullWidth
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Sign In to Workspace
              </PrimaryButton>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold uppercase text-slate-400 absolute">
              or continue with
            </span>
          </div>

          {/* Google Sign In Placeholder */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[14px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google Workspace</span>
          </button>

          {/* Card Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            © PEP Software 2026. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
