// const { text } = require("body-parser");

// const { Socket } = require("dgram");
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
}); 

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream); // Answer the call with an A/V stream.
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    });

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    });
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}

let text = $('input');

$('html').keydown((e) => {
    if(e.which == 13 && text.val().length !== 0) {
        console.log(text);
        socket.emit('message', text.val());
        text.val('')
    }
})

// let text = document.getElementById('chat_message');
// console.log(msg)

// document.addEventListener('keydown', e => {
//     console.log(e.key);
//     if(e.key === 13 && text.value.length !== 0) {
//         console.log(text);
//         socket.emit('message', text.value);
//         text.value === '';

//         console.log(text.value)
//     }
// });