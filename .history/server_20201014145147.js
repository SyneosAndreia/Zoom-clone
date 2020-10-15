const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('room');
    // res.status(200).send("Hello World");
})



server.listen(3030);