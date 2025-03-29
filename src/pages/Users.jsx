import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalpages, setTotalpages] = useState(1);
    const [edituser, setEdituser] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchUser(page);
    }, [page, navigate]);

    const fetchUser = async (page) => {
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
            setUsers(response.data.data);
            setTotalpages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    };

    const handleEdit = (user) => {
        setEdituser(user);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://reqres.in/api/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
            setMessage("User deleted successfully!");
        } catch (error) {
            setMessage("Failed to delete user.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `https://reqres.in/api/users/${edituser.id}`,
                {
                    first_name: edituser.first_name,
                    last_name: edituser.last_name,
                    email: edituser.email,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            setMessage("User updated successfully!");

            setUsers(users.map(user =>
                user.id === edituser.id ? { ...user, ...response.data } : user
            ));

            setEdituser(null);
        } catch (error) {
            setMessage("Failed to update user.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button className="bg-red-500 text-white px-4 py-2 rounded mb-4" onClick={() => { localStorage.removeItem("authToken"); navigate('/login'); }}>
                Logout
            </button>
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            {message && <p className="text-green-600">{message}</p>}
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3">Avatar</th>
                            <th className="p-3">First Name</th>
                            <th className="p-3">Last Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-200">
                                <td className="p-3"><img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" /></td>
                                <td className="p-3">{user.first_name}</td>
                                <td className="p-3">{user.last_name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3 space-x-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(user)}>Edit</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
                <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</button>
                <span className="font-bold">Page {page} of {totalpages}</span>
                <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setPage((prev) => Math.min(prev + 1, totalpages))} disabled={page === totalpages}>Next</button>
            </div>
            
            {edituser && (
                <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Edit User</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <input type="text" className="w-full p-2 border rounded" value={edituser.first_name || ""} onChange={(e) => setEdituser({ ...edituser, first_name: e.target.value })} required />
                        <input type="text" className="w-full p-2 border rounded" value={edituser.last_name || ""} onChange={(e) => setEdituser({ ...edituser, last_name: e.target.value })} required />
                        <input type="email" className="w-full p-2 border rounded" value={edituser.email || ""} onChange={(e) => setEdituser({ ...edituser, email: e.target.value })} required />
                        <div className="space-x-2">
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Update</button>
                            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setEdituser(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Users;
