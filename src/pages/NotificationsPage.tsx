import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell size={20} /> Notifications & Annonces</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Centre de notifications — Rappels, annonces ciblées et historique<br />
            <span className="text-sm">Module en cours d'intégration avec la base de données</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
