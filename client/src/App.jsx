import { useState, useEffect } from "react";
import API from "./api";
import jsPDF from "jspdf";

const categories = [
  "General",
  "DSA",
  "OS",
  "Networks",
  "AI",
  "Math",
  "Projects",
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const [dark, setDark] = useState(true);
  const theme = dark
    ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white"
    : "bg-gray-100 text-black";

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [summaryId, setSummaryId] = useState(null);

  // 🧠 AI Summary
  const summarize = (text) => {
    if (!text) return "";
    const sentences = text.split(".");
    return sentences.slice(0, 2).join(".") + "...";
  };

  // 📄 PDF Export
  const exportPDF = (note) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(note.title, 10, 20);

    doc.setFontSize(12);
    doc.text(`Category: ${note.category || "General"}`, 10, 30);

    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(note.content, 180);
    doc.text(splitText, 10, 45);

    doc.save(`${note.title}.pdf`);
  };

  const filteredNotes = notes.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      filter === "All" || n.category === filter;

    return matchSearch && matchCategory;
  });

  // AUTH
  const register = async () => {
    try {
      setLoading(true);
      await API.post("/auth/register", { username, email, password });
      alert("Registered successfully ✅ Now login");
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || "Register failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
  };

  // NOTES
  const loadNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch {
      logout();
    }
  };

  const saveNote = async () => {
    if (!title || !content) return;
    setLoading(true);

    try {
      if (editingId) {
        await API.put(`/notes/${editingId}`, {
          title,
          content,
          category,
        });
        setEditingId(null);
      } else {
        await API.post("/notes", {
          title,
          content,
          category,
        });
      }

      setTitle("");
      setContent("");
      setCategory("General");
      loadNotes();
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    loadNotes();
  };

  useEffect(() => {
    if (token) loadNotes();
  }, [token]);

  // AUTH SCREEN
  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme}`}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-80 shadow text-center">
          <h1 className="text-3xl font-bold mb-6">Smart Notes 🚀</h1>

          {isRegister && (
            <input
              placeholder="Username"
              className="w-full p-2 mb-2 text-black rounded"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            className="w-full p-2 mb-2 text-black rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full p-2 mb-2 text-black rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={isRegister ? register : login}
            disabled={loading}
            className="bg-blue-600 w-full py-2 rounded mt-2"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>

          <p
            className="mt-4 cursor-pointer text-blue-400 text-sm"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have account? Login"
              : "New user? Register"}
          </p>
        </div>
      </div>
    );
  }

  // NOTES SCREEN
  return (
    <div className={`min-h-screen p-8 ${theme}`}>
      <div className="flex justify-between items-center max-w-xl mx-auto mb-6">
        <h1 className="text-4xl font-bold">Smart Notes 🚀</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="bg-gray-500 px-3 py-2 rounded"
          >
            {dark ? "Light" : "Dark"}
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-4">
        <input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 text-black rounded"
        />
      </div>

      {/* Category Filter */}
      <div className="max-w-xl mx-auto mb-4 flex gap-2 flex-wrap">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded ${
              filter === c ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        />

        <button
          onClick={saveNote}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </div>

      {/* Notes */}
      <div className="max-w-xl mx-auto mt-6 space-y-3">
        {filteredNotes.map((n) => (
          <div
            key={n._id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-xl"
          >
            <span className="text-xs bg-indigo-600 px-2 py-1 rounded mr-2">
              {n.category || "General"}
            </span>

            <h2 className="font-bold">{n.title}</h2>
            <p>{n.content}</p>

            {summaryId === n._id && (
              <div className="mt-2 text-sm bg-blue-900/40 p-2 rounded">
                🤖 Summary: {summarize(n.content)}
              </div>
            )}

            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                onClick={() => {
                  setTitle(n.title);
                  setContent(n.content);
                  setCategory(n.category || "General");
                  setEditingId(n._id);
                }}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNote(n._id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setSummaryId(n._id)}
                className="bg-purple-600 px-3 py-1 rounded"
              >
                AI Summary
              </button>

              <button
                onClick={() => exportPDF(n)}
                className="bg-green-600 px-3 py-1 rounded"
              >
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}