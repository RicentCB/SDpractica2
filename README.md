# Sistemas Distribuidos Practica2

## Como usarlo

Para clonar y usar el repo necesitas [Git](https://git-scm.com) y [Node.js](https://nodejs.org/en/download/) (el cual viene con [npm](http://npmjs.com)) instalados en tu ordenador. Desde la linea de comandos:

```bash
# Clone this repository
git clone https://github.com/RicentCB/SDpractica2
# Go into the repository
cd SDpractica2
# Install dependencies
npm install
# Run the app
npm start
```

### Correr cliente - servidor

Por defecto correra el servidor, si quieres usar el cliente, deberas ir al archivo [main.js], y modificar comentar la linea 19, y descomentar la linea 20.
```
//mainWindow.loadFile('index.html')
mainWindow.loadFile('indexCli.html')
```

## License

[CC0 1.0 (Public Domain)](LICENSE.md)

