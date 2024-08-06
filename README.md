# Pokemon Management App

This is a React-based web application that allows users to manage their Pokemon. Users can view, add, edit, and delete Pokemon, as well as control their movement and visibility on a dynamic map.

## Deployment Link
VERCEL LINK - https://apexplus-frontend.vercel.app/
## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: View a list of Pokemon owners.
- **Pokemon Management**: Add, edit, and delete Pokemon for different users.
- **Dynamic Map**: Display Pokemon on a map based on user-provided coordinates.
- **Control Actions**: Move, vanish, and freeze Pokemon using control buttons.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/pokemon-management-app.git
    cd pokemon-management-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.

2. Use the dropdown to select a Pokemon owner and view their Pokemon.

3. Use the control buttons to move, vanish, or freeze Pokemon on the map.

4. Add, edit, or delete Pokemon using the provided buttons and forms.

## Components

### `App.jsx`

The main component that sets up routing for the application.

### `HomePage.jsx`

Displays a list of Pokemon owners and their Pokemon on a dynamic map with control buttons.

### `ListPokemonUser.jsx`

Lists all Pokemon with options to add, edit, or delete each Pokemon.

### `AddPokemon.jsx`

Form to add a new Pokemon to the selected owner.


## Technologies Used

- **Frontend**: React, CSS Modules
- **Backend**: Node.js, Express
- **Database**: MongoDB (or any other preferred database)
- **HTTP Client**: Axios

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README file according to your project's specific details and requirements.
