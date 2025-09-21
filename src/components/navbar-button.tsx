import { JSX } from 'react';
import { Link, LinkProps } from 'react-router';

import { Button } from './ui/button';

type NavbarButtonProps = {
  label: string;
  config:
    | { type: "link"; to: LinkProps["to"] }
    | { type: "button"; onClick: () => void };
  Icon: React.ComponentType<{ className?: string }>;
};

export default function NavbarButton({
  label,
  config,
  Icon,
}: NavbarButtonProps): JSX.Element {
  // #region Link
  if (config.type === "link") {
    return (
      <Button
        asChild
        variant="ghost"
        className="max-sm:p-0 max-sm:aspect-square"
      >
        <Link to={config.to}>
          <Icon className="opacity-80 sm:-ms-1" aria-hidden="true" />
          <span className="max-sm:sr-only">{label}</span>
        </Link>
      </Button>
    );
  }
  //#endregion

  // #region Button
  if (config.type === "button") {
    return (
      <Button
        variant="ghost"
        className="max-sm:p-0 max-sm:aspect-square"
        onClick={config.onClick}
      >
        <Icon className="opacity-80 sm:-ms-1" aria-hidden="true" />
        <span className="max-sm:sr-only">{label}</span>
      </Button>
    );
  }
  //#endregion

  return <></>;
}
