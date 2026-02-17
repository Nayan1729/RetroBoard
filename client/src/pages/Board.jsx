import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import Column from "../components/Column";

const COLUMNS = [
  { key: "went-well", title: "What Went Well", color: "went-well" },
  { key: "improve", title: "What to Improve", color: "improve" },
  { key: "action", title: "Action Items", color: "action" },
];

export default function Board() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { cards, connected, sendMessage } = useWebSocket(roomId);
  const boardRef = useRef(null);

  function handleAdd(column, text) {
    sendMessage({ type: "add", column, text });
  }

  function handleEdit(id, text) {
    sendMessage({ type: "edit", id, text });
  }

  function handleDelete(id) {
    sendMessage({ type: "delete", id });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleExportPdf() {
    document.title = `retro-${roomId}`;
    window.print();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold text-white">RetroBoard</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                connected
                  ? "bg-emerald-400 animate-pulse-dot"
                  : "bg-red-400"
              }`}
            />
            {connected ? "Connected" : "Reconnecting..."}
          </span>

          <button
            onClick={handleCopyLink}
            title="Copy room link"
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-border hover:border-border-hover text-xs text-gray-300 font-mono transition-colors cursor-pointer"
          >
            {roomId}
          </button>

          <button
            onClick={handleExportPdf}
            className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Save as PDF
          </button>
        </div>
      </header>

      <main
        ref={boardRef}
        className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 p-6"
      >
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            columnKey={col.key}
            title={col.title}
            color={col.color}
            cards={cards.filter((c) => c.column === col.key)}
            onAdd={(text) => handleAdd(col.key, text)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </main>
    </div>
  );
}
