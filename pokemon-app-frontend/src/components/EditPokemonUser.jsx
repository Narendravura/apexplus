import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddPokemonUser.css";

function EditPokemonUser() {
  const { pokemonId } = useParams(); // Get Pokémon ID from URL parameters
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

  useEffect(() => {
    // Fetch the existing Pokémon data
    axios
      .get(`https://apexplus.vercel.app/viewpokemondetails/${pokemonId}`)
      .then((response) => {
        console.log("Fetched Pokémon data:", response.data); // Debug line
        const {
          pokemonName,
          pokemonAbility,
          initialPositionX,
          initialPositionY,
          speed,
          direction,
          userId,
        } = response.data;
        const pokemonOwnerName = userId ? userId.pokemonOwnerName : ""; // Extract pokemonOwnerName from userId
        setPokemonName(pokemonName);
        setPokemonAbility(pokemonAbility);
        setPokemonOwnerName(pokemonOwnerName);
        setInitialPositionX(initialPositionX);
        setInitialPositionY(initialPositionY);
        setSpeed(speed);
        setDirection(direction);
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }, [pokemonId]);

  const handleUpdatePokemon = () => {
    const updatedPokemon = {
      pokemonName,
      pokemonAbility,
      pokemonOwnerName,
      initialPositionX,
      initialPositionY,
      speed,
      direction,
    };

    axios
      .patch(`https://apexplus.vercel.app/updatepokemon/${pokemonId}`, updatedPokemon)
      .then((response) => {
        console.log("Pokemon updated successfully:", response.data);
        navigate(`/listuser`); // Redirect to the user's Pokémon list
      })
      .catch((error) => {
        console.error("There was an error updating the Pokémon:", error);
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
    <div className="form-block">
      <h1>Edit Pokemon User</h1>
      <div className="form">
        <form>
          <div>
            <input
              type="text"
              value={pokemonOwnerName}
              placeholder="Pokémon Owner Name"
              readOnly
            />
          </div>
          <div>
            <select value={pokemonName} onChange={handlePokemonChange}>
              <option value="">Select a Pokémon</option>
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
              placeholder="Pokémon Ability"
              readOnly
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
          <button type="button" onClick={handleUpdatePokemon}>
            Update Pokémon
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPokemonUser;
