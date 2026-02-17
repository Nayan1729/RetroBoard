import { useState } from "react";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

const COLOR_MAP = {
  "went-well": "bg-went-well",
  improve: "bg-improve",
  action: "bg-action",
};

export default function Column({
  columnKey,
  title,
  color,
  cards,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [showForm, setShowForm] = useState(false);

  function handleSave(text) {
    onAdd(text);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col bg-surface-light/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <span
          className={`w-2.5 h-2.5 rounded-full ${COLOR_MAP[color] || "bg-gray-400"}`}
        />
        <h2 className="text-sm font-semibold text-white flex-1">{title}</h2>
        <span className="text-xs text-gray-500">{cards.length}</span>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {showForm ? (
          <AddCardForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-border-hover text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
}
