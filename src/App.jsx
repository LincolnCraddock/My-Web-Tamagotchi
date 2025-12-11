import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { clamp } from "./Utils.js";
import "./App.css";

const resourceURL = "https://lincolncraddock.github.io/";

function App() {
  /* Tamagotchi State */
  const [petStatus, setPetStatus] = useState({
    hunger: 10,
    energy: 90,
    happiness: 90,
  });
  const [petName, setPetName] = useState("Doggo");
  const [isAlive, setIsAlive] = useState(true);
  const [age, setAge] = useState(0);

  /* Data from JSON */
  const [petData, setPetData] = useState({
    hungerRate: 0,
    energyRate: 0,
    happinessRate: 0,
  });
  const [buttons, setButtons] = useState([]);
  const [clickData, setClickData] = useState({});
  const [animationRules, setAnimationRules] = useState({});

  /* Misc State */
  const [isHoveredOver, setIsHoveredOver] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [newPetName, setNewPetName] = useState("");

  const [debugMode, setDebugMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // use this for indexing values of state (e.g. `state["isAlive"]`)
  const state = {
    isAlive: isAlive,
    hunger: petStatus.hunger,
    happiness: petStatus.happiness,
    energy: petStatus.energy,
    isClicked: isClicked,
    isHoveredOver: isHoveredOver,
    age: age,
  };

  /* Helper Functions */
  function getAnimationImage() {
    for (const rule of animationRules) {
      const match = rule.conditions.every((cond) => {
        const value = state[cond.var];
        if ("eq" in cond && value !== cond.eq) return false;
        if ("gt" in cond && value <= cond.gt) return false;
        if ("lt" in cond && value >= cond.lt) return false;
        if ("gte" in cond && value < cond.gte) return false;
        if ("lte" in cond && value > cond.lte) return false;
        return true;
      });
      if (match) return resourceURL + rule.image;
    }
    return "/src/assets/default-icon.gif";
  }

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

    buttonClick(clickData);
    const interval = setInterval(() => {
      setIsClicked(false);
    }, 450);

    return () => clearInterval(interval);
  }, [isAlive, isClicked]);

  useEffect(() => {
    fetch(resourceURL + "tamagotchi.json")
      .then((res) => res.json())
      .then((data) => {
        const c = data.tamagotchi[0];

        setPetName(c.name);
        setPetData({
          hungerRate: c.hungerRate,
          energyRate: c.energyRate,
          happinessRate: c.happinessRate,
        });

        setButtons(
          c.buttons.map((btn) => ({
            name: btn.name,
            hungerChange: btn.hungerChange ?? 0,
            energyChange: btn.energyChange ?? 0,
            happinessChange: btn.happinessChange ?? 0,
          }))
        );
        setClickData({
          hungerChange: c.click.hungerChange ?? 0,
          energyChange: c.click.energyChange ?? 0,
          happinessChange: c.click.happinessChange ?? 0,
        });

        setAnimationRules(c.animation);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tamagotchi.json:", err);
      });
  }, []);

  /* Tamagotchi Effects */
  useEffect(() => {
    if (!isAlive) return;

    const interval = setInterval(() => {
      setPetStatus((p) => {
        const ret = {
          hunger: clamp(0, p.hunger + petData.hungerRate, 100),
          energy: clamp(0, p.energy - petData.energyRate, 100),
          happiness: clamp(0, p.happiness - petData.happinessRate, [
            100 - p.hunger,
            p.energy,
          ]),
        };
        return ret;
      });
      setAge((a) => a + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAlive, petData]);

  useEffect(() => {
    if (petStatus.hunger >= 100 || petStatus.energy <= 0) {
      setIsAlive(false);
    }
  }, [petStatus]);

  function buttonClick(buttonData) {
    if (!isAlive) return;

    setPetStatus((p) => {
      const ret = {
        hunger: clamp(0, p.hunger + buttonData.hungerChange, 100),
        energy: clamp(0, p.energy + buttonData.energyChange, 100),
        happiness: clamp(0, p.happiness + buttonData.happinessChange, [
          100 - p.hunger,
          p.energy,
        ]),
      };
      return ret;
    });
  }

  /* UI */
  if (loading) return <p>Loading…</p>;

  return (
    <>
      <h1>{petName}</h1>
      <img
        src={getAnimationImage()}
        onMouseOver={() => setIsHoveredOver(true)}
        onMouseOut={() => setIsHoveredOver(false)}
        onClick={() => setIsClicked(true)}
        id="tamagotchiIcon"
      ></img>
      {debugMode && (
        <>
          <p>Hunger: {petStatus.hunger}</p>
          <p>Energy: {petStatus.energy}</p>
          <p>Happiness: {petStatus.happiness}</p>
        </>
      )}
      <div className="card">
        {isAlive && (
          <>
            {buttons.map((button, i) => (
              <button key={i} onClick={() => buttonClick(button)}>
                {button.name.replace("_", petName)}
              </button>
            ))}
            <br></br>
            <br></br>
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
            <h2>{petName} has died</h2>
          </>
        )}
      </div>
    </>
  );
}

export default App;
