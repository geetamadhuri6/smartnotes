import { useEffect, useState } from "react";
import API from "./api";

export default function Profile({ setView }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await API.get("/auth/me");
        const s = await API.get("/notes/stats");

        setUser(u.data);
        setStats(s.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (!user || !stats) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <button
        onClick={() => setView("notes")}
        className="bg-blue-500 px-4 py-2 rounded mb-6"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Profile 👤</h1>

      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2 className="text-xl font-bold mt-6">Analytics 📊</h2>

      <p>Total Notes: {stats.total}</p>
    </div>
  );
}