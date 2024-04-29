import React from "react";

function DashBoard() {
  return (
    <>
      <div className="dashboard-wrapper bg-[#496989] h-full py-10 px-24 w-full">
        <div className="grid grid-cols-2 gap-5">
          <div className="border-2">
            <h2 className="text-center">LandOwner</h2>
          </div>
          <div className="border-2">
            <h2 className="text-center">Arb</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
