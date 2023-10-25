// 새로운 peer 커넥션을 생성하고 커넥션 객체를 return함
const createPeerConnection = (socket, clientId, audioStream, setter) => {
    const peerConnection = new RTCPeerConnection();

    // 생성한 peer 커넥션에 오디오 스트림 추가
    audioStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, audioStream);
    });

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) socket.emit('candidate', { receiver: clientId, candidate: event.candidate });
    };

    peerConnection.ontrack = (event) => {
        console.log('track')

        const newUser = {
            id: clientId,
            stream: event.streams[0]
        }
        setter((prevUsers) => [...prevUsers, newUser])
    };

    return peerConnection;
}

export default createPeerConnection;