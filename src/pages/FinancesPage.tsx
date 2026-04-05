import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCFA } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";

export default function FinancesPage() {
  const { data: summary } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      const { data } = await supabase.from("financial_summary").select("*").single();
      return data;
    },
  });

  const { data: debtStatus } = useQuery({
    queryKey: ["student-financial-status"],
    queryFn: async () => {
      const { data } = await supabase.from("view_student_financial_status").select("*").order("reste_a_payer", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Chiffre d'Affaires", value: formatCFA(summary?.chiffre_affaires_total), icon: TrendingUp, color: "bg-green-500" },
          { label: "Total Inscriptions", value: formatCFA(summary?.total_inscriptions), icon: Wallet, color: "bg-blue-500" },
          { label: "Total Scolarité", value: formatCFA(summary?.total_scolarite), icon: Receipt, color: "bg-purple-500" },
          { label: "Cartes Étudiant", value: formatCFA(summary?.total_cartes), icon: Receipt, color: "bg-amber-500" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${k.color} p-2 rounded-lg`}><k.icon size={18} className="text-white" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-sm font-bold">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Situation financière */}
      <Card>
        <CardHeader><CardTitle>Situation Financière des Étudiants</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Matricule</th>
                  <th className="p-3 text-left font-medium">Étudiant</th>
                  <th className="p-3 text-left font-medium">Filière</th>
                  <th className="p-3 text-left font-medium">Niveau</th>
                  <th className="p-3 text-right font-medium">Total Dû</th>
                  <th className="p-3 text-right font-medium">Total Versé</th>
                  <th className="p-3 text-right font-medium">Reliquat</th>
                </tr>
              </thead>
              <tbody>
                {(debtStatus ?? []).map((d, i) => (
                  <tr key={i} className={`border-b ${(d.reste_a_payer ?? 0) > 0 ? "bg-destructive/5" : ""}`}>
                    <td className="p-3 font-mono text-xs">{d.matricule ?? "—"}</td>
                    <td className="p-3 font-medium">{d.etudiant ?? "—"}</td>
                    <td className="p-3">{d.filiere ?? "—"}</td>
                    <td className="p-3">{d.niveau ?? "—"}</td>
                    <td className="p-3 text-right">{formatCFA(d.total_a_payer)}</td>
                    <td className="p-3 text-right">{formatCFA(d.total_verse)}</td>
                    <td className={`p-3 text-right font-bold ${(d.reste_a_payer ?? 0) > 0 ? "text-destructive" : "text-green-600"}`}>
                      {formatCFA(d.reste_a_payer)}
                    </td>
                  </tr>
                ))}
                {(!debtStatus || debtStatus.length === 0) && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Aucune donnée financière</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
