
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddPokemonUser from './components/AddPokemonUser';
import ListPokemonUser from './components/ListPokemonUser';
import HomePage from './components/HomePage';
import AddPokemon from './components/AddPokemon'
import EditPokemonUser from './components/EditPokemonUser'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/adduser" element={<AddPokemonUser />} />
        <Route path='/listuser' element={<ListPokemonUser />}/>
        <Route path="/addpokemon" element={<AddPokemon />} />
        <Route path="/addpokemon/:pokemonId" element={<AddPokemon />} />
        <Route path="/editpokemon/:pokemonId" element={<EditPokemonUser />} />
        
      </Routes>
    </Router>
  );
}

export default App;

