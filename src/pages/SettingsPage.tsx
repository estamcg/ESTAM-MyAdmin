import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings size={20} /> Paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Configuration de l'application et des préférences<br />
            <span className="text-sm">Module en cours d'intégration</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
