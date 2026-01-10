// app/admin/page.tsx
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main>
      <div className="container col">

        <header className="col">
          <h1>Admin Portal</h1>
          <p>
            Internal system for managing clients, documents,
            and analysis approvals.
          </p>
        </header>

        <section className="surface card surface-purple col">
          <h2>Client Management</h2>
          <p>View and manage client progress.</p>

          <Link href="/admin/clients" className="btn">
            View Clients
          </Link>
        </section>

        <section className="surface card col">
          <h2>Document Review</h2>
          <p>Review uploaded documents and mark status.</p>

          <Link href="/admin/documents" className="btn">
            Review Documents
          </Link>
        </section>

        <section className="surface card col">
          <h2>Analyzer Controls</h2>
          <p>
            Approve AI suggestions and control what clients see.
          </p>

          <Link href="/admin/analyzer" className="btn">
            Analyzer Review
          </Link>
        </section>

        <footer className="footer">
          <small>
            Admin access only. Actions are logged internally.
          </small>
        </footer>

      </div>
    </main>
  );
}
