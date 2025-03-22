import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";
import accountApi from "../component/api/accountApi";

// Interface Account (fixed phone_number type to match UserSummary)
export interface Account {
  id?: number;
  name: string;
  email: string;
  phone_number?: string; // Changed from number to string
  user_roles?: { roles: { id: number; name: string } }[];
  user_permissions?: { permissions: { id: number; name: string } }[];
}

// Interface MinimalAccountForm
interface MinimalAccountForm {
  name: string;
  email: string;
}

// Tambahkan phone_number sebagai string karena input number mengembalikan string
interface CreateAccountForm extends MinimalAccountForm {
  password: string;
  role: string;
  permission: string;
  phone_number: string;
}

interface EditableAccountForm extends MinimalAccountForm {
  role: string;
  permission: string;
  phone_number: string;
}

const roleOptions = ["User", "Project Manager Lead", "Super Admin"];
const permissionOptions = ["UserManagement", "ListProject"];

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [newAccount, setNewAccount] = useState<CreateAccountForm>({
    name: "",
    email: "",
    password: "",
    role: "",
    permission: "",
    phone_number: "",
  });

  const [editAccount, setEditAccount] = useState<(EditableAccountForm & { id: number }) | null>(null);

  const fetchAccounts = async () => {
    try {
      const users = await accountApi.getAllUser();
      setAccounts(users);
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No account selected",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09ABCA",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      await Promise.all(
        selectedIds.map(async (id) => {
          try {
            await accountApi.deleteUser(id);
          } catch (err) {
            console.error(`Error deleting id ${id}:`, err);
          }
          return true;
        })
      );
      await fetchAccounts();
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
    }
  };

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
      // No need to convert phone_number to string, it's already a string
      phone_number: account.phone_number || "",
      role:
        account.user_roles && account.user_roles.length > 0
          ? account.user_roles[0].roles.name
          : "",
      permission:
        account.user_permissions && account.user_permissions.length > 0
          ? account.user_permissions[0].permissions.name
          : "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = async () => {
    if (!editAccount) return;
    try {
      await accountApi.updateUser(editAccount.id, {
        name: editAccount.name,
        email: editAccount.email,
        role: editAccount.role,
        permission: editAccount.permission,
        phone_number: editAccount.phone_number,
      });
      await fetchAccounts();
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

  const handleAddAccount = async () => {
    try {
      await accountApi.createUser(newAccount);
      await fetchAccounts();
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
        role: "",
        permission: "",
        phone_number: "",
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
              <th className="p-4 border-b">PHONE NUMBER</th>
              <th className="p-4 border-b">EMAIL</th>
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
                  <td className="p-4">{account.phone_number || "-"}</td>
                  <td className="p-4">{account.email || "-"}</td>
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
                <label htmlFor="new-name" className="block text-lg font-semibold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="new-name"
                  name="name"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-email" className="block text-lg font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="new-email"
                  name="email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-phone_number" className="block text-lg font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="new-phone_number"
                  name="phone_number"
                  value={newAccount.phone_number}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, phone_number: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-lg font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="password"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-role" className="block text-lg font-semibold mb-1">
                  Role
                </label>
                <select
                  id="new-role"
                  name="role"
                  value={newAccount.role}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, role: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-permission" className="block text-lg font-semibold mb-1">
                  Permission
                </label>
                <select
                  id="new-permission"
                  name="permission"
                  value={newAccount.permission}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, permission: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                >
                  <option value="" disabled>
                    Select Permission
                  </option>
                  {permissionOptions.map((perm) => (
                    <option key={perm} value={perm}>
                      {perm}
                    </option>
                  ))}
                </select>
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
                <label htmlFor="edit-name" className="block text-lg font-semibold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editAccount.name}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-lg font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editAccount.email}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, email: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-phone_number" className="block text-lg font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="edit-phone_number"
                  name="phone_number"
                  value={editAccount.phone_number}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, phone_number: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-role" className="block text-lg font-semibold mb-1">
                  Role
                </label>
                <select
                  id="edit-role"
                  name="role"
                  value={editAccount.role}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, role: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-permission" className="block text-lg font-semibold mb-1">
                  Permission
                </label>
                <select
                  id="edit-permission"
                  name="permission"
                  value={editAccount.permission}
                  onChange={(e) =>
                    setEditAccount({ ...editAccount, permission: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                >
                  <option value="" disabled>
                    Select Permission
                  </option>
                  {permissionOptions.map((perm) => (
                    <option key={perm} value={perm}>
                      {perm}
                    </option>
                  ))}
                </select>
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