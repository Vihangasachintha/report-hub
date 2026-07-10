import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import api from "../api/axios";
import type { Project, TeamMember } from "../types";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<number>; // returns project id
  project?: Project | null;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  project,
}: ProjectFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(project);

  useEffect(() => {
    if (!isOpen) return;

    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    setError("");

    api
      .get<TeamMember[]>("/team-members")
      .then((res) => setTeamMembers(res.data));

    if (project) {
      api
        .get<TeamMember[]>(`/projects/${project.id}/members`)
        .then((res) => setSelectedIds(res.data.map((m) => m.id)));
    } else {
      setSelectedIds([]);
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const toggleMember = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const projectId = await onSave({ name, description });
      await api.post(`/projects/${projectId}/members`, {
        user_ids: selectedIds,
      });
      onClose();
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? (Object.values(errors).flat() as string[]).join(" ")
          : "Failed to save project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditMode ? "Edit Project" : "Create Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Client A"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional description"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assign Team Members
            </label>
            <div className="border border-slate-200 rounded-xl max-h-40 overflow-y-auto divide-y divide-slate-100">
              {teamMembers.length === 0 && (
                <p className="text-xs text-slate-400 p-3">No members found.</p>
              )}
              {teamMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-700">
                    {member.name}
                  </span>
                  <span className="text-slate-400">{member.email}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
