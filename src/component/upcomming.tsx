import React from "react";

// ProjectCard Component
interface ProjectCardProps {
  title: string;
  startDate: string;
  reason: string;
  duration: string;
  members: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  startDate,
  reason,
  duration,
  members,
}) => (
  <div className="card w-72 lg:w-96 bg-white shadow-md rounded-lg p-6 w-full sm:w-80 border mx-2">
    <p className="text-lg text-black mb-2 text-center">{`${startDate}`}</p>
    <h2 className="font-bold text-2xl mb-2 text-center">{title}</h2>
    <p className="text-xl text-black  mb-4 text-left">
      <span className="font-bold">Definision Of Project:</span> {reason}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex">
        {members.map((member, index) => (
          <img
            key={index}
            src={member}
            alt="member"
            className="w-10 h-10 rounded-full -ml-2 border-2 border-white"
          />
        ))}
        <div className="flex items-center justify-center w-10 h-10 bg-purple-500 text-white rounded-full ml-2">
          +
        </div>
      </div>
      <div className="bg-purple-500  text-white  font-bold rounded-full px-4 py-2">
        {duration}
      </div>
    </div>
  </div>
);

const Upcomming = () => {
  const projects = [
    {
      title: "Web Development",
      startDate: "July 16, 2024",
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      duration: "5 Days To Start",
      members: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
      ],
    },
    {
      title: "Dashboard Portal",
      startDate: "July 30, 2024",
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      duration: "1 Week To Start",
      members: [
        "https://randomuser.me/api/portraits/women/3.jpg",
        "https://randomuser.me/api/portraits/men/4.jpg",
      ],
    },
    {
      title: "Designing",
      startDate: "August 10, 2024",
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      duration: "1 Month To Start",
      members: [
        "https://randomuser.me/api/portraits/women/3.jpg",
        "https://randomuser.me/api/portraits/men/4.jpg",
      ],
    },
    {
      title: "Project",
      startDate: "July 10, 2024",
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      duration: "2 Month To Start",
      members: [
        "https://randomuser.me/api/portraits/women/3.jpg",
        "https://randomuser.me/api/portraits/men/4.jpg",
      ],
    },
];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-left">Up Comming</h1>
      <div className="flex justify-start">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Upcomming;
