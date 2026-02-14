import { useState, useEffect } from "react";
import API from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const login = async () => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    loadNotes();
  };

  const loadNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data);
  };

  const addNote = async () => {
    await API.post("/notes", { title, content });
    setTitle("");
    setContent("");
    loadNotes();
  };

  useEffect(() => {
    if (token) loadNotes();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl mb-6">Smart Notes 🚀</h1>

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

        <button
          onClick={login}
          className="bg-blue-500 px-4 py-2 rounded mt-2"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl mb-6 text-center">Smart Notes 🚀</h1>

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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
