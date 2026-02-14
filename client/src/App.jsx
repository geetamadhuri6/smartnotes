import { useState, useEffect } from "react";
import API from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ================= REGISTER =================
  const register = async () => {
    try {
      await API.post("/auth/register", { username, email, password });
      alert("Registered successfully ✅ Now login");
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || "Register failed ❌");
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      alert("Login success ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
  };

  // ================= LOAD NOTES =================
  const loadNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch {
      logout(); // token invalid → auto logout
    }
  };

  // ================= ADD NOTE =================
  const addNote = async () => {
    if (!title || !content) return;

    await API.post("/notes", { title, content });
    setTitle("");
    setContent("");
    loadNotes();
  };

  // ================= DELETE NOTE =================
  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    loadNotes();
  };

  useEffect(() => {
    if (token) loadNotes();
  }, [token]);

  // ================= AUTH SCREEN =================
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl mb-6">Smart Notes 🚀</h1>

        {isRegister && (
          <input
            placeholder="Username"
            className="p-2 m-2 text-black"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          className="p-2 m-2 text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="p-2 m-2 text-black"
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

  // ================= NOTES SCREEN =================
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center max-w-xl mx-auto mb-6">
        <h1 className="text-4xl">Smart Notes 🚀</h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 text-black"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 text-black"
        />

        <button
          onClick={addNote}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      <div className="max-w-xl mx-auto mt-6">
        {notes.length === 0 ? (
          <p>No notes found 😢</p>
        ) : (
          notes.map((n) => (
            <div key={n._id} className="bg-slate-800 p-4 mb-2 rounded">
              <h2 className="font-bold">{n.title}</h2>
              <p>{n.content}</p>

              <button
                onClick={() => deleteNote(n._id)}
                className="bg-red-500 px-3 py-1 mt-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}