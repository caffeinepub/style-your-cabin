import { useState } from "react";
import StockOnboarding from "./pages/StockOnboarding";
import StockSimApp from "./pages/StockSimApp";

const LS_PLAYER_NAME = "streetsim_player_name";
const LS_STARTING_CAPITAL = "streetsim_starting_capital";

export default function App() {
  const [playerName, setPlayerName] = useState<string | null>(() => {
    return localStorage.getItem(LS_PLAYER_NAME);
  });
  const [startingCapital, setStartingCapital] = useState<number>(() => {
    const stored = localStorage.getItem(LS_STARTING_CAPITAL);
    return stored ? Number(stored) : 10000;
  });

  const handleStart = (name: string, capital: number) => {
    localStorage.setItem(LS_PLAYER_NAME, name);
    localStorage.setItem(LS_STARTING_CAPITAL, String(capital));
    setStartingCapital(capital);
    setPlayerName(name);
  };

  const handleReset = () => {
    localStorage.removeItem(LS_PLAYER_NAME);
    localStorage.removeItem(LS_STARTING_CAPITAL);
    localStorage.removeItem("streetsim_player");
    localStorage.removeItem("streetsim_prices");
    setPlayerName(null);
  };

  if (!playerName) {
    return <StockOnboarding onStart={handleStart} />;
  }

  return (
    <StockSimApp
      playerName={playerName}
      startingCapital={startingCapital}
      onReset={handleReset}
    />
  );
}
