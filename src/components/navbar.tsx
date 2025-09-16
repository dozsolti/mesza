import { ArrowLeftIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Navbar({
  title = "",
  withBackButton,
}: {
  title?: string;
  withBackButton?: boolean;
}) {
  return (
    <header className="px-4 md:px-6 border-b">
      <div className="flex justify-between items-center gap-4 h-16">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {withBackButton && (
            <Button
              size={"icon"}
              variant="ghost"
              asChild
              className="max-sm:p-0 max-sm:aspect-square"
              onClick={() => window.history.back()}
            >
              <Link to={"/"}>
                <ArrowLeftIcon />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          )}
          <h2 className="font-bold text-2xl">
            {title}
          </h2>
        </div>
        {/* Middle area */}
        {/* Right side */}
        {!withBackButton && (
          <div className="flex flex-1 justify-end items-center gap-2">
            <Button asChild variant="ghost" className="max-sm:p-0 max-sm:aspect-square">
              <Link to="/settings">
                <SettingsIcon
                  className="opacity-60 sm:-ms-1"
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
