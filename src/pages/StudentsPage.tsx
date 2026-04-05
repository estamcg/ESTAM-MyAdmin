import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Upload, Download, Trash2, Edit, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { formatCFA } from "@/lib/utils";

const LEVELS = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: programs } = useQuery({
    queryKey: ["academic-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("academic_programs").select("*").order("program_name");
      return data ?? [];
    },
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ["students", search],
    queryFn: async () => {
      let query = supabase
        .from("students")
        .select("*, academic_programs(program_name, acronym, sector_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (search) {
        query = query.or(`last_name.ilike.%${search}%,first_name.ilike.%${search}%,registration_number.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Étudiant supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => { setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-estam-red text-white rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Inscrire
        </button>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Matricule</th>
                  <th className="text-left p-3 font-medium">Nom & Prénom</th>
                  <th className="text-left p-3 font-medium">Filière</th>
                  <th className="text-left p-3 font-medium">Niveau</th>
                  <th className="text-left p-3 font-medium">Tél</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Chargement...</td></tr>
                ) : (students ?? []).length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Aucun étudiant trouvé</td></tr>
                ) : (
                  (students ?? []).map((s: any) => (
                    <tr key={s.id} className="border-b hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedStudent(s)}>
                      <td className="p-3 font-mono text-xs">{s.registration_number ?? "—"}</td>
                      <td className="p-3 font-medium">{s.last_name} {s.first_name}</td>
                      <td className="p-3">{s.academic_programs?.program_name ?? s.chosen_formation ?? "—"}</td>
                      <td className="p-3">{s.current_level ?? "—"}</td>
                      <td className="p-3">{s.phone_1 ?? "—"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "Admis" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {s.status ?? "En attente"}
                        </span>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditingId(s.id); setShowForm(true); }}
                          className="p-1.5 hover:bg-muted rounded"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Supprimer cet étudiant ?")) deleteMutation.mutate(s.id);
                          }}
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
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Panel */}
      {selectedStudent && (
        <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <StudentFormModal
          programs={programs ?? []}
          editingId={editingId}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["students"] });
          }}
        />
      )}
    </div>
  );
}

function StudentDetailPanel({ student, onClose }: { student: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-lg bg-card h-full overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Fiche Étudiant</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="space-y-4 text-sm">
          <Field label="Matricule" value={student.registration_number} />
          <Field label="Nom" value={student.last_name} />
          <Field label="Prénom" value={student.first_name} />
          <Field label="Date de naissance" value={student.birth_date || student.date_of_birth} />
          <Field label="Lieu de naissance" value={student.birth_place || student.place_of_birth} />
          <Field label="Nationalité" value={student.nationality} />
          <Field label="Ville" value={student.city} />
          <Field label="Arrondissement" value={student.arrondissement} />
          <Field label="Quartier" value={student.quartier} />
          <Field label="Tél 1" value={student.phone_1} />
          <Field label="Tél 2" value={student.phone_2} />
          <Field label="WhatsApp" value={student.whatsapp} />
          <Field label="Email" value={student.email} />
          <hr />
          <Field label="Tuteur" value={student.guardian_name} />
          <Field label="Profession tuteur" value={student.guardian_profession} />
          <Field label="Tél tuteur 1" value={student.guardian_phone_1} />
          <Field label="Tél tuteur 2" value={student.guardian_phone_2} />
          <hr />
          <Field label="Filière" value={student.chosen_formation || student.academic_programs?.program_name} />
          <Field label="Niveau" value={student.current_level} />
          <Field label="Secteur" value={student.sector_type} />
          <Field label="Dernier diplôme" value={student.last_degree_obtained} />
          <Field label="Statut" value={student.status} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value || "—"}</span>
    </div>
  );
}

function StudentFormModal({ programs, editingId, onClose, onSaved }: {
  programs: any[]; editingId: string | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    last_name: "", first_name: "", phone_1: "", email: "",
    birth_date: "", birth_place: "", nationality: "Congolaise",
    city: "" as string, arrondissement: "", quartier: "", adresse_precision: "",
    guardian_name: "", guardian_profession: "", guardian_phone_1: "", guardian_phone_2: "",
    program_id: "", current_level: "Licence 1", sector_type: "",
    last_degree_obtained: "", gender: "",
  });

  const isEditing = editingId !== null;

  // Load student data if editing
  useQuery({
    queryKey: ["student-edit", editingId],
    enabled: !!editingId,
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*").eq("id", editingId!).single();
      if (data) {
        setForm({
          last_name: data.last_name ?? "",
          first_name: data.first_name ?? "",
          phone_1: data.phone_1 ?? "",
          email: data.email ?? "",
          birth_date: data.birth_date ?? data.date_of_birth ?? "",
          birth_place: data.birth_place ?? data.place_of_birth ?? "",
          nationality: data.nationality ?? "Congolaise",
          city: data.city ?? "",
          arrondissement: data.arrondissement ?? "",
          quartier: data.quartier ?? "",
          adresse_precision: data.adresse_precision ?? "",
          guardian_name: data.guardian_name ?? "",
          guardian_profession: data.guardian_profession ?? "",
          guardian_phone_1: data.guardian_phone_1 ?? "",
          guardian_phone_2: data.guardian_phone_2 ?? "",
          program_id: data.program_id?.toString() ?? "",
          current_level: data.current_level ?? "Licence 1",
          sector_type: data.sector_type ?? "",
          last_degree_obtained: data.last_degree_obtained ?? "",
          gender: data.gender ?? "",
        });
      }
      return data;
    },
  });

  const BZV_ARRONDISSEMENTS = [
    "1er - Makélékélé", "2e - Bacongo", "3e - Poto-Poto", "4e - Moungali",
    "5e - Ouenzé", "6e - Talangaï", "7e - Mfilou", "8e - Madibou", "9e - Djiri"
  ];
  const PNR_ARRONDISSEMENTS = [
    "1er - Lumumba", "2e - Mvou-Mvou", "3e - Tié-Tié", "4e - Loandjili",
    "5e - Mongo-Mpoukou", "6e - Ngoyo"
  ];
  const arrondissements = form.city === "Brazzaville" ? BZV_ARRONDISSEMENTS : form.city === "Pointe-Noire" ? PNR_ARRONDISSEMENTS : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.last_name || !form.first_name || !form.phone_1) {
      toast.error("Nom, prénom et téléphone sont requis");
      return;
    }

    const selectedProgram = programs.find((p) => p.id.toString() === form.program_id);
    const payload = {
      last_name: form.last_name.toUpperCase(),
      first_name: form.first_name,
      phone_1: form.phone_1,
      email: form.email || null,
      birth_date: form.birth_date || null,
      birth_place: form.birth_place || null,
      nationality: form.nationality,
      city: form.city || null,
      arrondissement: form.arrondissement || null,
      quartier: form.quartier || null,
      adresse_precision: form.adresse_precision || null,
      guardian_name: form.guardian_name || null,
      guardian_profession: form.guardian_profession || null,
      guardian_phone_1: form.guardian_phone_1 || null,
      guardian_phone_2: form.guardian_phone_2 || null,
      program_id: form.program_id ? parseInt(form.program_id) : null,
      current_level: form.current_level,
      sector_type: selectedProgram?.sector_name ?? form.sector_type ?? null,
      chosen_formation: selectedProgram?.program_name ?? null,
      last_degree_obtained: form.last_degree_obtained || null,
      gender: form.gender || null,
      status: "Admis",
      registration_status: "Validé",
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from("students").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("students").insert(payload));
    }

    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success(isEditing ? "Étudiant modifié" : "Étudiant inscrit avec succès");
      onSaved();
    }
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold">{isEditing ? "Modifier l'étudiant" : "Nouvelle Inscription"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Identity */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground uppercase mb-2">Identité</legend>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nom *" value={form.last_name} onChange={(v) => set("last_name", v)} />
              <Input label="Prénom *" value={form.first_name} onChange={(v) => set("first_name", v)} />
              <Input label="Date de naissance" type="date" value={form.birth_date} onChange={(v) => set("birth_date", v)} />
              <Input label="Lieu de naissance" value={form.birth_place} onChange={(v) => set("birth_place", v)} />
              <Select label="Sexe" value={form.gender} onChange={(v) => set("gender", v)} options={[
                { value: "", label: "—" }, { value: "M", label: "Masculin" }, { value: "F", label: "Féminin" }
              ]} />
              <Input label="Nationalité" value={form.nationality} onChange={(v) => set("nationality", v)} />
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground uppercase mb-2">Contact</legend>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Téléphone 1 *" value={form.phone_1} onChange={(v) => set("phone_1", v)} />
              <Input label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} />
            </div>
          </fieldset>

          {/* Location */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground uppercase mb-2">Localisation</legend>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Ville" value={form.city} onChange={(v) => { set("city", v); set("arrondissement", ""); }} options={[
                { value: "", label: "— Ville —" },
                { value: "Brazzaville", label: "Brazzaville" },
                { value: "Pointe-Noire", label: "Pointe-Noire" },
              ]} />
              {arrondissements.length > 0 ? (
                <Select label="Arrondissement" value={form.arrondissement} onChange={(v) => set("arrondissement", v)} options={[
                  { value: "", label: "— Arrondissement —" },
                  ...arrondissements.map((a) => ({ value: a, label: a })),
                ]} />
              ) : (
                <Input label="Arrondissement" value={form.arrondissement} onChange={(v) => set("arrondissement", v)} />
              )}
              <Input label="Quartier" value={form.quartier} onChange={(v) => set("quartier", v)} />
              <Input label="Adresse (facultatif)" value={form.adresse_precision} onChange={(v) => set("adresse_precision", v)} />
            </div>
          </fieldset>

          {/* Tuteur */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground uppercase mb-2">Tuteur</legend>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nom du tuteur" value={form.guardian_name} onChange={(v) => set("guardian_name", v)} />
              <Input label="Profession" value={form.guardian_profession} onChange={(v) => set("guardian_profession", v)} />
              <Input label="Tél tuteur 1" value={form.guardian_phone_1} onChange={(v) => set("guardian_phone_1", v)} />
              <Input label="Tél tuteur 2" value={form.guardian_phone_2} onChange={(v) => set("guardian_phone_2", v)} />
            </div>
          </fieldset>

          {/* Academic */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground uppercase mb-2">Parcours Académique</legend>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Filière" value={form.program_id} onChange={(v) => {
                set("program_id", v);
                const p = programs.find((p) => p.id.toString() === v);
                if (p) set("sector_type", p.sector_name);
              }} options={[
                { value: "", label: "— Filière —" },
                ...programs.map((p) => ({ value: p.id.toString(), label: `${p.acronym ?? ""} - ${p.program_name}` })),
              ]} />
              <Select label="Niveau" value={form.current_level} onChange={(v) => set("current_level", v)} options={
                LEVELS.map((l) => ({ value: l, label: l }))
              } />
              <Select label="Dernier diplôme" value={form.last_degree_obtained} onChange={(v) => set("last_degree_obtained", v)} options={[
                { value: "", label: "—" },
                { value: "BAC Général", label: "BAC Général" },
                { value: "BAC Technique", label: "BAC Technique" },
                { value: "CQP", label: "CQP" },
                { value: "Licence", label: "Licence" },
                { value: "Master", label: "Master" },
              ]} />
            </div>
          </fieldset>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-muted">
              Annuler
            </button>
            <button type="submit" className="px-6 py-2 text-sm bg-estam-red text-white rounded-lg font-medium hover:opacity-90">
              {isEditing ? "Enregistrer" : "Inscrire l'étudiant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
