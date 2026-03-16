import React from "react";

function Title(props) {
  return (
    <>
      <header className="flex items-center justify-between px-4 py-4 mb-6 bg-gradient-to-r from-primary via-rose-400 to-orange-300 text-white shadow-lg rounded-2xl backdrop-blur-sm border border-white/10">
        <div className="flex items-baseline gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              K-Car Services
            </h1>
            <p className="text-xs md:text-sm text-white/70">
              one destination for servicing of all cars
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <p className="hidden md:block cursor-pointer hover:text-orange-100/90 transition-colors" hidden={props.state}>
            My Tickets
          </p>
          <p className="cursor-pointer hover:text-orange-100/90 transition-colors">Sign-out</p>
        </nav>
      </header>
    </>
  );
}

export default Title