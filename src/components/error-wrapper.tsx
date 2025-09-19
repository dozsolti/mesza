import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./ui/button";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const stack = error.stack
    ? error.stack
        .split("\n")
        .map((line, index) => (
          <li key={index}>{line.replace(window.location.href, "")}</li>
        ))
    : null;

  return (
    <div role="alert" className="flex flex-col gap-2 p-3">
      <p className="font-bold text-red-400">
        I am sorry, an error occurred! {error.name}
      </p>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
      <pre className="whitespace-pre-wrap">
        if it keeps happening please contact support with a{" "}
        <span className="font-semibold">SCREENSHOT OF THIS SCREEN</span>!
      </pre>
      <ul className="flex flex-col gap-2 bg-zinc-800 p-2 rounded">{stack}</ul>
    </div>
  );
}


export default function ErrorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
