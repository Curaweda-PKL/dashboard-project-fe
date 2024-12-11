import React from "react";
import LayoutProject from "../layout/layoutProject";

const Dashboard: React.FC = () => {
  return (
    <LayoutProject>
      <div className="flex flex-col md:flex-row bg-white">
        <div className="md:w-1/3">
          <h2>Welcome to the Dashboard</h2>
          <p>This is your main content area.</p>
        </div>
        <div className="md:w-2/3 md:pl-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, quia
            aspernatur. Doloremque, officiis. Quas, quibusdam? Minus illum
            voluptatum, asperiores quia doloremque, repellat explicabo, aperiam
            modi ratione quibusdam possimus consequuntur. Consectetur, voluptates
            quia. Quos, voluptate. Dolore, quas. Consectetur, quidem. Quos,
            voluptates. Quasi, distinctio. Consectetur, quidem. Quos, voluptates.
            Quasi, distinctio. Consectetur, quidem. Quos, voluptates. Quasi,
            distinctio. Consectetur, quidem. Quos, voluptates. Quasi, distinctio.
            Consectetur, quidem. Quos, voluptates. Quasi, distinctio.
          </p>
        </div>
      </div>
    </LayoutProject>
  );
};

export default Dashboard;


