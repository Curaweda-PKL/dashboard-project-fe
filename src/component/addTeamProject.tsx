import React, { useEffect, useState } from "react";
import { FiUser, FiUserPlus, FiUserMinus } from "react-icons/fi";
import Swal from "sweetalert2";
import teamApi, { TeamMember } from "./api/TeamProjectApi";
import { useParams, useNavigate } from "react-router-dom";
import projectApi from "./api/projectApi"; // Import projectApi to get project details

// Enhanced Member interface that extends the API's TeamMember interface
interface Member extends Omit<TeamMember, "assigned"> {
  isAdded: boolean; // Internal state untuk melacak apakah anggota sudah di-add ke project
}

const AddTeamProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate(); // Add this line
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialMembers, setInitialMembers] = useState<Member[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all team members
        const apiMembers = await teamApi.getAllTeams();
        
        // Fetch project details if projectId exists
        if (projectId) {
          try {
            const projectData = await projectApi.getProjectById(Number(projectId));
            setProjectDetails(projectData);
          } catch (error) {
            console.error("Error fetching project details:", error);
          }
          
          // Fetch teams already assigned to this project
          const projectTeamAssignments = await teamApi.getProjectTeams(Number(projectId));
          const assignedTeamIds = projectTeamAssignments.map(assignment => assignment.teamId);
          
          // Mark teams that are already assigned to the project
          const mappedMembers: Member[] = apiMembers.map((tm) => ({
            id: tm.id,
            name: tm.name,
            division: tm.division,
            status: tm.status,
            isAdded: assignedTeamIds.includes(tm.id),
          }));
          
          setMembers(mappedMembers);
          setInitialMembers(mappedMembers);
        } else {
          // If no projectId, just map all members as not added
          const mappedMembers: Member[] = apiMembers.map((tm) => ({
            id: tm.id,
            name: tm.name,
            division: tm.division,
            status: tm.status,
            isAdded: false,
          }));
          setMembers(mappedMembers);
          setInitialMembers(mappedMembers);
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Utility untuk membandingkan dua array berdasarkan properti isAdded
  const isEqual = (arr1: Member[], arr2: Member[]) => {
    return arr1.every((member, index) => member.isAdded === arr2[index].isAdded);
  };

  const toggleMember = (id: number) => {
    setMembers((prev) => {
      const updatedMembers = prev.map((member) =>
        member.id === id ? { ...member, isAdded: !member.isAdded } : member
      );
      setIsChanged(!isEqual(updatedMembers, initialMembers));
      return updatedMembers;
    });
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleSubmit = async () => {
    if (!projectId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Project ID is missing. Cannot update team assignments.",
      });
      return;
    }

    setIsEditMode(false);
    
    // Find members that were added (changed from false to true)
    const addedMembers = members.filter(
      (member, index) => member.isAdded && !initialMembers[index].isAdded
    );
    
    // Find members that were removed (changed from true to false)
    const removedMembers = members.filter(
      (member, index) => !member.isAdded && initialMembers[index].isAdded
    );

    if (addedMembers.length === 0 && removedMembers.length === 0) {
      setIsChanged(false);
      return;
    }

    try {
      // Add new team members to the project
      if (addedMembers.length > 0) {
        await Promise.all(
          addedMembers.map((member) =>
            teamApi.createTeamAssignment({
              projectId: Number(projectId),
              teamId: member.id
            })
          )
        );
      }
      
      // Remove team members from the project
      if (removedMembers.length > 0) {
        // Fetch current project team assignments to get the assignment IDs
        const currentAssignments = await teamApi.getProjectTeams(Number(projectId));
        
        await Promise.all(
          removedMembers.map((member) => {
            const assignment = currentAssignments.find(a => a.teamId === member.id);
            if (assignment) {
              return teamApi.removeTeamFromProject(Number(projectId), assignment.id);
            }
            return Promise.resolve(); // Skip if assignment not found
          })
        );
      }

      // Update local state
      setInitialMembers([...members]);
      setIsChanged(false);

      // Show success notification
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: "Team assignments have been updated",
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
      
      // Navigate back to project task page after successful submission
      if (projectDetails) {
        const duration = `${toDMYString(new Date(projectDetails.start_date))} - ${toDMYString(new Date(projectDetails.end_date))}`;
        navigate(`/project/${projectId}/team`, {
          state: {
            projectName: projectDetails.title,
            pm: "Gustavo Bergson",
            date: duration,
            client: projectDetails.client || "",
          },
        });
      }
    } catch (error) {
      console.error("Error updating team assignments:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating team assignments. Please try again.",
      });
    }
  };

  // Helper function to format dates in DMY format
  const toDMYString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCancel = () => {
    setMembers(initialMembers);
    setIsChanged(false);
  };

  const handleBack = () => {
    setMembers(initialMembers);
    setIsEditMode(false);
    setIsChanged(false);
    
    // Navigate back to project task page if projectId exists
    if (projectId && projectDetails) {
      const duration = `${toDMYString(new Date(projectDetails.start_date))} - ${toDMYString(new Date(projectDetails.end_date))}`;
      navigate(`/project/${projectId}/task`, {
        state: {
          projectName: projectDetails.title,
          pm: "Gustavo Bergson",
          date: duration,
          client: projectDetails.client || "",
        },
      });
    }
  };

  // Di mode tampilan (view mode), hanya tampilkan anggota yang sudah di-add
  const displayedMembers = isEditMode ? members : members.filter((member) => member.isAdded);
  const sortedMembers = displayedMembers; // Sorting tambahan dapat dilakukan jika diperlukan

  if (isLoading) {
    return <div className="p-6 text-center">Loading team members...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button 
          className="mt-4 bg-curawedaColor text-white font-semibold py-2 px-6 rounded-full"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      {sortedMembers.length > 0 ? (
        <table className="w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              <th className="p-4 rounded-tl-lg border-b-4 border-white font-bold text-lg">NAME</th>
              <th className="p-4 border-b-4 border-white font-bold text-lg">ROLE</th>
              <th className="p-4 rounded-tr-lg border-b-4 border-white font-bold text-lg">STATUS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t text-center text-black font-bold hover:bg-gray-100 transition duration-200"
              >
                <td className="p-4 relative">
                  {/* Icon untuk menambah atau menghapus anggota */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    {isEditMode ? (
                      member.isAdded ? (
                        <FiUserMinus
                          className="text-[#B20000] cursor-pointer"
                          onClick={() => toggleMember(member.id)}
                        />
                      ) : (
                        <FiUserPlus
                          className="text-[#0AB239] cursor-pointer"
                          onClick={() => toggleMember(member.id)}
                        />
                      )
                    ) : (
                      member.isAdded && <FiUser className="text-curawedaColor" />
                    )}
                  </div>
                  <div className="pl-10">{member.name}</div>
                </td>
                <td className="p-4">{member.division}</td>
                <td className="p-4">{member.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No members available.</p>
      )}

      {/* Tombol-tombol untuk mode edit */}
      {isEditMode && (
        <div className="fixed bottom-10 right-10 flex gap-4">
          <button
            className="bg-[#6D6D6D] text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#494949] transition"
            onClick={handleBack}
          >
            Back
          </button>
          {isChanged && (
            <>
              <button
                className="bg-[#B20000] text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-red-900 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-curawedaColor text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#029FCC] transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </>
          )}
        </div>
      )}

      {/* Tombol Add (hanya muncul di mode tampilan) */}
      {!isEditMode && !isChanged && (
        <button
          className="fixed bottom-10 right-10 bg-curawedaColor text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#029FCC] transition"
          onClick={handleEditMode}
        >
          Tambah
        </button>
      )}
    </div>
  );
};

export default AddTeamProject;