const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socketio')(server);
const {v4: uuidv4 } = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room })
})

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
    // res.status(200).send("Hello World");
})



server.listen(3030);