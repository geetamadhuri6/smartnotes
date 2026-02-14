import { useEffect, useState } from "react";
import API from "./api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    await API.post("/notes", { title, content });
    setTitle("");
    setContent("");
    fetchNotes();
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-4">Smart Notes 🚀</h1>

      <input
        placeholder="Title"
        className="p-2 mb-2 w-full bg-gray-800 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        className="p-2 mb-2 w-full bg-gray-800 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={addNote}
        className="bg-blue-500 px-4 py-2 rounded mb-4"
      >
        Add Note
      </button>

      {notes.length === 0 ? (
        <p>No notes found 😢</p>
      ) : (
        notes.map((n) => (
          <div key={n._id} className="bg-gray-800 p-3 mb-2 rounded">
            <h3>{n.title}</h3>
            <p>{n.content}</p>
          </div>
        ))
      )}
    </div>
  );
}