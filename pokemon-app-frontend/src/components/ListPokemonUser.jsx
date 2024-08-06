import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../styles/ListPokemonUser.css";

function ListPokemonUser() {
  const [usersWithPokemons, setUsersWithPokemons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of Pokémon from the backend
    axios
      .get("https://apexplus.vercel.app/viewallusers") // Ensure this matches your backend route
      .then((response) => {
        console.log("Fetched Pokémon data:", response.data); // Log the response to see the structure
        setUsersWithPokemons(response.data);
      })
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  const handleAddPokemon = (userId) => {
    navigate(`/addpokemon/${userId}`);
  };

  const handleEdit = (pokemonId) => {
    navigate(`/editpokemon/${pokemonId}`);
  };

  const handleDelete = (pokemonId) => {
    axios
      .delete(`https://apexplus.vercel.app/deletepokemon/${pokemonId}`)
      .then(() => {
        setUsersWithPokemons(
          usersWithPokemons.map((userWithPokemons) => ({
            ...userWithPokemons,
            pokemons: userWithPokemons.pokemons.filter(
              (pokemon) => pokemon._id !== pokemonId
            ),
          }))
        );
      })
      .catch((error) => console.error("Error deleting Pokémon:", error));
  };

  const handleDeleteAll = () => {
    axios
      .delete("https://apexplus.vercel.app/deleteallusers")
      .then(() => {
        setUsersWithPokemons([]);
      })
      .catch((error) => console.error("Error deleting all Pokémon:", error));
  };

  return (
    <div className="container">
      <h1>List of Pokémon Users</h1>
      <div className="btn-container">
        <button onClick={handleDeleteAll}>Delete All</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Pokemon Owner Name</th>
              <th>Pokemon Name</th>
              <th>Ability</th>
              <th>Position X</th>
              <th>Position Y</th>
              <th>Speed</th>
              <th>Direction</th>
              <th>+</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usersWithPokemons) &&
              usersWithPokemons.flatMap((userWithPokemons) =>
                userWithPokemons.pokemons.map((pokemon) => (
                  <tr key={pokemon._id}>
                    <td>{userWithPokemons.user.pokemonOwnerName}</td>
                    <td>{pokemon.pokemonName}</td>
                    <td>{pokemon.pokemonAbility}</td>
                    <td>{pokemon.initialPositionX}</td>
                    <td>{pokemon.initialPositionY}</td>
                    <td>{pokemon.speed}</td>
                    <td>{pokemon.direction}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleAddPokemon(userWithPokemons.user._id)
                        }
                      >
                        +
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(pokemon._id)}>
                        <FaUserEdit />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(pokemon._id)}>
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPokemonUser;
