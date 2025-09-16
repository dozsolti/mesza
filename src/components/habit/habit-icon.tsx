import { icons } from "lucide-react";
import { HabitIcon as HabitIconType } from "@/types";

export default function HabitIcon({
  iconName,
  color,
}: {
  iconName: HabitIconType;
  color?: string;
}) {
  const LucideIcon = icons[iconName] as React.FC<React.SVGProps<SVGSVGElement>>;
  return (
    <div className="flex items-center bg-blue-100/10 px-2 rounded-lg aspect-square">
      <LucideIcon className="w-5 h-5" style={{ color }} />
    </div>
  );
}
