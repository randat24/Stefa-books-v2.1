import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
        <p className="text-slate-600">Завантаження...</p>
      </div>
    </div>
  );
}