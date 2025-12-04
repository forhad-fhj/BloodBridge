import { useRouteError } from "react-router";
import Header from "../components/Header";

const Error = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <Header></Header>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass p-12 rounded-2xl text-center max-w-2xl">
          <div className="mb-6">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            Page Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            {error?.statusText ||
              error?.message ||
              "The page you're looking for doesn't exist."}
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Error;
