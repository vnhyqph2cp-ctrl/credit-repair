import { createServerClient } from '@/lib/supabase-server';

export default async function ProfilePage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const stats = {
    projectsCreated: 5,
    projectsClosed: 3,
    activeProjects: 2,
    memberSince: "Dec 2025"
  };
  
  const badges = [
    { id: 1, title: "First Dispute Filed", icon: "🏅", earned: true },
    { id: 2, title: "3 Projects Closed", icon: "✅", earned: true },
    { id: 3, title: "Enforcement Active", icon: "⚡", earned: true },
    { id: 4, title: "30-Day Violation Triggered", icon: "⚠️", earned: false },
  ];
  
  return (
    <div className="p-6 space-y-8">
      
      <h1 className="text-4xl font-bold neon-text">Your Profile</h1>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-6">Your Impact</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-400/30">
            <p className="text-5xl font-bold neon-text mb-2">{stats.projectsCreated}</p>
            <p className="text-sm text-gray-400">Projects Created</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-400/30">
            <p className="text-5xl font-bold text-green-400 mb-2">{stats.projectsClosed}</p>
            <p className="text-sm text-gray-400">Projects Closed</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-400/30">
            <p className="text-5xl font-bold text-purple-400 mb-2">{stats.activeProjects}</p>
            <p className="text-sm text-gray-400">Active Projects</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-400/30">
            <p className="text-2xl font-bold text-yellow-400 mb-2">{stats.memberSince}</p>
            <p className="text-sm text-gray-400">Member Since</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className={`p-6 rounded-lg border-2 transition ${
                badge.earned 
                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400' 
                  : 'bg-gray-800/30 border-gray-700 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{badge.icon}</span>
                <div>
                  <h3 className={`font-bold text-lg ${badge.earned ? 'text-cyan-400' : 'text-gray-500'}`}>
                    {badge.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {badge.earned ? 'Earned' : 'Locked'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold mb-3">Account Information</h3>
        <p className="text-gray-400">Email: {session?.user?.email}</p>
        <p className="text-gray-400">Member Since: {stats.memberSince}</p>
      </div>

    </div>
  );
}
