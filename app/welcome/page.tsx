// app/welcome/page.tsx
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main>
      <div className="container col">

        <section className="surface card surface-teal glow-soft under-glow col">
          <h1>Welcome to 3B Credit Builder</h1>
          <p>
            This platform helps you understand, organize, and improve your
            credit using clear steps — not guesswork.
          </p>

          <ul>
            <li>✔ Review your credit snapshot</li>
            <li>✔ Understand what matters most</li>
            <li>✔ Follow a personalized action plan</li>
          </ul>

          <Link href="/dashboard" className="btn glow-neon">
            Go to Dashboard
          </Link>
        </section>

      </div>
    </main>
  );
}
