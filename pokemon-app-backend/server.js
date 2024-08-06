const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin:["https://apexplus-assignmnt.vercel.app"],
  methods:["POST","GET","PUT","PATCH","DELETE"],
  credentials:true
}));

// Connect to MongoDB
mongoose.connect("mongodb+srv://narendravura55:AiMDAjif7fa2LPBe@pokemon.wuncowe.mongodb.net/?retryWrites=true&w=majority&appName=pokemon")
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define the User schema and model
const userSchema = new mongoose.Schema({
  pokemonOwnerName: { type: String, unique: true }
});
const User = mongoose.model('User', userSchema);

// Define the Pokémon schema and model
const pokemonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pokemonName: String,
  pokemonAbility: String,
  initialPositionX: Number,
  initialPositionY: Number,
  speed: Number,
  direction: String
});
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// Route to add a Pokémon
app.post('/addpokemon', async (req, res) => {
  const {
    pokemonOwnerName,
    direction,
    initialPositionX,
    pokemonName,
    pokemonAbility,
    initialPositionY,
    speed
  } = req.body;

  try {
    let user = await User.findOne({ pokemonOwnerName });
    if (!user) {
      user = new User({ pokemonOwnerName });
      await user.save();
    }

    const pokemon = new Pokemon({
      userId: user._id,
      pokemonName,
      pokemonAbility,
      initialPositionX,
      initialPositionY,
      speed,
      direction
    });
    await pokemon.save();

    res.status(201).json({ message: 'Pokémon added successfully' });
  } catch (err) {
    console.error('Error adding Pokémon:', err);
    res.status(500).json({ message: 'Error adding Pokémon' });
  }
});

// PATCH endpoint to update a Pokémon
app.patch('/updatepokemon/:pokemonId', async (req, res) => {
  const { pokemonId } = req.params;
  const { pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction } = req.body;

  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(pokemonId, {
      pokemonName,
      pokemonAbility,
      initialPositionX,
      initialPositionY,
      speed,
      direction
    }, { new: true }).populate('userId', 'pokemonOwnerName');

    if (!updatedPokemon) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }

    res.status(200).json(updatedPokemon);
  } catch (err) {
    console.error('Error updating Pokémon:', err);
    res.status(500).json({ message: 'Error updating Pokémon' });
  }
});

// DELETE endpoint to delete a Pokémon
app.delete('/deletepokemon/:pokemonId', async (req, res) => {
  const { pokemonId } = req.params;

  try {
    await Pokemon.findByIdAndDelete(pokemonId);
    res.status(200).json({ message: 'Pokémon deleted successfully' });
  } catch (err) {
    console.error('Error deleting Pokémon:', err);
    res.status(500).json({ message: 'Error deleting Pokémon' });
  }
});

// DELETE endpoint to delete all users and their Pokémon
app.delete('/deleteallusers', async (req, res) => {
  try {
    await User.deleteMany();
    await Pokemon.deleteMany();
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting all users and Pokémon:', err);
    res.status(500).json({ message: 'Error deleting all users and Pokémon' });
  }
});

// Endpoint to view Pokémon based on pokemonOwnerName
app.get('/viewpokemon/:pokemonOwnerName', async (req, res) => {
  const { pokemonOwnerName } = req.params;

  try {
    const user = await User.findOne({ pokemonOwnerName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pokemons = await Pokemon.find({ userId: user._id });
    res.status(200).json(pokemons);
  } catch (err) {
    console.error('Error fetching Pokémon:', err);
    res.status(500).json({ message: 'Error fetching Pokémon' });
  }
});

// Endpoint to view Pokémon details based on pokemonId
app.get('/viewpokemondetails/:pokemonId', async (req, res) => {
  const { pokemonId } = req.params;

  try {
    const pokemon = await Pokemon.findById(pokemonId).populate('userId', 'pokemonOwnerName');
    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }

    res.status(200).json(pokemon);
  } catch (err) {
    console.error('Error fetching Pokémon details:', err);
    res.status(500).json({ message: 'Error fetching Pokémon details' });
  }
});

// Endpoint to view all users
app.get('/viewusers', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Endpoint to view all users and their Pokémon
app.get('/viewallusers', async (req, res) => {
  try {
    const users = await User.find();
    const usersWithPokemons = await Promise.all(users.map(async (user) => {
      const pokemons = await Pokemon.find({ userId: user._id });
      return { user, pokemons };
    }));
    res.status(200).json(usersWithPokemons);
  } catch (err) {
    console.error('Error fetching users and Pokémon:', err);
    res.status(500).json({ message: 'Error fetching users and Pokémon' });
  }
});

// Endpoint to get Pokémon owners
app.get('/getpokemonowners', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    // Map the users to include only necessary fields
    const owners = users.map(user => ({
      id: user._id,
      name: user.pokemonOwnerName
    }));
    res.status(200).json(owners);
  } catch (err) {
    console.error('Error fetching Pokémon owners:', err);
    res.status(500).json({ message: 'Error fetching Pokémon owners' });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
