import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  Bell, 
  HelpCircle,
  SlidersHorizontal,
  Download,
  AlertCircle,
  BellRing
} from 'lucide-react';

export default function Dashboard() {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: false },
    { name: 'My Reports', icon: FileText, active: false },
    { name: 'Projects', icon: FolderKanban, active: false },
    { name: 'Team Reports', icon: Users, active: true },
  ];

  const statCards = [
    { 
      title: 'TEAM MEMBERS', 
      value: '24', 
      badge: '+4 this month', 
      icon: Users, 
      iconBg: 'bg-indigo-50 text-indigo-600' 
    },
    { 
      title: 'REPORTS TODAY', 
      value: '18', 
      chart: true, 
      icon: FileText, 
      iconBg: 'bg-orange-50 text-orange-600' 
    },
    { 
      title: 'COMPLIANCE', 
      value: '75%', 
      progressRing: true, 
      icon: LayoutDashboard, 
      iconBg: 'bg-blue-50 text-blue-600' 
    },
    { 
      title: 'OPEN BLOCKERS', 
      value: '03', 
      badge: 'Critical', 
      badgeColor: 'text-red-600 bg-red-50',
      icon: AlertCircle, 
      iconBg: 'bg-red-50 text-red-600' 
    },
  ];

  const submissions = [
    { id: 'JC', name: 'Jel Chibuzo', project: 'Limba App', week: 'Week 42', status: 'SUBMITTED', statusColor: 'bg-emerald-50 text-emerald-700', action: 'Review →', isNudge: false },
    { id: 'EB', name: 'Emlen Beaver', project: 'Jagli Web', week: 'Week 42', status: 'DRAFT', statusColor: 'bg-amber-100/70 text-amber-700', action: 'Nudge', isNudge: true },
    { id: 'JH', name: 'Jaquon Hart', project: 'Mekt Core', week: 'Week 41', status: 'LATE', statusColor: 'bg-rose-50 text-rose-600', action: 'Review →', isNudge: false },
    { id: 'SK', name: 'Sarah Kane', project: 'Nexus Portal', week: 'Week 42', status: 'SUBMITTED', statusColor: 'bg-emerald-50 text-emerald-700', action: 'Review →', isNudge: false },
  ];

  const workloads = [
    { name: 'Limba App', capacity: '85% Capacity', barColor: 'bg-orange-500', width: 'w-[85%]' },
    { name: 'Jagli Web', capacity: '42% Capacity', barColor: 'bg-indigo-600', width: 'w-[42%]' },
    { name: 'Mekt Core', capacity: '92% Capacity', barColor: 'bg-red-700', width: 'w-[92%]' },
    { name: 'Nexus Portal', capacity: '15% Capacity', barColor: 'bg-blue-600', width: 'w-[15%]' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800 antialiased">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-600 text-white font-bold rounded-lg w-9 h-9 flex items-center justify-center text-sm tracking-tight">
              RG
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-indigo-900">ReportGen</span>
              <p className="text-[11px] text-slate-400 font-medium -mt-1">Manager Workspace</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-10 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    item.active
                      ? 'bg-orange-50 text-orange-800 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? 'text-orange-600' : 'text-slate-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-4">
          <button className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-xs font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-all">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Generate New Report</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-amber-900 tracking-tight">Team Reports</h1>
          
          {/* Global Controls */}
          <div className="flex items-center gap-6">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search team members..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>

            {/* Notification & Help Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-slate-600 transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="hover:text-slate-600 transition-colors"><HelpCircle className="w-5 h-5" /></button>
            </div>

            {/* Profile Block */}
            <div className="flex items-center gap-2.5 border-l border-slate-100 pl-4">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
                alt="Mansur H."
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">Mansur H.</p>
                <p className="text-[10px] text-slate-400 font-medium">Lead Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Main Workspace Container */}
        <main className="p-8 space-y-6 overflow-y-auto max-w-[1200px] w-full">
          
          {/* Top Row: Analytical Insight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <div className="flex justify-between items-start">
                    <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    {/* Unique components per card to match visual reference */}
                    {card.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor || 'bg-slate-100 text-slate-500'}`}>
                        {card.badge}
                      </span>
                    )}
                    {card.chart && (
                      <div className="flex items-end gap-0.5 h-6 pt-2">
                        <div className="w-1 bg-orange-200 h-2 rounded-t-sm"></div>
                        <div className="w-1 bg-orange-400 h-4 rounded-t-sm"></div>
                        <div className="w-1 bg-orange-500 h-5 rounded-t-sm"></div>
                      </div>
                    )}
                    {card.progressRing && (
                      <div className="w-6 h-6 rounded-full border-4 border-orange-500 border-t-slate-100 rotate-45"></div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Grid: Team Submissions & Project Capacity Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Box: Recent Submissions Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Team Submissions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Review and approve weekly team analytics</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filter
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-800 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Data Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-bold">Name</th>
                      <th className="pb-3 font-bold">Project</th>
                      <th className="pb-3 font-bold">Week</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-700 font-medium">
                    {submissions.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        {/* Name Block */}
                        <td className="py-3.5 flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                            index === 0 ? 'bg-indigo-400' : index === 1 ? 'bg-orange-700' : index === 2 ? 'bg-indigo-800' : 'bg-blue-800'
                          }`}>
                            {row.id}
                          </div>
                          <span className="font-semibold text-slate-800">{row.name}</span>
                        </td>
                        {/* Project */}
                        <td className="py-3.5 text-slate-500 font-normal">{row.project}</td>
                        {/* Week */}
                        <td className="py-3.5 text-slate-500 font-normal">{row.week}</td>
                        {/* Status Tag */}
                        <td className="py-3.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        {/* Action Column */}
                        <td className="py-3.5 text-right">
                          {row.isNudge ? (
                            <button className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[11px] font-medium transition-all">
                              <span>{row.action}</span>
                              <BellRing className="w-3 h-3 text-slate-400" />
                            </button>
                          ) : (
                            <button className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all text-[11px]">
                              {row.action}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Box: Workload Capacity Panel */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">Workload by Project</h2>
              <div className="space-y-4">
                {workloads.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="text-[10px] font-medium text-slate-400">{item.capacity}</span>
                    </div>
                    {/* Linear Progress Container */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.barColor} ${item.width}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

    </div>
  );
}