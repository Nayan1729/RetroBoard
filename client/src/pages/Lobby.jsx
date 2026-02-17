import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Lobby() {
  const [joinId, setJoinId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleCreate() {
    const roomId = uuidv4().slice(0, 8);
    navigate(`/room/${roomId}`);
  }

  function handleJoin(e) {
    e.preventDefault();
    const trimmed = joinId.trim();
    if (!trimmed) {
      setError("Please enter a room ID");
      return;
    }
    navigate(`/room/${trimmed}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            RetroBoard
          </h1>
          <p className="text-sm text-gray-400">
            Run sprint retrospectives with your team in real time.
          </p>
        </div>

        <div className="bg-surface-light/60 backdrop-blur-md border border-border rounded-2xl p-8 space-y-8">
          <div>
            <button
              onClick={handleCreate}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Create New Room
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-border" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              or join existing
            </span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleJoin} className="space-y-3">
            <input
              type="text"
              value={joinId}
              onChange={(e) => {
                setJoinId(e.target.value);
                setError("");
              }}
              placeholder="Enter room ID"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
            {error && (
              <p className="text-xs text-danger pl-1">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-border hover:border-border-hover transition-colors cursor-pointer"
            >
              Join Room
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          No sign-up required. Share the room ID with your team.
        </p>
      </div>
    </div>
  );
}
