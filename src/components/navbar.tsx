import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar({
  title = "",
  withBackButton,
  rightActions = [],
}: {
  title?: string;
  withBackButton?: boolean;
  rightActions?: React.ReactNode[];
}) {
  return (
    <header className="top-0 z-10 sticky bg-background px-4 md:px-6 border-b">
      <div className="flex justify-between items-center gap-4 h-16">
        <div className="flex flex-1 items-center gap-3">
          {withBackButton && (
            <Button
              size={"icon"}
              variant="ghost"
              asChild
              className="max-sm:p-0 size-6 max-sm:aspect-square"
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon />
            </Button>
          )}
          <h2 className="font-bold text-2xl">{title}</h2>
        </div>

        <div className="flex flex-1 justify-end items-center gap-2">
          {rightActions}
        </div>
      </div>
    </header>
  );
}
