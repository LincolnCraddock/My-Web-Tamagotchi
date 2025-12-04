import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import doggoHappy from "./assets/doggo-happy.gif";
import doggoSad from "./assets/doggo-sad.gif";
import doggoWaiting from "./assets/doggo-waiting.gif";
import doggoPetted from "./assets/doggo-petted.gif";
import doggoDead from "./assets/doggo-dead.png";
import doggoIdle from "./assets/doggo-idle.gif";
import "./App.css";

function App() {
  /* Tamagotchi State */
  const [hunger, setHunger] = useState(10); // 0–100 (lower = better)
  const [happiness, setHappiness] = useState(90); // 0–100 (higher = better)
  const [energy, setEnergy] = useState(90); // 0–100 (higher = better)
  const [petName, setPetName] = useState("Doggo");
  const [isAlive, setIsAlive] = useState(true);
  const [isHoveredOver, setIsHoveredOver] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  /* Misc State */
  const [newPetName, setNewPetName] = useState("");
  const [debugMode, setDebugMode] = useState(false);

  /* Keyboard Shortcuts */
  useHotkeys("ctrl+d, cmd+d", (event) => {
    event.preventDefault();
    setDebugMode((prev) => !prev);
    if (debugMode) console.log("Entering debug mode.");
    else console.log("Exiting debug mode.");
  });

  /* Misc Effects */
  useEffect(() => {
    if (!isAlive) return;
    if (!isClicked) return;

    const interval = setInterval(() => {
      setIsClicked(false);
    }, 450);

    return () => clearInterval(interval);
  }, [isClicked]);

  /* Tamagotchi Effects */
  useEffect(() => {
    if (!isAlive) return;

    const interval = setInterval(() => {
      setHunger((h) => {
        const newHunger = Math.min(Math.max(0, h + 2), 100);
        setEnergy((e) => {
          const newEnergy = Math.min(Math.max(0, e - 1), 100);
          setHappiness((h) =>
            Math.min(Math.min(Math.max(0, h - 1), 100 - newHunger), newEnergy)
          ); // happiness goes down
          return newEnergy;
        }); // energy goes down
        return newHunger;
      }); // hunger goes up
    }, 1000);

    return () => clearInterval(interval);
  }, [isAlive, hunger, energy]);

  useEffect(() => {
    if (hunger >= 100 || energy <= 0) {
      setIsAlive(false);
    }
  }, [hunger, energy]);

  /* User Actions */
  function feed() {
    if (!isAlive) return;
    setHunger((h) => Math.max(0, h - 20));
    setEnergy((e) => Math.max(0, e - 2));
  }

  function play() {
    if (!isAlive) return;
    setHappiness((h) => Math.min(100, h + 15));
    setEnergy((e) => Math.max(0, e - 10));
  }

  function rest() {
    if (!isAlive) return;
    setEnergy((e) => Math.min(100, e + 20));
  }

  /* UI */
  return (
    <>
      <h1>Tamagotchi</h1>
      <img
        src={
          !isAlive
            ? doggoDead
            : isClicked
            ? doggoPetted
            : isHoveredOver
            ? doggoWaiting
            : happiness > 70
            ? doggoHappy
            : happiness < 20
            ? doggoSad
            : doggoIdle
        }
        onMouseOver={(e) => setIsHoveredOver(true)}
        onMouseOut={(e) => setIsHoveredOver(false)}
        onClick={() => setIsClicked(true)}
        id="tamagotchiIcon"
      ></img>
      {debugMode && (
        <>
          <p>Hunger: {hunger}</p>
          <p>Energy: {energy}</p>
          <p>Happiness: {happiness}</p>
        </>
      )}
      <div className="card">
        {isAlive && (
          <>
            <h2>Actions</h2>
            <button onClick={feed}>Feed {petName}</button>
            <button onClick={play}>Play with {petName}</button>
            <button onClick={rest}>Put {petName} to sleep</button>
            <input
              id="renameField"
              type="text"
              placeholder={petName}
              value={newPetName}
              onChange={(e) => setNewPetName(e.currentTarget.value)}
            ></input>
            <button
              onClick={() => {
                setPetName(newPetName);
                setNewPetName("");
              }}
              disabled={newPetName == ""}
            >
              {newPetName == ""
                ? `Rename ${petName}`
                : `Rename ${petName} to ${newPetName}`}
            </button>
          </>
        )}
        {!isAlive && (
          <>
            <h2>Your pet has died</h2>
          </>
        )}
      </div>
    </>
  );
}

export default App;
