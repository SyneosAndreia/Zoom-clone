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
    audio: true
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

    // Get Message
    let text = document.getElementById('chat_message');

    document.addEventListener('keydown', e => {
        if(e.key === 'Enter' && text.value.length !== 0) {
            console.log(text.value);
            socket.emit('message', text.value);
            text.value = '';

            console.log(text.value)
        }
    });

    socket.on('createMessage', message => {
        console.log('this is coming from server', message);
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollBottom();
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

const scrollBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="fas fa-microphone-slash unmute"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

// Stop Video

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}