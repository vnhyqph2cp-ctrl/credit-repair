import { createServerSupabase } from '@/lib/supabase-server';

const MOCK_PROJECTS = [
  { 
    id: 1, 
    bureau: "Equifax", 
    issue_type: "Late Payment", 
    status: "In Progress", 
    created_at: "2026-01-05",
    closed_at: null
  },
  { 
    id: 2, 
    bureau: "Experian", 
    issue_type: "Collection", 
    status: "Open", 
    created_at: "2026-01-03",
    closed_at: null
  },
  { 
    id: 3, 
    bureau: "TransUnion", 
    issue_type: "Charge-Off", 
    status: "Closed", 
    created_at: "2025-12-28",
    closed_at: "2026-01-04"
  },
  { 
    id: 4, 
    bureau: "Equifax", 
    issue_type: "Inquiry", 
    status: "Closed", 
    created_at: "2025-12-20",
    closed_at: "2025-12-30"
  },
  { 
    id: 5, 
    bureau: "Experian", 
    issue_type: "Late Payment", 
    status: "In Progress", 
    created_at: "2026-01-02",
    closed_at: null
  },
];

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const activeProjects = MOCK_PROJECTS.filter(p => p.status !== "Closed");
  const closedProjects = MOCK_PROJECTS.filter(p => p.status === "Closed");
  const inProgressProjects = MOCK_PROJECTS.filter(p => p.status === "In Progress");

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Open": return "bg-yellow-500/20 text-yellow-400 border-yellow-400";
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-400";
      case "Closed": return "bg-green-500/20 text-green-400 border-green-400";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold neon-text mb-2">
          Welcome Back, {session?.user?.email?.split('@')[0] || 'Member'}
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your credit enforcement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-yellow-400">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Active Projects</p>
          <p className="text-5xl font-bold neon-text">{activeProjects.length}</p>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-blue-400">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">In Progress</p>
          <p className="text-5xl font-bold text-blue-400">{inProgressProjects.length}</p>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-green-400">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Closed</p>
          <p className="text-5xl font-bold text-green-400">{closedProjects.length}</p>
        </div>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold neon-text mb-6">Active Projects</h2>
        
        {activeProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No active projects yet</p>
            <a 
              href="/dashboard/analyzer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold hover:scale-105 transition"
            >
              Run Analyzer
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {activeProjects.map(project => (
              <div 
                key={project.id}
                className="glass-card p-6 hover:border-cyan-400 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {project.bureau === "Equifax" && "🔴"}
                        {project.bureau === "Experian" && "🔵"}
                        {project.bureau === "TransUnion" && "🟢"}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold">
                          {project.bureau} – {project.issue_type}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Opened: {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full border font-medium text-sm ${getStatusColor(project.status)}`}>
                    {project.status === "In Progress" ? "🔵 In Progress" : "🟡 Open"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {closedProjects.length > 0 && (
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-green-400 mb-6">Recently Closed</h2>
          
          <div className="space-y-3">
            {closedProjects.map(project => (
              <div 
                key={project.id}
                className="glass-card p-4 border-l-4 border-green-400 opacity-75"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">
                      {project.bureau} – {project.issue_type}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Closed: {project.closed_at && new Date(project.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-green-400 font-bold">✅ Closed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
