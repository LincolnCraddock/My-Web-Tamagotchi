import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const resourceURL = "https://lincolncraddock.github.io/";

export default function SelectTamagotchi() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(resourceURL + "tamagotchi.json")
      .then((res) => res.json())
      .then((data) => {
        setPets(data.tamagotchi);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tamagotchi.json:", err);
      });
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <h1>Select Your Tamagotchi</h1>
      <div className="grid">
        {pets.map((pet, i) => (
          <Link key={i} to={`/play/${i}`} className="grid-tile">
            <h2>{pet.name}</h2>
            {pet.icon ? (
              <div className="circularGlow">
                <img src={resourceURL + pet.icon} className="tamagotchiIcon" />
              </div>
            ) : (
              "/src/assets/default-icon.gif"
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
