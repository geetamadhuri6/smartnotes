import { useEffect, useState } from "react";
import API from "./api";

function App() {
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

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Smart Notes 🚀
      </h1>

      {/* Add Note Panel */}
      <div className="bg-slate-800 p-6 rounded-xl shadow mb-8 max-w-xl mx-auto">
        <input
          className="w-full mb-3 p-3 rounded bg-slate-700"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full mb-3 p-3 rounded bg-slate-700"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={addNote}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <p>No notes found 😢</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-slate-800 p-5 rounded-xl shadow hover:scale-105 transition"
            >
              <h2 className="text-xl font-bold mb-2">{note.title}</h2>
              <p className="mb-4 text-slate-300">{note.content}</p>
              <button
                onClick={() => deleteNote(note._id)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
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

export default App;