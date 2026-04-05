import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen size={20} /> Bibliothèque en ligne</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Module Bibliothèque — Livres, Cours, Exposés, Mémoires<br />
            <span className="text-sm">Fonctionnalité en cours d'intégration</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
