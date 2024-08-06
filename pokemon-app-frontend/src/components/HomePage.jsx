import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pokemons, setPokemons] = useState([]);
  const [pokemonPositions, setPokemonPositions] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all users
    fetch("https://apexplus.vercel.app/viewusers")
      .then((response) => response.json())
      .then((data) => {
        const uniqueUsers = Array.from(
          new Set(data.map((user) => user.pokemonOwnerName))
        );
        setUsers(uniqueUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Fetch Pokémon for the selected user
      fetch(`https://apexplus.vercel.app/viewpokemon/${selectedUser}`)
        .then((response) => response.json())
        .then((data) => {
          setPokemons(data);
          const positions = data.reduce((acc, pokemon) => {
            acc[pokemon._id] = {
              left: pokemon.initialPositionX,
              top: pokemon.initialPositionY,
              visible: true,
              frozen: false,
            };
            return acc;
          }, {});
          setPokemonPositions(positions);
        })
        .catch((error) => console.error("Error fetching Pokémon:", error));
    }
  }, [selectedUser]);

  const handleGo = () => {
    if (isFrozen) return; // If Pokémon are frozen, do nothing

    const newPositions = { ...pokemonPositions };
    pokemons.forEach((pokemon) => {
      if (!newPositions[pokemon._id].frozen) {
        const speed = pokemon.speed;
        const direction = pokemon.direction.toLowerCase();
        if (direction === "north") newPositions[pokemon._id].top -= speed;
        if (direction === "south") newPositions[pokemon._id].top += speed;
        if (direction === "east") newPositions[pokemon._id].left += speed;
        if (direction === "west") newPositions[pokemon._id].left -= speed;

        // Ensure Pokémon is within bounds
        if (
          newPositions[pokemon._id].left < 0 ||
          newPositions[pokemon._id].left > 980 || // Updated width - Pokémon width
          newPositions[pokemon._id].top < 0 ||
          newPositions[pokemon._id].top > 330 // Updated height - Pokémon height
        ) {
          newPositions[pokemon._id].visible = false;
        } else {
          newPositions[pokemon._id].visible = true;
        }
      }
    });
    setPokemonPositions(newPositions);
  };

  const handleFlee = () => {
    setIsVisible(!isVisible);
  };

  const handleCease = () => {
    setIsFrozen(!isFrozen);
    // When unfreezing, make sure to reset the frozen state of Pokémon
    if (isFrozen) {
      const resetPositions = { ...pokemonPositions };
      Object.keys(resetPositions).forEach((id) => {
        resetPositions[id].frozen = false;
      });
      setPokemonPositions(resetPositions);
    }
  };

  const handleAddUser = () => {
    navigate('/adduser');
  };

  const handleListUser = () => {
    navigate('/listuser');
  };

  return (
    <div className="container">
      <h1>Home Page</h1>
      <div className="btn-container">
        <button onClick={handleAddUser}>Add User</button>
        <button onClick={handleListUser}>List User</button>
      </div>
      <div className="dropdownContainer">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="dropdown"
        >
          <option value="">Select a Pokémon Owner</option>
          {users.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>Pokémon Name</th>
                <th>Ability</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {pokemons.map((pokemon) => (
                <tr key={pokemon._id}>
                  <td>{pokemon.pokemonName}</td>
                  <td>{pokemon.pokemonAbility}</td>
                  <td>{pokemon.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="buttonContainer">
        <button onClick={handleGo}>Pokémon Go</button>
        <button onClick={handleFlee}>Pokémon Flee</button>
        <button onClick={handleCease}>
          {isFrozen ? "Resume" : "Pokémon Cease"}
        </button>
      </div>
      <div className="pokemonField">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon._id}
            className="pokemon"
            style={{
              left: `${pokemonPositions[pokemon._id]?.left}px`,
              top: `${pokemonPositions[pokemon._id]?.top}px`,
              display:
                pokemonPositions[pokemon._id]?.visible && isVisible
                  ? "block"
                  : "none",
            }}
          >
            🟡
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
