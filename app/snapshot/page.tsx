export default function SnapshotPage() {
  return (
    <main className="container col">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src="/brand/3B Credit Logo100x100 .png" 
            alt="3B Credit" 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              boxShadow: '0 0 20px rgba(var(--glow-1), 0.6), 0 0 40px rgba(var(--glow-2), 0.4)',
              filter: 'drop-shadow(0 0 10px rgba(var(--glow-1), 0.8))'
            }}
          />
          <h1>Credit Snapshot - Free!</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <a 
            href="/login" 
            className="btn-tile btn-login"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Member Login
          </a>
          <a 
            href="/register" 
            className="btn-tile btn-register"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Join 3B Credit
          </a>
        </div>
      </div>

      <section className="surface card glow-soft col">
        <div className="mt-6 surface card no-glow" style={{ padding: 0 }}>
          <iframe
            src="https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default"
            className="w-full"
            style={{ height: 820, borderRadius: 12 }}
          />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-16">
        <div className="surface card col" style={{ 
          borderColor: 'rgba(var(--glow-2), 0.6)', 
          background: 'linear-gradient(135deg, rgba(var(--glow-2), 0.2) 0%, rgba(var(--glow-2), 0.08) 100%)',
          boxShadow: '0 0 30px rgba(var(--glow-2), 0.4), 0 0 60px rgba(var(--glow-2), 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          padding: '32px 24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h3 style={{ color: 'rgb(var(--glow-2))', fontSize: '20px', marginBottom: '12px' }}>Free Credit Scores</h3>
          <p className="text-muted" style={{ fontSize: '14px' }}>Get your basic 3-bureau scores - no platform access included.</p>
        </div>

        <div className="surface card col" style={{ 
          borderColor: 'rgba(255, 159, 64, 0.6)', 
          background: 'linear-gradient(135deg, rgba(255, 159, 64, 0.2) 0%, rgba(255, 159, 64, 0.08) 100%)',
          boxShadow: '0 0 30px rgba(255, 159, 64, 0.4), 0 0 60px rgba(255, 159, 64, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          padding: '32px 24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ color: 'rgb(255, 159, 64)', fontSize: '20px', marginBottom: '12px' }}>No Analyzer Access</h3>
          <p className="text-muted" style={{ fontSize: '14px' }}>Snapshots cannot use the AI Analyzer tool.</p>
        </div>

        <div className="surface card col" style={{ 
          borderColor: 'rgba(var(--glow-3), 0.6)', 
          background: 'linear-gradient(135deg, rgba(var(--glow-3), 0.2) 0%, rgba(var(--glow-3), 0.08) 100%)',
          boxShadow: '0 0 30px rgba(var(--glow-3), 0.4), 0 0 60px rgba(var(--glow-3), 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          padding: '32px 24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✗</div>
          <h3 style={{ color: 'rgb(var(--glow-3))', fontSize: '20px', marginBottom: '12px' }}>No Dispute Tools</h3>
          <p className="text-muted" style={{ fontSize: '14px' }}>Upgrade to membership for dispute center access.</p>
        </div>
      </section>
    </main>
  );
}
