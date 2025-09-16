import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { icons, LucideProps, SearchIcon, XIcon } from "lucide-react";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useId,
  useState,
} from "react";
import { HabitIcon } from "@/types";

const ICONS = Object.entries(icons).map<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}>(([name, Icon]) => ({ name, Icon }));

export default function IconPicker({
  icon,
  setIcon,
}: {
  icon?: HabitIcon;
  setIcon: (icon: HabitIcon) => void;
}) {
  const id = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredIcons = ICONS.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 30);

  const handleIconSelect = (name: HabitIcon) => {
    setIcon(name);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="min-h-full">
          {(() => {
            const found = ICONS.find(({ name }) => name === icon);
            return found ? (
              <found.Icon className="w-5 h-5" />
            ) : (
              <SearchIcon className="w-5 h-5" />
            );
          })()}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="gap-2 mx-auto max-h-10/12 container"
      >
        <SheetHeader className="mb-0">
          <SheetTitle>Select an Icon</SheetTitle>
          <SheetDescription>Choose an icon for your habit.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 gap-3 grid auto-rows-min px-4">
          <div className="relative">
            <Input
              id={id}
              className="peer ps-9 pe-9"
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 flex justify-center items-center peer-disabled:opacity-50 ps-3 text-muted-foreground/80 pointer-events-none start-0">
              <SearchIcon size={16} />
            </div>
            <button
              className="focus:z-10 absolute inset-y-0 flex justify-center items-center disabled:opacity-50 focus-visible:border-ring rounded-e-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 w-9 h-full text-muted-foreground/80 hover:text-foreground transition-[color,box-shadow] disabled:cursor-not-allowed disabled:pointer-events-none end-0"
              aria-label="Submit search"
              type="submit"
            >
              <XIcon
                size={16}
                aria-hidden="true"
                onClick={() => setSearchTerm("")}
              />
            </button>
          </div>
          <div className="gap-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 grid-rows-[min-content] h-80 overflow-x-hidden overflow-y-scroll">
            {filteredIcons.length === 0 && (
              <div className="col-span-full py-4 text-center">
                No icons found.
              </div>
            )}
            {filteredIcons.map(({ name, Icon }) => (
              <button
                key={name}
                type="button"
                className={`flex flex-col justify-center items-center gap-1 hover:bg-accent/50 p-2 rounded hover:text-accent-foreground ${
                  icon === name ? "bg-accent text-accent-foreground" : ""
                }`}
                aria-pressed={icon === name}
                aria-label={name}
                title={name}
                onClick={() => handleIconSelect(name)}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs text-center wrap-anywhere">
                  {name}
                </span>
              </button>
            ))}
            {/* TODO: add virtualized list */}
            {!searchTerm && (<div className="col-span-full py-4 text-center">
              Search to find more icons
            </div>)}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
