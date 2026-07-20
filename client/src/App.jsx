import { useState, useEffect } from "react";
import API from "./api";
import jsPDF from "jspdf";
import Profile from "./Profile";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegister, setIsRegister] = useState(false);
  const [view, setView] = useState("notes");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("General");
  const [search, setSearch] = useState("");

  // ================= AUTH =================

  const register = async () => {
    try {
      await API.post("/auth/register", { username, email, password });
      alert("Registered successfully ✅ Please login");
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || "Register failed ❌");
    }
  };

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
  };

  // ================= NOTES =================

  const loadNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (token) loadNotes();
  }, [token]);

  const addNote = async () => {
    if (!title || !content) return;

    await API.post("/notes", { title, content, folder });
    setTitle("");
    setContent("");
    loadNotes();
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    loadNotes();
  };

  const exportPDF = (note) => {
    const doc = new jsPDF();
    doc.text(note.title, 10, 10);
    doc.text(note.content, 10, 20);
    doc.save(`${note.title}.pdf`);
  };

  // ================= AUTH SCREEN =================

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl mb-6 font-bold">Smart Notes 🚀</h1>

        {isRegister && (
          <input
            placeholder="Username"
            className="p-2 m-2 text-black rounded"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          className="p-2 m-2 text-black rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="p-2 m-2 text-black rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegister ? (
          <button
            onClick={register}
            className="bg-green-500 px-4 py-2 rounded mt-2"
          >
            Register
          </button>
        ) : (
          <button
            onClick={login}
            className="bg-blue-500 px-4 py-2 rounded mt-2"
          >
            Login
          </button>
        )}

        <p
          className="mt-4 cursor-pointer text-blue-400"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have account? Login"
            : "New user? Register"}
        </p>
      </div>
    );
  }

  // ================= PROFILE VIEW =================

  if (view === "profile") {
    return <Profile setView={setView} />;
  }

  // ================= NOTES SCREEN =================

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Smart Notes 🚀</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setView("profile")}
            className="bg-purple-500 px-4 py-2 rounded"
          >
            Profile
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <input
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded"
      />

      <div className="bg-slate-800 p-6 rounded mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        />

        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        >
          <option>General</option>
          <option>Study</option>
          <option>Work</option>
          <option>Personal</option>
        </select>

        <button
          onClick={addNote}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <p>No notes found 📭</p>
      ) : (
        filteredNotes.map((n) => (
          <div key={n._id} className="bg-white/10 p-4 rounded mb-3">
            <h2 className="font-bold">{n.title}</h2>
            <p>{n.content}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => deleteNote(n._id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => exportPDF(n)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                PDF
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}