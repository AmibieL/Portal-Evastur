import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CapacityFieldsProps {
  totalSlots: string;
  availableSlots: string;
  onTotalSlotsChange: (value: string) => void;
  onAvailableSlotsChange: (value: string) => void;
}

export function CapacityFields({
  totalSlots,
  availableSlots,
  onTotalSlotsChange,
  onAvailableSlotsChange,
}: CapacityFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Users size={14} className="text-muted-foreground" />
          Capacidade total
        </Label>
        <Input
          type="number"
          min={0}
          step={1}
          value={totalSlots}
          onChange={(event) => onTotalSlotsChange(event.target.value)}
          placeholder="Ilimitado"
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          {totalSlots
            ? `${totalSlots} lugar(es) originalmente oferecidos`
            : "Deixe vazio para capacidade ilimitada"}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Users size={14} className="text-muted-foreground" />
          Vagas disponíveis agora
        </Label>
        <Input
          type="number"
          min={0}
          step={1}
          max={totalSlots || undefined}
          value={availableSlots}
          onChange={(event) => onAvailableSlotsChange(event.target.value)}
          placeholder={totalSlots || "Ilimitado"}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          Na criação, deixe vazio para iniciar com a capacidade total. Na edição, altere somente o saldo disponível.
        </p>
      </div>
    </>
  );
}
