import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Board from "./pages/Board";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/room/:roomId" element={<Board />} />
    </Routes>
  );
}
