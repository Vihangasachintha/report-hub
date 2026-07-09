import { 
  Search, 
  Bell, 
  HelpCircle,
  PlusCircle,
  Box,
  ShoppingCart,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Projects() {

  const projects = [
    {
      name: 'Alpha Design System',
      priority: 'HIGH',
      priorityColor: 'text-amber-700',
      description: 'Global component library for',
      reports: 124,
      creator: 'Jel Chibuzo',
      avatarInitials: 'JC',
      icon: Box,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      name: 'E-Commerce Flow',
      priority: 'MEDIUM',
      priorityColor: 'text-slate-500',
      description: 'User journey mapping for...',
      reports: 45,
      creator: 'Emlen Beaver',
      avatarInitials: 'EB',
      icon: ShoppingCart,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      name: 'Security Audit 2024',
      priority: 'CRITICAL',
      priorityColor: 'text-red-600',
      description: 'Quarterly vulnerability...',
      reports: 82,
      creator: 'Jaquon Hart',
      avatarInitials: 'JH',
      icon: ShieldAlert,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800 antialiased">
      
      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-amber-900 tracking-tight">Projects</h1>
            <p className="text-[11px] text-slate-400 font-medium">Oversee and manage active project workflows</p>
          </div>
          
          {/* Global Controls */}
          <div className="flex items-center gap-6">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-slate-200 transition-all"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-slate-600 transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="hover:text-slate-600 transition-colors"><HelpCircle className="w-5 h-5" /></button>
            </div>

            {/* Profile Block */}
            <div className="flex items-center gap-2.5 border-l border-slate-100 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">Mansur.H</p>
                <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Project Lead</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
                alt="Mansur.H"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Space */}
        <main className="p-8 space-y-6 overflow-y-auto max-w-300 w-full">
          
          {/* Overview Callout Box */}
          <div className="bg-[#fffcf9] rounded-3xl border border-orange-100/50 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-md">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Project Overview</h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  You have 5 active projects this week. Most reports are focused on 'Alpha Design' and 'Core Engine'.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  12 New Reports
                </span>
                <span className="text-[11px] font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  3 Pending Edits
                </span>
              </div>
            </div>

            {/* Visual Bar Graph */}
            <div className="flex items-end gap-2.5 h-24 px-4">
              <div className="w-5 bg-orange-500 h-[65%] rounded-t-md"></div>
              <div className="w-5 bg-indigo-400 h-[85%] rounded-t-md"></div>
              <div className="w-5 bg-orange-600 h-[40%] rounded-t-md"></div>
              <div className="w-5 bg-indigo-300 h-full rounded-t-md"></div>
              <div className="w-5 bg-orange-500 h-[75%] rounded-t-md"></div>
            </div>
          </div>

          {/* Table Element Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Projects</h2>
              <button className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
                <PlusCircle className="w-4 h-4" />
                <span>Create Project</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold">Project Name</th>
                    <th className="py-4 px-4 font-bold">Description</th>
                    <th className="py-4 px-4 font-bold text-center">Reports</th>
                    <th className="py-4 px-4 font-bold">Created By</th>
                    <th className="py-4 px-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {projects.map((row, index) => {
                    const ProjectIcon = row.icon;
                    return (
                      <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                        {/* Title Context */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`${row.iconBg} p-2.5 rounded-xl shrink-0`}>
                              <ProjectIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{row.name}</span>
                              <span className={`text-[9px] font-extrabold mt-0.5 tracking-wide block ${row.priorityColor}`}>
                                PRIORITY: {row.priority}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description Summary */}
                        <td className="py-5 px-4 text-slate-400 font-normal max-w-50 truncate">
                          {row.description}
                        </td>

                        {/* Numeric Badge Indicator */}
                        <td className="py-5 px-4 text-center">
                          <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {row.reports}
                          </span>
                        </td>

                        {/* Account Owner Avatar block */}
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-bold border border-slate-200">
                              {row.avatarInitials}
                            </div>
                            <span className="text-slate-600 font-semibold">{row.creator}</span>
                          </div>
                        </td>

                        {/* Empty Action Alignment Container */}
                        <td className="py-5 px-6 text-right"></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer block */}
            <div className="p-4 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Showing 3 of 12 Projects</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-600 font-bold text-white shadow-sm">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  3
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}