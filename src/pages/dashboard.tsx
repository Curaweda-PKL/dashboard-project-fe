import LayoutProject from "../layout/layoutProject";
import UpcomingProjects from "../component/upcomming";
import Onhold from "../component/onhold";
import InProgress from "../component/inprogress";



const Dashboard = () => {
  const projectData = [
    { count: 6, label: "In Progress" },
    { count: 8, label: "Upcoming" },
    { count: 2, label: "On Hold" },
    { count: 16, label: "Total Projects" },
  ];

  return (
    <LayoutProject>
   {/* Dashboard Section */}
<div className="bg-gray-100 shadow-md rounded-lg p-6 border border-gray-300 mb-8 sticky top-0 z-10">
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-4xl font-bold">Projects</h2>
    <span className="text-black font-bold text-2xl">22 July 2024</span>
  </div>

  {/* Project Summary */}
  <div className="grid grid-cols-4">
    {projectData.map((item, index) => (
      <div
        key={index}
        className="flex flex-col items-start text-start pl-3 border-l-2 border-black"
      >
        <p className="text-2xl font-bold mb-2">{item.count}</p>
        <p className="text-black text-lg font-semibold whitespace-nowrap">
          {item.label}
        </p>
      </div>
    ))}
  </div>

  {/* Buttons below the Project Summary */}
  <div className="flex justify-end gap-4 mt-6">
    <div className="flex flex-col gap-4">
      <button className="bg-green-500 text-black font-bold px-12 py-3 rounded-full hover:scale-105">
        Add Project
      </button>
      <button className="bg-teal-700 text-black font-bold px-8 py-3 rounded-full hover:scale-105">
        Remove Project
      </button>
    </div>
  </div>
</div>

      {/* ProjectList Section */}
      <div className="bg-white shadow-md rounded-lg">
        <InProgress />
      </div>
      <div className="bg-white shadow-md rounded-lg">
      <UpcomingProjects/>
      </div>
      <div className="bg-white shadow-md rounded-lg">
      <Onhold/>
      </div>
    </LayoutProject>
  );
};

export default Dashboard