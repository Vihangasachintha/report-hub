import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  Users, 
  LogOut, 
  Plus, 
  Bell, 
  SlidersHorizontal,
  Calendar,
  ChevronDown,
  Palette,
  Globe,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react';

export default function MyReports() {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: false },
    { name: 'My Reports', icon: FileText, active: true },
    { name: 'Projects', icon: FolderKanban, active: false },
    { name: 'Team Reports', icon: Users, active: false },
  ];

  const statCards = [
    { title: 'SUBMITTED', value: '24', type: 'chart' },
    { title: 'PENDING', value: '02', type: 'ring' },
    { title: 'AVG. HOURS', value: '42.5', type: 'trend', trend: '+2.4h from last month' },
  ];

  const submissions = [
    { 
      range: 'Oct 23 - Oct 29', 
      year: '2023', 
      project: 'Limba App Design', 
      icon: Palette, 
      iconBg: 'bg-indigo-50 text-indigo-600',
      status: 'Draft', 
      statusColor: 'bg-slate-100 text-slate-600', 
      hours: '12.5',
      actions: 'edit'
    },
    { 
      range: 'Oct 16 - Oct 22', 
      year: '2023', 
      project: 'Jagli Web Portal', 
      icon: Globe, 
      iconBg: 'bg-indigo-50 text-indigo-600',
      status: 'Submitted', 
      statusColor: 'bg-orange-50 text-orange-700', 
      hours: '45.0',
      actions: 'view'
    },
    { 
      range: 'Oct 09 - Oct 15', 
      year: '2023', 
      project: 'Limba App Design', 
      icon: Palette, 
      iconBg: 'bg-indigo-50 text-indigo-600',
      status: 'Submitted', 
      statusColor: 'bg-orange-50 text-orange-700', 
      hours: '38.0',
      actions: 'view'
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800 antialiased">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo */}
          <div className="mb-10 pl-2">
            <span className="font-bold text-lg tracking-tight text-indigo-900">ReportGen.</span>
            <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Weekly Analytics</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
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
        <div className="pt-6 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header Bar */}
        <header className="h-24 bg-[#f8fafc] px-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Reports History</h1>
            <p className="text-xs text-slate-400 mt-0.5">View and manage your weekly performance submissions.</p>
          </div>
          
          {/* Right Header Blocks */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-150 rounded-full py-1.5 pl-2.5 pr-3 shadow-sm hover:cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="mansur.h"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-slate-700">mansur.h</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </div>
        </header>

        {/* Workspace Elements */}
        <main className="px-10 pb-10 space-y-6 overflow-y-auto max-w-[1240px] w-full">
          
          {/* High Level Stats Grid Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-800 tracking-tight mt-1">{card.value}</p>
                </div>

                {card.type === 'chart' && (
                  <div className="flex items-end gap-1.5 h-6 mt-3">
                    <div className="w-7 bg-orange-200/50 h-2 rounded-sm"></div>
                    <div className="w-7 bg-orange-300/60 h-3 rounded-sm"></div>
                    <div className="w-7 bg-orange-400/70 h-3.5 rounded-sm"></div>
                    <div className="w-7 bg-orange-800 h-5 rounded-sm"></div>
                  </div>
                )}

                {card.type === 'ring' && (
                  <div className="self-end -mt-8 mr-2">
                    <div className="w-7 h-7 rounded-full border-[3px] border-orange-500 border-t-slate-100 rotate-45"></div>
                  </div>
                )}

                {card.type === 'trend' && (
                  <p className="text-[11px] font-medium text-indigo-600 mt-2">{card.trend}</p>
                )}
              </div>
            ))}

            {/* Quick Action Button Box Component */}
            <button className="bg-orange-500 hover:bg-orange-600 active:scale-[0.99] rounded-2xl flex flex-col items-center justify-center text-white font-medium p-6 shadow-lg shadow-orange-500/10 transition-all min-h-[120px]">
              <div className="bg-white/20 p-2 rounded-xl mb-2">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold tracking-wide">Create New Report</span>
            </button>
          </div>

          {/* Table Container Section Block */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Submissions</h2>
              
              {/* Filter Group Pill Selectors */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  This Month
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Week Range</th>
                    <th className="pb-3 font-bold">Project Name</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Hours</th>
                    <th className="pb-3 font-bold text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs text-slate-700 font-medium">
                  {submissions.map((row, index) => {
                    const ProjectIcon = row.icon;
                    return (
                      <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                        {/* Week Range Column */}
                        <td className="py-4">
                          <span className="font-bold text-slate-800 block">{row.range}</span>
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">{row.year}</span>
                        </td>
                        {/* Project Name Column */}
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`${row.iconBg} p-2 rounded-lg`}>
                              <ProjectIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-slate-700">{row.project}</span>
                          </div>
                        </td>
                        {/* Status Tag Badge */}
                        <td className="py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        {/* Metrics Data Column */}
                        <td className="py-4 font-bold text-slate-800">{row.hours}</td>
                        {/* Inline Interactive Modifiers */}
                        <td className="py-4 text-right pr-4">
                          {row.actions === 'edit' ? (
                            <div className="inline-flex items-center gap-3 text-orange-700/80">
                              <button className="hover:text-orange-900 p-1 transition-colors"><Pencil className="w-4 h-4" /></button>
                              <button className="hover:text-red-700 p-1 transition-colors"><Trash2 className="w-4 h-4 text-red-500/80" /></button>
                            </div>
                          ) : (
                            <button className="text-indigo-600 hover:text-indigo-900 p-1 transition-colors inline-block">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* View All Toggle Segment */}
            <div className="text-center mt-6 pt-2 border-t border-slate-50">
              <button className="text-xs font-bold text-orange-800 hover:text-orange-900 hover:underline transition-all">
                View All History
              </button>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}