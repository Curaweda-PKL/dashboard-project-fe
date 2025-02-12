import React from "react";
import Swal from "sweetalert2";

interface RemoveTeamModalProps {
  member: { name: string; id: number };
  onClose: () => void;
  onRemove: () => void;
}

const RemoveTeamModal: React.FC<RemoveTeamModalProps> = ({ member, onClose, onRemove }) => {
  const handleRemove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${member.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09abca",
      cancelButtonColor: "#6D6D6D",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onRemove();
        Swal.fire("Deleted!", `${member.name} has been deleted.`, "success");

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
          title: "Project has been removed",
          background: "rgb(0, 208, 255)",
          color: "#000000",
        });
      }
    });
  };

  React.useEffect(() => {
    handleRemove();
    onClose();
  }, [member, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Delete Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <p className="mb-4">
          Are you sure you want to delete {member.name}? This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default RemoveTeamModal;

