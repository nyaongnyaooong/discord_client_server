import styles from "./css/NowServer.module.scss";
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from "axios";
import Header from './NowServer.Header';
import DivideLine from './NowServer.DivideLine';
import ChannelList from './NowServer.ChannelList';
import BroadCast from './NowServer.BroadCast';
import UserData from './NowServer.UserData';

// 특정 서버 접속
const NowServer = ({ coreData, setCoreData, serverId, channelId, serverName }) => {
  const router = useRouter();
  // const { params } = useParams();
  // const [serverId, channelId] = params;

  const { socket, userInfo } = coreData;

  const [channels, setChannels] = useState({ chat: [], voice: [] })
  const [serverMembers, setServerMembers] = useState([])
  const [isLoad, setIsLoad] = useState()
  const [voiceParticipants, setVoiceParticipants] = useState({})
  const [userStatus, setUserStatus] = useState({ mic: true, hear: true })

  // 해당 서버의 소켓 접속 요청
  useEffect(() => {
    if (socket) {
      socket?.emit('joinRoom', serverId);
    }
  }, [socket])

  // Voice 참여자 목록 업데이트
  useEffect(() => {
    if (socket) {
      socket?.on('updateVoiceMember', (participants) => {
        setVoiceParticipants(participants);
      });
    }
  }, [socket])

  // 해당 서버의 채널 리스트 api 요청
  useEffect(() => {
    const fetchData = async () => {
      const { protocol, hostname } = window.location;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
        `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
        "http://localhost:3040";

      try {
        // 접속한 서버의 채널 리스트를 요청
        const resChannels = await axios.get(serverUrl + '/api/channel?serverId=' + serverId, { withCredentials: true })
        const newChannelList = resChannels?.data;

        // 채널 리스트 표시
        setChannels(newChannelList)

        // 전체 서버 멤버 리스트 요청
        const resServerMembers = await axios.get(serverUrl + '/api/server/users?serverId=' + serverId, { withCredentials: true })
        setCoreData((oldData) => {
          const newData = { ...oldData, serverMembers };
          newData.serverMembers = resServerMembers?.data
          return newData
        })
        // setServerMembers(resServerMembers?.data)

        setIsLoad(true)

        // 가장 상단 채널채팅으로 자동 접속
        const firstChannel = newChannelList.chat[0].id;
        if (!channelId && firstChannel) router.push(`/channels/${serverId}/${firstChannel}`);
      } catch (err) {

        // if (err instanceof AxiosError) router.push('/login')
      }
    }
    if (serverId) fetchData();
  }, [serverId])

  return isLoad ?
    (
      <div className={styles.nowServer}>
        <Header>{serverName}</Header>
        <DivideLine direction='column' />

        <ChannelList coreData={coreData} serverMembers={serverMembers} serverId={serverId} channelId={channelId} channels={channels} setChannels={setChannels} voiceParticipants={voiceParticipants}></ChannelList>

        {/* <BroadCast></BroadCast> */}
        <DivideLine direction='column' backgroundColor='rgb(49, 51, 56)' />
        <UserData coreData={coreData} userStatus={userStatus} setUserStatus={setUserStatus}></UserData>
      </div>
    ) :
    <></>
}
export default NowServer;