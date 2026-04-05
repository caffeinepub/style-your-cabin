import { useState } from "react";
import StockOnboarding from "./pages/StockOnboarding";
import StockSimApp from "./pages/StockSimApp";

const LS_PLAYER_NAME = "streetsim_player_name";

export default function App() {
  const [playerName, setPlayerName] = useState<string | null>(() => {
    return localStorage.getItem(LS_PLAYER_NAME);
  });

  const handleStart = (name: string) => {
    localStorage.setItem(LS_PLAYER_NAME, name);
    setPlayerName(name);
  };

  const handleReset = () => {
    localStorage.removeItem("streetsim_player_name");
    localStorage.removeItem("streetsim_player");
    localStorage.removeItem("streetsim_prices");
    setPlayerName(null);
  };

  if (!playerName) {
    return <StockOnboarding onStart={handleStart} />;
  }

  return <StockSimApp playerName={playerName} onReset={handleReset} />;
}
