import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, TrendingUp, CreditCard, GraduationCap, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCFA } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#E63946", "#1A237E", "#F4A300", "#2196F3", "#4CAF50", "#9C27B0", "#FF5722", "#607D8B"];

export default function Dashboard() {
  const { data: students } = useQuery({
    queryKey: ["students-count"],
    queryFn: async () => {
      const { count } = await supabase.from("students").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: staff } = useQuery({
    queryKey: ["staff-count"],
    queryFn: async () => {
      const { count } = await supabase.from("staff").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: finance } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      const { data } = await supabase.from("financial_summary").select("*").single();
      return data;
    },
  });

  const { data: recentStudents } = useQuery({
    queryKey: ["recent-students"],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, registration_number, last_name, first_name, chosen_formation, current_level, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: programs } = useQuery({
    queryKey: ["programs-stats"],
    queryFn: async () => {
      const { data: allStudents } = await supabase.from("students").select("chosen_formation");
      const counts: Record<string, number> = {};
      (allStudents ?? []).forEach((s) => {
        const f = s.chosen_formation || "Non défini";
        counts[f] = (counts[f] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name: name.substring(0, 20), value }));
    },
  });

  const { data: debtors } = useQuery({
    queryKey: ["debtors"],
    queryFn: async () => {
      const { data } = await supabase.from("student_debt_status").select("*").gt("balance", 0).limit(10);
      return data ?? [];
    },
  });

  const kpis = [
    { label: "Étudiants inscrits", value: students ?? 0, icon: Users, color: "bg-blue-500" },
    { label: "Personnel actif", value: staff ?? 0, icon: Briefcase, color: "bg-green-500" },
    { label: "Chiffre d'Affaires", value: formatCFA(finance?.chiffre_affaires_total), icon: TrendingUp, color: "bg-estam-red" },
    { label: "Total Inscriptions", value: formatCFA(finance?.total_inscriptions), icon: Wallet, color: "bg-purple-500" },
    { label: "Total Scolarité", value: formatCFA(finance?.total_scolarite), icon: GraduationCap, color: "bg-amber-500" },
    { label: "Cartes Étudiant", value: formatCFA(finance?.total_cartes), icon: CreditCard, color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`${kpi.color} p-2 rounded-lg`}>
                  <kpi.icon size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
                  <p className="text-sm font-bold">{typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Effectif par Filière */}
        <Card>
          <CardHeader><CardTitle>Effectif par Filière</CardTitle></CardHeader>
          <CardContent>
            {programs && programs.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={programs} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {programs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        {/* Étudiants en retard de paiement */}
        <Card>
          <CardHeader><CardTitle className="text-destructive">⚠ Étudiants en retard de paiement</CardTitle></CardHeader>
          <CardContent>
            {debtors && debtors.length > 0 ? (
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {debtors.map((d) => (
                  <div key={d.id} className="flex justify-between items-center p-2 rounded bg-destructive/5 border border-destructive/20 text-sm">
                    <span className="font-medium">{d.last_name} {d.first_name}</span>
                    <span className="text-destructive font-semibold">{formatCFA(d.balance)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">Aucun retard</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent inscriptions */}
      <Card>
        <CardHeader><CardTitle>Dernières Inscriptions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Matricule</th>
                  <th className="pb-2 font-medium text-muted-foreground">Nom</th>
                  <th className="pb-2 font-medium text-muted-foreground">Filière</th>
                  <th className="pb-2 font-medium text-muted-foreground">Niveau</th>
                </tr>
              </thead>
              <tbody>
                {(recentStudents ?? []).map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{s.registration_number ?? "—"}</td>
                    <td className="py-2">{s.last_name} {s.first_name}</td>
                    <td className="py-2">{s.chosen_formation ?? "—"}</td>
                    <td className="py-2">{s.current_level ?? "—"}</td>
                  </tr>
                ))}
                {(!recentStudents || recentStudents.length === 0) && (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Aucun étudiant inscrit</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
