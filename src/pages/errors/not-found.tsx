import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col mx-auto px-4 pb-20 max-w-md h-full container">
        <h1 className="mt-10 font-thin text-muted-foreground text-3xl text-center">
          404 - Page Not Found
        </h1>

        <a className="mt-5 text-primary text-center" onClick={() => window.history.back()}>
          Go to Back
        </a>

        <Link to="/" className="mt-5 text-muted-foreground text-center">
          Go to Home
        </Link>

      </div>
    </div>
  );
}
