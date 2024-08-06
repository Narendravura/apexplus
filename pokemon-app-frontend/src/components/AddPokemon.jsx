import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddPokemonUser.css';

const AddPokemon = () => {
  const [pokemonOwners, setPokemonOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonAbility, setPokemonAbility] = useState('');
  const [pokemonNumber, setPokemonNumber] = useState('');
  const [pokemons, setPokemons] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Pokémon owners list
    axios.get('https://apexplus.vercel.app/viewusers') // Ensure this endpoint is correct
      .then(response => {
        // Assuming the response data is an array of users
        setPokemonOwners(response.data.map(user => ({
          id: user._id,
          name: user.pokemonOwnerName
        })));
      })
      .catch(error => console.error('Error fetching Pokémon owners:', error));
    
    // Fetch Pokémon list for the dropdown
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=100')
      .then(response => setPokemons(response.data.results))
      .catch(error => console.error('Error fetching Pokémon list:', error));
  }, []);

  const handleAddPokemon = () => {
    const newPokemon = {
      pokemonName,
      pokemonAbility,
      pokemonOwnerName: selectedOwner,
      initialPositionX: 0, // Replace with actual value if needed
      initialPositionY: 0, // Replace with actual value if needed
      speed: 0, // Replace with actual value if needed
      direction: '' // Replace with actual value if needed
    };

    // Create new Pokémon
    axios.post('https://apexplus.vercel.app/addpokemon', newPokemon)
      .then(response => {
        console.log('Pokémon added successfully:', response.data);
        navigate('/listuser'); // Redirect to Pokémon list page
      })
      .catch(error => console.error('Error adding Pokémon:', error));
  };

  const handlePokemonChange = (e) => {
    const name = e.target.value;
    setPokemonName(name);

    if (name) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => {
          const abilities = response.data.abilities;
          if (abilities.length > 0) {
            setPokemonAbility(abilities[0].ability.name);
          } else {
            setPokemonAbility('');
          }
        })
        .catch(error => console.error('Error fetching Pokémon ability:', error));
    } else {
      setPokemonAbility('');
    }
  };

  return (
    <div className="form-block">
      <h1>Add Pokémon</h1>
      <div className="form">
        <form>
          <div>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              required
            >
              <option value="">Select Pokémon Owner</option>
              {pokemonOwners.map(owner => (
                <option key={owner.id} value={owner.name}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={pokemonName}
              onChange={handlePokemonChange}
              required
            >
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
              type="text"
              value={pokemonNumber}
              onChange={(e) => setPokemonNumber(e.target.value)}
              placeholder="Pokémon Number"
            />
          </div>
          <button type="button" onClick={handleAddPokemon}>
            Add Pokémon
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPokemon;
