import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Users,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  name: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const managerNavItems: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Projects", icon: FolderKanban, path: "/projects" },
  { name: "Team Reports", icon: FileText, path: "/my-reports" },
];

const memberNavItems: NavItem[] = [
  { name: "My Reports", icon: FileText, path: "/my-reports" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === "manager" ? managerNavItems : memberNavItems;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
      <div>
        <div className="mb-10 pl-2">
          <span className="font-bold text-lg tracking-tight text-indigo-900">
            ReportHub.
          </span>
          <p className="text-[11px] text-slate-400 font-medium -mt-0.5">
            Weekly Analytics
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-orange-50 text-orange-800 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-orange-600" : "text-slate-400"
                      }`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-100">
        {user && (
          <div className="px-4 pb-3 text-xs">
            <p className="font-semibold text-slate-700">{user.name}</p>
            <p className="text-slate-400 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4 text-red-400 hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
