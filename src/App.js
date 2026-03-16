import React from "react";
import MainRoutes from "./components/routes/Mainroutes";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-20 left-20 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
        </div>
        <MainRoutes />
      </div>
    </div>
  );
}

export default App;
