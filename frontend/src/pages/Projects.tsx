import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Box } from "lucide-react";
import api from "../api/axios";
import type { Project } from "../types";
import ProjectFormModal from "../components/ProjectFormModal";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const loadProjects = () => {
    setLoading(true);
    api
      .get<Project[]>("/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSave = async (data: {
    name: string;
    description: string;
  }): Promise<number> => {
    if (editingProject) {
      await api.put(`/projects/${editingProject.id}`, data);
      loadProjects();
      return editingProject.id;
    } else {
      const res = await api.post("/projects", data);
      loadProjects();
      return res.data.id;
    }
  };

  const handleDelete = async (project: Project) => {
    setDeleteError("");
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/projects/${project.id}`);
      loadProjects();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setDeleteError(
          `Cannot delete "${project.name}" — it has reports attached to it.`,
        );
      } else {
        setDeleteError("Failed to delete project.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Projects</h1>
      </header>

      <main className="p-8 space-y-6 overflow-y-auto max-w-300 w-full">
        {deleteError && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
            {deleteError}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Active Projects
            </h2>
            <button
              onClick={openCreateModal}
              className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[12px] text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">Project Name</th>
                  <th className="py-4 px-4 font-bold">Description</th>
                  <th className="py-4 px-4 font-bold text-center">Reports</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {!loading && projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-slate-400"
                    >
                      No projects yet — create your first one.
                    </td>
                  </tr>
                )}
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl shrink-0">
                          <Box className="w-4 h-4" />
                        </div>
                        <span className="text-[12px] text-slate-900 block ">
                          {project.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-slate-400 text-[12px]  max-w-50 truncate">
                      {project.description || "—"}
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 text-[12px] font-bold px-2 py-0.5 rounded-md">
                        {project.reports_count ?? 0}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          onClick={() => openEditModal(project)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <p className="text-xs text-slate-400 text-center">
            Loading projects…
          </p>
        )}
      </main>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  );
}
