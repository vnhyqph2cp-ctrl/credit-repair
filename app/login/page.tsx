"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // IMPORTANT: full reload ensures cookies are set
    window.location.href = "/dashboard";
  }

  return (
    <main className="login-page">
      <div className="login-container">
        {/* Logo Header */}
        <div className="login-logo-section">
          <img 
            src="/brand/3B Credit Logo100x100 .png" 
            alt="3B Credit" 
            className="login-logo-img"
          />
          <div className="login-brand">
            <h1 className="login-brand-title">Credit Builder</h1>
            <p className="login-brand-subtitle">Powered by MFSN</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your dashboard</p>

          <div className="login-input-group">
            <label htmlFor="email" className="login-label">Email Address</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="Enter your email" 
              className="login-input"
              required 
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Enter your password" 
              className="login-input"
              required 
            />
          </div>

          <div className="login-actions">
            <Link href="/forgot-password" className="login-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button className="login-submit-btn" type="submit">
            <span>Sign In</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="login-divider">
            <span>New to 3B Credit?</span>
          </div>

          <Link href="/register" className="login-register-btn">
            Create Account
          </Link>

          <Link href="/" className="login-back-link">
            ← Back to Home
          </Link>
        </form>
      </div>
    </main>
  );
}

