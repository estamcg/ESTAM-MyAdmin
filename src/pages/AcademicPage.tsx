import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Eye, Trash2, FileText, Plus, X } from "lucide-react";
import { toast } from "sonner";

type Tab = "filieres" | "planning" | "notes";

export default function AcademicPage() {
  const [tab, setTab] = useState<Tab>("filieres");
  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b pb-2">
        {[
          { key: "filieres" as Tab, label: "Filières & Programmes" },
          { key: "planning" as Tab, label: "Planning Académique" },
          { key: "notes" as Tab, label: "Notes & Bulletins" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "filieres" && <FilieresTab />}
      {tab === "planning" && <PlanningTab />}
      {tab === "notes" && <NotesTab />}
    </div>
  );
}

function FilieresTab() {
  const { data: programs } = useQuery({
    queryKey: ["academic-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("academic_programs").select("*").order("sector_name, program_name");
      return data ?? [];
    },
  });

  const sectors = [...new Set((programs ?? []).map((p) => p.sector_name))];

  return (
    <div className="space-y-4">
      {sectors.map((sector) => (
        <Card key={sector}>
          <CardHeader><CardTitle>{sector}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(programs ?? [])
                .filter((p) => p.sector_name === sector)
                .map((p) => (
                  <div key={p.id} className="p-3 border rounded-lg bg-muted/30">
                    <p className="font-medium text-sm">{p.program_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Acronyme: {p.acronym ?? "—"}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PlanningTab() {
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState({ secteur: "", niveau: "", filiere: "", type: "" });
  const queryClient = useQueryClient();

  const { data: resources } = useQuery({
    queryKey: ["academic-resources", filters],
    queryFn: async () => {
      let query = supabase.from("academic_resources").select("*").order("created_at", { ascending: false });
      if (filters.type) query = query.eq("type", filters.type);
      if (filters.filiere) query = query.eq("target_formation", filters.filiere);
      const { data } = await query;
      return data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("academic_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-resources"] });
      toast.success("Document supprimé");
    },
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const type = fd.get("type") as string;
    const target = fd.get("target_formation") as string;

    const { error } = await supabase.from("academic_resources").insert({
      title,
      type: type || "Emploi du temps",
      target_formation: target || null,
    });

    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success("Document ajouté");
      setShowUpload(false);
      queryClient.invalidateQueries({ queryKey: ["academic-resources"] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="text-sm border rounded-lg px-3 py-2 bg-background"
        >
          <option value="">Tous les types</option>
          <option value="Emploi du temps">Emploi du temps</option>
          <option value="Calendrier académique">Calendrier académique</option>
          <option value="Événement">Événement</option>
          <option value="Soutenance">Soutenance</option>
        </select>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-estam-red text-white rounded-lg text-sm font-medium hover:opacity-90 ml-auto"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Titre</th>
                <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-left font-medium">Filière</th>
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(resources ?? []).map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">{r.target_formation ?? "—"}</td>
                  <td className="p-3 text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString("fr") : "—"}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(r.id); }}
                      className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!resources || resources.length === 0) && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun planning</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Ajouter un Planning</h3>
              <button onClick={() => setShowUpload(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-3">
              <input name="title" required placeholder="Titre *" className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
              <select name="type" className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
                <option>Emploi du temps</option>
                <option>Calendrier académique</option>
                <option>Événement</option>
                <option>Soutenance</option>
              </select>
              <input name="target_formation" placeholder="Filière cible (optionnel)" className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
              <button type="submit" className="w-full py-2 bg-estam-red text-white rounded-lg text-sm font-medium hover:opacity-90">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NotesTab() {
  const { data: grades } = useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const { data } = await supabase.from("grades").select("*").order("academic_year", { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Notes enregistrées</CardTitle></CardHeader>
        <CardContent>
          {(grades ?? []).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune note enregistrée</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Matière</th>
                  <th className="p-3 text-left font-medium">Semestre</th>
                  <th className="p-3 text-left font-medium">Note</th>
                  <th className="p-3 text-left font-medium">Année</th>
                </tr>
              </thead>
              <tbody>
                {(grades ?? []).map((g) => (
                  <tr key={g.id} className="border-b">
                    <td className="p-3">{g.subject_name}</td>
                    <td className="p-3">{g.semester ?? "—"}</td>
                    <td className="p-3 font-mono">{g.grade_value ?? "—"}</td>
                    <td className="p-3">{g.academic_year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
