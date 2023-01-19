const express = require('express');
const app = express();

const { PORT } = require('./config');

async function startServer() {

    //Init application loaders
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    //Start the server
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })
}

startServer();