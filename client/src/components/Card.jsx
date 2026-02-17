import { useState } from "react";

export default function Card({ card, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.text);

  function handleSave() {
    const trimmed = text.trim();
    if (trimmed && trimmed !== card.text) {
      onEdit(card.id, trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setText(card.text);
      setEditing(false);
    }
  }

  return (
    <div className="animate-card-in group bg-surface-card border border-border hover:border-border-hover rounded-xl p-4 transition-all">
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-accent transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setText(card.text);
                setEditing(false);
              }}
              className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed cursor-pointer"
            onClick={() => setEditing(true)}
          >
            {card.text}
          </p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <span className="text-[10px] text-gray-600">
              {new Date(card.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              onClick={() => onDelete(card.id)}
              className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-500 hover:text-danger transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
