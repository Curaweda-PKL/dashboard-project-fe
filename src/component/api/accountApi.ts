// src/api/accountApi.ts
import axios from "axios";

// Atur base URL sesuai dengan endpoint API Anda
const API_URL = "http://localhost:3000";

// Fungsi untuk mengambil semua data account
const getAllAccounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/accounts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

// Fungsi untuk membuat account baru
const createAccount = async (newAccount: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/accounts`, newAccount);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

// Fungsi untuk mengupdate account berdasarkan ID
const updateAccount = async (
  id: number,
  updatedAccount: { name: string; email: string; password: string }
) => {
  try {
    const response = await axios.put(`${API_URL}/accounts/${id}`, updatedAccount);
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

// Fungsi untuk menghapus account berdasarkan ID
const deleteAccount = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export default { getAllAccounts, createAccount, updateAccount, deleteAccount };
