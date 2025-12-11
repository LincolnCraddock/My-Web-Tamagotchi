import { Routes, Route } from "react-router-dom";
import TamagotchiSelect from "./TamagotchiSelect.jsx";
import Tamagotchi from "./Tamagotchi.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TamagotchiSelect />} />
      <Route path="/play/:id" element={<Tamagotchi />} />
    </Routes>
  );
}
