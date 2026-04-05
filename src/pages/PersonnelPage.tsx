import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, X, Users, Briefcase, UserCheck } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["Administration", "Formateur", "Partenaire"];

export default function PersonnelPage() {
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff", filter],
    queryFn: async () => {
      let query = supabase.from("staff").select("*").order("full_name");
      if (filter) query = query.eq("role", filter);
      const { data } = await query;
      return data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Membre supprimé");
    },
  });

  const counts = {
    total: staff?.length ?? 0,
    admin: staff?.filter((s) => s.role === "Administration").length ?? 0,
    formateur: staff?.filter((s) => s.role === "Formateur").length ?? 0,
    partenaire: staff?.filter((s) => s.role === "Partenaire").length ?? 0,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.total, icon: Users, color: "bg-blue-500" },
          { label: "Administration", value: counts.admin, icon: Briefcase, color: "bg-green-500" },
          { label: "Formateurs", value: counts.formateur, icon: UserCheck, color: "bg-purple-500" },
          { label: "Partenaires", value: counts.partenaire, icon: Users, color: "bg-amber-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${s.color} p-2 rounded-lg`}><s.icon size={18} className="text-white" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border rounded-lg px-3 py-2 bg-background"
        >
          <option value="">Tout le personnel</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button
          onClick={() => { setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-estam-red text-white rounded-lg text-sm font-medium hover:opacity-90 ml-auto"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Nom</th>
                <th className="p-3 text-left font-medium">Rôle</th>
                <th className="p-3 text-left font-medium">Email</th>
                <th className="p-3 text-left font-medium">Tél</th>
                <th className="p-3 text-left font-medium">Statut</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Chargement...</td></tr>
              ) : (staff ?? []).length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun personnel</td></tr>
              ) : (
                (staff ?? []).map((s) => (
                  <tr key={s.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{s.full_name}</td>
                    <td className="p-3">{s.role}</td>
                    <td className="p-3">{s.email ?? "—"}</td>
                    <td className="p-3">{s.phone ?? "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "Actif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>{s.status}</span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => { setEditingId(s.id); setShowForm(true); }} className="p-1.5 hover:bg-muted rounded">
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(s.id); }}
                        className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {showForm && (
        <StaffFormModal
          editingId={editingId}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ["staff"] }); }}
        />
      )}
    </div>
  );
}

function StaffFormModal({ editingId, onClose, onSaved }: { editingId: string | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ full_name: "", role: "Formateur", email: "", phone: "", status: "Actif" });

  useQuery({
    queryKey: ["staff-edit", editingId],
    enabled: !!editingId,
    queryFn: async () => {
      const { data } = await supabase.from("staff").select("*").eq("id", editingId!).single();
      if (data) setForm({ full_name: data.full_name, role: data.role, email: data.email ?? "", phone: data.phone ?? "", status: data.status ?? "Actif" });
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name) { toast.error("Nom requis"); return; }

    const payload = { full_name: form.full_name, role: form.role, email: form.email || null, phone: form.phone || null, status: form.status };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("staff").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("staff").insert(payload));
    }
    if (error) toast.error("Erreur: " + error.message);
    else { toast.success(editingId ? "Modifié" : "Ajouté"); onSaved(); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">{editingId ? "Modifier" : "Ajouter"} un membre</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Nom complet *" className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Téléphone" className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
            <option>Actif</option>
            <option>Inactif</option>
          </select>
          <button type="submit" className="w-full py-2 bg-estam-red text-white rounded-lg text-sm font-medium hover:opacity-90">
            {editingId ? "Enregistrer" : "Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
}
