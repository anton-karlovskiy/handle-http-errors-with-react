
import React from 'react';

import './App.css';

// RE: https://egghead.io/lessons/react-handle-http-errors-with-react

function PokemonInfo({ pokemonName }) {
  // A common mistake people make is to create a state variable called `isLoading` and set that to true or false.
  // Instead, we’ll be using a status variable which can be set to idle, pending, resolved, or rejected.

  // Adding state to Pokemon status
  const [status, setStatus] = React.useState('idle');
  const [pokemon, setPokemon] = React.useState(null);
  // Adding state to handle errors
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    // setting the status when the data is resolved
    setStatus('pending');
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setStatus('resolved');
        setPokemon(pokemonData);
      },
      errorData => {
        setStatus('rejected');
        setError(errorData);
      }
    );
  }, [pokemonName]);
  // this is very predictable, now that we can handle the status
  // In order to force an error yourself, you can alter the pokemonQuery into something invalid.
  if (status === 'idle') {
    return 'Submit a pokemon';
  }

  if (status === 'rejected') {
    return 'Oh no...';
  }

  if (status === 'pending') {
    return '...';
  }

  if (status === 'resolved') {
    return <pre>{JSON.stringify(pokemon, null, 2)}</pre>;
  }
}

function fetchPokemon(name) {
  const pokemonQuery = `
    query ($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `;

  return window
    .fetch('https://graphql-pokemon.now.sh', {
      // learn more about this API here: https://graphql-pokemon.now.sh/
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: { name }
      })
    })
    .then(r => r.json())
    .then(response => response.data.pokemon);
}

const App = () => {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setPokemonName(event.target.elements.pokemonName.value);
  }

  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pokemonName">Pokemon Name</label>
        <div>
          <input id="pokemonName" />
          <button type="submit">Submit</button>
        </div>
      </form>
      <hr />
      <PokemonInfo pokemonName={pokemonName} />
    </div>
  );
};

export default App;
