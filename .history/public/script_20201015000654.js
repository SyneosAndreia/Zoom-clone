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

    //Get Message
    let text = document.getElementById('chat_message');

document.addEventListener('keydown', e => {
    if(e.key === 'Enter' && text.value.length !== 0) {
        console.log(text.value);
        socket.emit('message', text.value);
        text.value === '';
    }
});

socket.on('createMessage', message => {
    console.log('this is coming from server', message)
    // let messageList = document.getElementsByClassName(messages);

    $('ul').append(`<li class="message><b>user</b><br/>${message}</li>`)
})
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

// let text = $('input');

// $('html').keydown((e) => {
//     if(e.which == 13 && text.val().length !== 0) {
//         console.log(text);
//         socket.emit('message', text.val());
//         text.val('')
//     }
// })

