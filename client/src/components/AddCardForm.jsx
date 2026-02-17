import { useState, useRef, useEffect } from "react";

export default function AddCardForm({ onSave, onCancel }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-card border border-accent/30 rounded-xl p-4 space-y-3 animate-card-in"
    >
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Type your thought..."
        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white resize-none placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
}
