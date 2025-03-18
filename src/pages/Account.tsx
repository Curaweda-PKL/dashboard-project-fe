import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";
import accountApi from "../component/api/accountApi";

// Tipe data Account
export interface Account {
  id?: number;
  name: string;
  email: string;
  password: string;
}

interface MinimalAccountForm {
  name: string;
  email: string;
  password: string;
}

const AccountList: React.FC = () => {
  // State untuk list account
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newAccount, setNewAccount] = useState<MinimalAccountForm>({
    name: "",
    email: "",
    password: "",
  });
  const [editAccount, setEditAccount] = useState<(MinimalAccountForm & { id: number }) | null>(null);

  // Fetch data account dari API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountApi.getAllAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load accounts",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };
    fetchAccounts();
  }, []);

  // Toggle mode editing (untuk hapus)
  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedIds([]);
  };

  // Handle checkbox perubahan
  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  // Hapus account yang terpilih
  const handleRemoveSelected = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09ABCA",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const id of selectedIds) {
            await accountApi.deleteAccount(id);
          }
          const refreshedData = await accountApi.getAllAccounts();
          setAccounts(refreshedData);
          setSelectedIds([]);
          setIsEditing(false);
          Swal.fire({
            icon: "success",
            title: "Account(s) has been removed",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "rgb(0, 208, 255)",
            color: "#000000",
          });
        } catch (error) {
          console.error("Error deleting accounts:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to delete selected account(s)",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    });
  };

  // Buka modal edit dan set data akun yang akan diedit
  const openEditModal = (account: Account) => {
    if (!account.id) {
      Swal.fire({
        icon: "error",
        title: "Account ID is missing.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    setEditAccount({
      id: account.id,
      name: account.name,
      email: account.email,
      password: account.password,
    });
    setIsEditModalOpen(true);
  };

  // Update akun melalui API
  const handleUpdateAccount = async () => {
    if (!editAccount) return;
    try {
      await accountApi.updateAccount(editAccount.id, {
        name: editAccount.name,
        email: editAccount.email,
        password: editAccount.password,
      });
      const refreshedData = await accountApi.getAllAccounts();
      setAccounts(refreshedData);
      setIsEditModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Account has been updated",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
    } catch (error) {
      console.error("Error updating account:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update account",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  // Tambah akun baru melalui API
  const handleAddAccount = async () => {
    try {
      await accountApi.createAccount(newAccount);
      const refreshedData = await accountApi.getAllAccounts();
      setAccounts(refreshedData);
      Swal.fire({
        icon: "success",
        title: "Account has been added",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
      setNewAccount({
        name: "",
        email: "",
        password: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding account:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add account",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>
      <div className="overflow-x-auto">
        <table className="text-center w-full rounded-lg overflow-hidden border">
          <thead>
            <tr className="bg-[#02CCFF] text-white">
              {isEditing && <th className="p-4"></th>}
              <th className="p-4 border-b">NAME</th>
              <th className="p-4 border-b">EMAIL</th>
              <th className="p-4 border-b">PASSWORD</th>
              <th className="p-4 border-b"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={isEditing ? 5 : 4} className="p-4">
                  No accounts found
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-t text-black font-bold hover:bg-gray-100 transition duration-200"
                >
                  {isEditing && (
                    <td className="p-4">
                      <label className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(account.id!)}
                          onChange={() => handleCheckboxChange(account.id!)}
                          className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                        />
                      </label>
                    </td>
                  )}
                  <td className="p-4">{account.name || "-"}</td>
                  <td className="p-4">{account.email || "-"}</td>
                  <td className="p-4">{account.password || "-"}</td>
                  <td className="p-4">
                    <button
                      onClick={() => openEditModal(account)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit Account"
                    >
                      <FaPencilAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tombol Add Account dan Remove */}
      <div className="fixed bottom-10 right-10 flex gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-curawedaColor text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-[#029FCC] transition duration-200"
        >
          Add account
        </button>
        {!isEditing ? (
          <button
            className="bg-[#B20000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-900 transition duration-200"
            onClick={toggleEditingMode}
          >
            Remove
          </button>
        ) : (
          <>
            <button
              className="bg-[#6D6D6D] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-[#494949] transition duration-200"
              onClick={toggleEditingMode}
            >
              Cancel
            </button>
            <button
              className="bg-[#B20000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-900 transition duration-200"
              onClick={handleRemoveSelected}
            >
              Remove
            </button>
          </>
        )}
      </div>

      {/* Modal untuk Add Account */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Add Account</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddAccount();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-1">Password</label>
                <input
                  type="password"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#6D6D6D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#494949]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal untuk Edit Account */}
      {isEditModalOpen && editAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditAccount(null);
              }}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Account</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateAccount();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={editAccount.name}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editAccount.email}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, email: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-1">Password</label>
                <input
                  type="password"
                  value={editAccount.password}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, password: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditAccount(null);
                  }}
                  className="bg-[#6D6D6D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#494949]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;
