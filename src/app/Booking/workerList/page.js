import React from "react";
import Navbar from "@/components/Navbar";
import AvailableWorkers from "@/components/user/AvailableWorker";
import Footer from "@/components/footer";
const paeg = () => {
  return (
    <div>
      <Navbar />
      <main className="mt-32 mb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {" "}
          <AvailableWorkers />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default paeg;
