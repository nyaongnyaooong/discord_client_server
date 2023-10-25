"use client"

import { useEffect, useState, useRef } from "react";
import styles from "./css/NowServer.ChannelList.module.scss";
import axios from 'axios';
import Link from "next/link";
import createPeerConnection from "./function/createPeerConnection";
import BroadCast from "./NowServer.BroadCast";


const ChannelList = ({ coreData, serverId, serverMembers, channelId, channels, voiceParticipants }) => {

  const [modalPopup, setModalPopup] = useState(false);
  const [modalPage, setModalPage] = useState('createChannel');

  const [voiceComponent, setVoiceComponent] = useState({});
  const [voiceRoomUsers, setVoiceRoomUsers] = useState([]);
  const [selfStream, setSelfStream] = useState();

  const connections = {};
  const { socket, userInfo } = coreData;

  // 채널 카테고리 표시
  const ChannelType = ({ children }) => {
    return (
      <div className={styles.channelType}>
        <svg className={styles.arrow} viewBox="0 0 24 24"><path d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>
        <div className={styles.typeName}>
          {children}
        </div>
        <svg className={styles.addChannel} onClick={() => {
          setModalPage('createChannel');
          setModalPopup(true);
        }} role="img" viewBox="0 0 18 18"><polygon points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon></svg>
      </div>
    )
  }

  // 채널
  const Channel = (props) => {
    const { children, type } = props;

    // 채널 초대 모달창
    const popModal = (e) => {
      e.preventDefault();

      setModalPage('createInviteCode')
      setModalPopup(true)
    }

    if (type === 'chat') {
      return (
        <Link href={props.linkUrl} className={styles.itemChannel} style={props.selected ? { backgroundColor: 'rgb(65, 65, 70)', color: 'white' } : {}}>

          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" role="img">
            <path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path>
          </svg>
          <div className={styles.chatName}>
            {children}
          </div>

          <div className={styles.channelControls} >
            <svg className={styles.icon} role="img" viewBox="0 0 16 16" onClick={popModal}>
              <path d="M14 2H16V3H14V5H13V3H11V2H13V0H14V2Z"></path>
              <path d="M6.5 8.00667C7.88 8.00667 9 6.88667 9 5.50667C9 4.12667 7.88 3.00667 6.5 3.00667C5.12 3.00667 4 4.12667 4 5.50667C4 6.88667 5.12 8.00667 6.5 8.00667Z"></path>
              <path d="M6.5 8.34C3.26 8.34 1 9.98666 1 12.34V13.0067H12V12.34C12 9.98 9.74 8.34 6.5 8.34Z"></path>
            </svg>
          </div>
        </Link>
      )
    } else if (type === 'voice') {
      const { participants } = props;
      // const participants = ['user1', 'user2'];
      const [joinedUsers, setJoinedUsers] = useState([]);

      useEffect(() => {
        socket.emit('reqJoinerList', channelId);
        socket.on('joinerList', (joinerList) => {
        })
      }, [])

      // 보이스 채널 입장시 실행 함수
      const reqJoinVoiceChannel = async () => {
        const { channelId } = props;
        console.log(serverId, channelId)

        // 1. 오디오 스트림 생성
        const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true, });
        setSelfStream(audioStream);

        // 2. 보이스 채널 입장 요청
        socket.emit('joinVoice', { serverId, channelId });
        console.log('join?')
        // 3. 입장요청이 받아들여지면 서버는 입장한 룸의 클라이언트 리스트를 보내줌
        socket.on('voiceMembers', async (voiceMembers) => {
          // 각각의 클라이언트id 값으로 peer connection을 생성함
          const clients = Object.keys(voiceMembers);

          for (const clientId of clients) {
            // 자기 자신은 커넥션을 생성하지 않음
            if (clientId === socket.id) {
              const newUser = {
                id: clientId,
                stream: null
              }
              setVoiceRoomUsers((prevUsers) => [...prevUsers, newUser])

              return;
            }

            // peer 커넥션 생성
            const peerConnection = createPeerConnection(socket, clientId, audioStream, setVoiceRoomUsers)
            connections[clientId] = peerConnection;

            // offer 생성
            const offer = await peerConnection.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            // 생성한 offer를 생성한 peer 커넥션의 LocalDescription으로 설정
            // await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
            await peerConnection.setLocalDescription(offer);

            // 보이스 채널 입장 요청 및 offer 전송
            socket.emit('offer', { receiver: clientId, offer });
          }
        });

        // 4. 룸에 들어온 상태에서 누군가 방에 입장하여 해당 클라이언트로부터 offer가 전송됨
        socket.on('offer', async (offerDto) => {
          const { sender, offer } = offerDto;

          // 새로운 peer 커넥션 생성
          const peerConnection = createPeerConnection(socket, sender, audioStream, setVoiceRoomUsers)
          connections[sender] = peerConnection;

          // 새로운 클라이언트가 보낸 offer를 RemoteDescription으로 설정
          await peerConnection.setRemoteDescription(offer);

          // 원격 피어의 요청에 대한 응답으로 answer 생성하고 LocalDescription 설정
          const answer = await peerConnection.createAnswer();

          await peerConnection.setLocalDescription(answer);

          // 생성한 로컬 피어의 설명을 다시 서버로 보냄
          socket.emit('answer', { receiver: sender, answer });

        });

        // 4. answer를 받음
        socket.on('answer', async (answerDto) => {
          const { sender, answer } = answerDto;

          try {
            // answer를 RemoteDescription으로 설정
            await connections[sender].setRemoteDescription(answer);
            console.log(connections[sender])
          } catch (err) {
            console.log('answer fail', err)
          }
        });

        socket.on('candidate', async (candidateDto) => {
          const { sender, candidate } = candidateDto;
          try {
            await connections[sender].addIceCandidate(candidate);
          } catch (err) {
            console.log('candidate fail2', err)
          }

        });

        // 유저 중 한명이 나감
        socket.on('clientExit', async (data) => {
          const { clientId } = data;

          const newVoiceRoomUsers = voiceRoomUsers.filter(member => member !== clientId)
          delete connections[clientId];
          setVoiceRoomUsers(newVoiceRoomUsers);


        });



      }

      return (
        <>
          <div className={styles.itemChannel} onClick={reqJoinVoiceChannel}>
            {/* 스피커 아이콘 */}
            <svg className={styles.icon} aria-hidden="true" role="img" viewBox="0 0 24 24">
              <path d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z" aria-hidden="true"></path>
            </svg>

            {/* 입장 인원 수 만큼 audio 태그 생성 */}
            {
              voiceRoomUsers.map(({ stream }, idx) => {
                const audioRef = useRef();
                useEffect(() => { if (audioRef.current) audioRef.current.srcObject = stream; });

                return <audio key={idx} ref={audioRef} hidden={true} autoPlay controls />
              })
            }

            <div className={styles.chatName}>
              {children}
            </div>

            {/* 설정 아이콘들 */}
            <div className={styles.channelControls} >
              <svg className={styles.icon} role="img" viewBox="0 0 16 16" onClick={popModal}>
                <path d="M14 2H16V3H14V5H13V3H11V2H13V0H14V2Z"></path>
                <path d="M6.5 8.00667C7.88 8.00667 9 6.88667 9 5.50667C9 4.12667 7.88 3.00667 6.5 3.00667C5.12 3.00667 4 4.12667 4 5.50667C4 6.88667 5.12 8.00667 6.5 8.00667Z"></path>
                <path d="M6.5 8.34C3.26 8.34 1 9.98666 1 12.34V13.0067H12V12.34C12 9.98 9.74 8.34 6.5 8.34Z"></path>
              </svg>
            </div>
          </div>
          {
            participants ?
              Object.keys(participants).map((participant, idx) => {
                return (
                  <div key={idx} className={styles.list}>
                    <div className={styles.participant}>
                      <div className={styles.avatar}>

                      </div>
                      <div className={styles.nickname}>
                        {participants[participant].nickname}
                      </div>
                    </div>
                  </div>
                )
              }) :
              <></>
          }
        </>
      )
    } else return <></>
  }

  const ModalChannel = () => {
    const [channelType, setChannelType] = useState('text');
    const [noChannelName, setChannelName] = useState(false)
    console.log(modalPage)
    if (modalPage === 'createChannel') {
      const createChannel = async (event) => {
        event.preventDefault();
        const channelName = event.target?.channelName.value

        const { protocol, hostname } = window.location;
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
          `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
          "http://localhost:3040";
        try {
          if (!channelName) throw new Error('no channelName')
          const response = await axios.post(serverUrl + '/api/channel', { serverId, name: channelName, type: channelType }, { withCredentials: true })

          setModalPopup(false)
        } catch (err) {
          if (err.message === 'no channelName') setChannelName(true)
        }

      }

      return (
        <div className={styles.modalRoot} onClick={() => setModalPopup(false)}>
          <div className={styles.modalCreate} onClick={e => e.stopPropagation()}>

            <div className={styles.titleArea}>
              <div className={styles.title}>
                <h1>채널 만들기</h1>
              </div>
              <div className={styles.subtitle}>
                <h3>
                  {/* 채널만들기 subtitle */}
                </h3>
              </div>
            </div>

            <div className={styles.selectArea}>
              <span className={styles.descTitle}>채널 유형</span>

              <div className={styles.itemSelect} style={channelType === 'text' ? { backgroundColor: 'rgb(33, 33, 35)' } : {}} onClick={() => setChannelType('text')}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" role="img"><path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
                <div className={styles.textArea}>
                  <span className={styles.titleText}>Text</span>
                  <span className={styles.subtitleText}>메세지, 이미지 등을 전송하세요</span>
                </div>
              </div>

              <div className={styles.itemSelect} style={channelType === 'voice' ? { backgroundColor: 'rgb(33, 33, 35)' } : {}} onClick={() => setChannelType('voice')}>
                <svg className={styles.icon} aria-hidden="true" role="img" viewBox="0 0 24 24"><path d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z" aria-hidden="true"></path></svg>
                <div className={styles.textArea}>
                  <span className={styles.titleText}>Voice</span>
                  <span className={styles.subtitleText}>음성 공유로 함께 어울리세요</span>
                </div>
              </div>

            </div>

            <form onSubmit={createChannel}>
              <div className={styles.nameForm}>
                <div className={styles.descTitle}>
                  <span>채널 이름</span>
                  {
                    noChannelName ?
                      <span className={styles.noChannel}>- 채널 이름을 입력해주세요</span> :
                      <></>
                  }
                </div>

                <input name="channelName" autoComplete="off"></input>

                <div className={styles.buttonArea}>
                  <button type="button" onClick={() => setModalPopup(false)}>취소</button>
                  <button className={styles.create} type="submit">채널 만들기</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )
    } else if (modalPage === 'createInviteCode') {
      const [inviteCode, setInviteCode] = useState('');

      useEffect(() => {
        const fetchData = async () => {
          const { protocol, hostname } = window.location;
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
            `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
            "http://localhost:3040";

          try {
            console.log(serverUrl, serverId)
            const response = await axios.post(serverUrl + '/api/server/invite', { serverId }, { withCredentials: true })
            console.log('send?')
            console.log(response.data)
            setInviteCode(`${window.location.origin}/join/${response.data}`)
          } catch (err) {
            if (err.message === 'no channelName') setChannelName(true)
          }
        }
        fetchData();
      }, [])

      const copy = async (e) => {
        await navigator.clipboard.writeText(inviteCode)

        e.target.value = '복사됨'

        setTimeout(() => {
          e.target.value = '복사'
        }, 1000)
      }

      return inviteCode ? (
        <div className={styles.modalRoot} onClick={() => setModalPopup(false)}>
          <div className={styles.modalInvite} onClick={e => e.stopPropagation()}>
            <span>서버 초대 링크 전송하기</span>

            <div className={styles.inputArea} >
              <input readOnly={true} value={inviteCode} />
              <input className={styles.copyButton} type='button' onClick={copy} value='복사'></input>
            </div>

            <span>초대 링크가 5분 후 만료됩니다.</span>
          </div>
        </div>
      ) : (<></>)
    }

  }

  const closePeer = async () => {
    socket.emit('leaveVoice');

    Object.keys(connections).forEach(peerReceiverId => {
      connections[peerReceiverId].close();
      delete connections[peerReceiverId];
    })

    selfStream.getTracks().forEach((track) => track.stop());
    setVoiceRoomUsers([]);
  }

  return (
    <>
      <div className={styles.channelList}>
        <ChannelType>채팅 채널</ChannelType>
        {
          channels.chat.map((e, i) => {

            return <Channel key={i} selected={e.id == channelId ? true : false} type='chat' linkUrl={`/channels/${e.serverId}/${e.id}`} >{e.name}</Channel>
          })
        }

        <ChannelType>음성 채널</ChannelType>
        {
          channels.voice.map((e, i) => {
            return <Channel key={i} type='voice' channelId={e.id} participants={voiceParticipants?.[e.id] ? voiceParticipants[e.id] : null}>{e.name}</Channel>
          })
        }

        {
          Object.keys(voiceComponent).map(e => {
            console.log(e)
            return e
          })
        }

        {
          modalPopup ?
            <ModalChannel></ModalChannel> :
            <></>
        }
      </div>

      {
        voiceRoomUsers.length ?
          (
            <BroadCast clickFunction={closePeer}/>
            // <div className={styles.broadCast}>
            //   <div className={styles.buttonExitCall} onClick={closePeer}>
            //     <svg role="img" width="20" height="20" viewBox="0 0 24 24">
            //       <path d="M21.1169 1.11603L22.8839 2.88403L19.7679 6.00003L22.8839 9.11603L21.1169 10.884L17.9999 7.76803L14.8839 10.884L13.1169 9.11603L16.2329 6.00003L13.1169 2.88403L14.8839 1.11603L17.9999 4.23203L21.1169 1.11603ZM18 22H13C6.925 22 2 17.075 2 11V6C2 5.447 2.448 5 3 5H7C7.553 5 8 5.447 8 6V10C8 10.553 7.553 11 7 11H6C6.063 14.938 9 18 13 18V17C13 16.447 13.447 16 14 16H18C18.553 16 19 16.447 19 17V21C19 21.553 18.553 22 18 22Z"></path>
            //     </svg>
            //   </div>
            // </div>
          ) :
          <></>
      }
    </>

  )
}

export default ChannelList;