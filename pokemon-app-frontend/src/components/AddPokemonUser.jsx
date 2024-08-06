import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AddPokemonUser.css'

function AddPokemonUser() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonAbility, setPokemonAbility] = useState("");
  const [pokemonOwnerName, setPokemonOwnerName] = useState("");
  const [initialPositionX, setInitialPositionX] = useState("");
  const [initialPositionY, setInitialPositionY] = useState("");
  const [speed, setSpeed] = useState("");
  const [direction, setDirection] = useState("");
  const [pokemons, setPokemons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Pokémon list for the dropdown
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=100")
      .then((response) => {
        setPokemons(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokémon list:", error);
      });
  }, []);

  const handleAddUser = () => {
    const newPokemon = {
      pokemonOwnerName,
      pokemonName,
      pokemonAbility,
      initialPositionX,
      initialPositionY,
      speed,
      direction,
    };

    axios
      .post("http://localhost:5000/addpokemon", newPokemon)
      .then((response) => {
        console.log("Pokemon added successfully:", response.data);
        navigate(`/listuser`);
      })
      .catch((error) => {
        console.error("There was an error adding the pokemon:", error);
      });
  };

  const handlePokemonChange = (e) => {
    const name = e.target.value;
    setPokemonName(name);

    if (name) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((response) => {
          const abilities = response.data.abilities;
          if (abilities.length > 0) {
            setPokemonAbility(abilities[0].ability.name);
          } else {
            setPokemonAbility("");
          }
        })
        .catch((error) => {
          console.error("Error fetching Pokémon ability:", error);
        });
    } else {
      setPokemonAbility("");
    }
  };
  return (
    <>
      <div className="form-block">
        <h1>Create Pokemon User</h1>
        <div className="form">
          <form>
            <div>
              <input
                type="text"
                value={pokemonOwnerName}
                onChange={(e) => setPokemonOwnerName(e.target.value)}
                placeholder="PokemonOwnerName"
              />
            </div>
            <div>
              <select value={pokemonName} onChange={handlePokemonChange}>
                <option value="">Select a Pokemon</option>
                {pokemons.map((pokemon) => (
                  <option key={pokemon.name} value={pokemon.name}>
                    {pokemon.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={pokemonAbility}
                placeholder="PokemonAbility"
              />
            </div>
            <div>
              <input
                type="number"
                value={initialPositionX}
                onChange={(e) => setInitialPositionX(e.target.value)}
                placeholder="Initial Position X:"
              />
            </div>
            <div>
              <input
                type="number"
                value={initialPositionY}
                onChange={(e) => setInitialPositionY(e.target.value)}
                placeholder="Initial Position Y:"
              />
            </div>
            <div>
              <input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="Speed"
              />
            </div>
            <div>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                placeholder="Direction"
              />
            </div>
            <button type="button" onClick={handleAddUser}>
              Add User
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddPokemonUser;
