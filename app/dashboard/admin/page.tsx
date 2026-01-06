import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check admin role
  const { data: profile } = await supabase
    .from("Customer")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  // Fetch recent users
  const { data: users } = await supabase
    .from("Customer")
    .select("id, email, role, resellerId, createdAt")
    .order("createdAt", { ascending: false })
    .limit(50);

  // Get user counts by role
  const totalUsers = users?.length || 0;
  const resellers = users?.filter((u) => u.role === "reseller").length || 0;
  const clients = users?.filter((u) => u.resellerId).length || 0;

  // Get recent snapshots
  const { data: snapshots } = await supabase
    .from("Snapshot")
    .select("id, customerId, status, createdAt, scoreTu, scoreEq, scoreEx")
    .order("createdAt", { ascending: false })
    .limit(20);

  return (
    <main className="container col">
      <header className="col">
        <h1>Admin Dashboard</h1>
        <p>Global control center for ops and oversight</p>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="surface card glow-soft col stat-card">
          <small className="text-muted">Total Users</small>
          <h2>{totalUsers}</h2>
        </div>
        <div className="surface card glow-soft col stat-card">
          <small className="text-muted">Resellers</small>
          <h2>{resellers}</h2>
        </div>
        <div className="surface card glow-soft col stat-card">
          <small className="text-muted">Referred Clients</small>
          <h2>{clients}</h2>
        </div>
        <div className="surface card glow-soft col stat-card">
          <small className="text-muted">Epic Reports</small>
          <h2>{snapshots?.length || 0}</h2>
        </div>
      </section>

      {/* Recent Users */}
      <section className="surface card col">
        <div className="section-header">
          <h2>Recent Users</h2>
          <small className="text-muted">Last 50 signups</small>
        </div>
        <div className="col" style={{ gap: 8 }}>
          {users?.map((u) => (
            <div key={u.id} className="surface-blue card user-item">
              <div className="col" style={{ gap: 4 }}>
                <strong>{u.email}</strong>
                <small className="text-muted">
                  {new Date(u.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="row" style={{ gap: 8, alignItems: "center" }}>
                {u.role === "reseller" && <span className="badge-required">Reseller</span>}
                {u.role === "admin" && <span className="badge-required badge-admin">Admin</span>}
                {u.resellerId && <small className="text-muted">Referred</small>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Tools */}
      <section className="surface card col">
        <h2>Admin Tools</h2>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <Link href="/dashboard/admin/analyzer-rules" className="btn glow-soft">
            Analyzer Rules
          </Link>
          <Link href="/dashboard/admin/effectiveness" className="btn glow-soft">
            Effectiveness Tracking
          </Link>
          <Link href="/dashboard/admin/import" className="btn glow-soft">
            Import Data
          </Link>
        </div>
      </section>
    </main>
  );
}
