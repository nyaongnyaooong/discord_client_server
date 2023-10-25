"use client"

import { useEffect, useState, createContext } from "react";
import axios, { AxiosError } from "axios";
import styles from "./layout.module.scss";
import ServerList from "./component/ServerList";
import NowServer from "./component/NowServer";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";

export const AppContext = createContext();

export default function ServerListLayout({ children }) {
  const router = useRouter();
  const { params } = useParams();
  const [serverId, channelId] = params;

  // 페이지를 표시하는데 필요한 핵심 정보
  const [coreData, setCoreData] = useState({
    // 로그인한 유저 정보
    userInfo: null,
    // 소켓 데이터
    socket: null,
    // 접속한 서버의 유저 목록
    serverMembers: [],
    // core data setter
    setCoreData: null,
  });

  const [serverList, setServerList] = useState([false]);
  const [currentServerName, setCurrentServerName] = useState('');

  const getServerName = (serverArray, serverId) => {
    let serverName;
    serverArray.forEach(e => {
      if (e.id == +serverId) return serverName = e.name;
    })
    return serverName;
  }


  useEffect(() => {
    setCurrentServerName(getServerName(serverList, serverId))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { protocol, hostname } = window.location;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
        `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
        "http://localhost:3040";

      try {
        const response = await axios.get(serverUrl + '/api/server', { withCredentials: true })

        const socket = io(`${protocol}//${hostname}:${process.env.NEXT_PUBLIC_WEBSOCKET_PORT}`, { transports: ["websocket"] });
        // const socket = io("http://localhost:3030", { transports: ["websocket"] });
        socket.connect();

        // 소켓 연결 시 현재채팅 채널로 join
        socket.on('connect', () => {
          socket.emit('userInfo', response?.data?.userData);

          setCoreData((oldData) => {
            const newData = { ...oldData };
            newData.userInfo = response?.data?.userData;
            newData.socket = socket;
            newData.setCoreData = setCoreData;
            return newData
          })
        })

        const newServerList = response?.data?.serverData;
        setServerList(newServerList)

        return socket;
      } catch (err) {
        if (err instanceof AxiosError) router.push('/login')
      }
    }


    const socket = fetchData();

    if (socket && socket.connected) return () => {
      socket?.disconnect();
    }
  }, [])


  return (
    <div className={styles.root}>
      {
        serverList[0] === false ?
          (
            <div>
              로딩중
            </div>
          ) :
          (
            <AppContext.Provider value={{coreData, setCoreData}}>
              <ServerList list={serverList} setList={setServerList}></ServerList>
              {
                isNaN(+serverId) ?
                  <></> :
                  <NowServer coreData={coreData} setCoreData={setCoreData} serverId={serverId} channelId={channelId} serverName={currentServerName} ></NowServer>
              }
              {children}
            </AppContext.Provider>
          )
      }
    </div>
  )
}