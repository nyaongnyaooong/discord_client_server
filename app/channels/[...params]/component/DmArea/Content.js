'use client'
import { useState, useEffect, useContext, useRef } from "react"
import { AppContext } from "../../../layout"
import { useParams } from "next/navigation";
import styles from "../css/ChannelArea.Content.module.scss"
import ChatList from "./Content.ChatList";
import MessageForm from "../ChannelArea.Content.MessageForm";

const Content = () => {
  const [chatList, setChatList] = useState([]);
  const scrollerRef = useRef();
  const messageEndRef = useRef(null);

  const { params } = useParams();
  const [_, userId] = params;
  const [serverId, channelId] = params;

  const { coreData } = useContext(AppContext);
  const { socket, userInfo, serverMembers } = coreData;
  const [members, setMembers] = useState({ online: null, offline: null })

  const stateSetter = {
    setChatList,
  }

  useEffect(() => {
    if (socket && channelId) {
      console.log('id?', channelId)
      socket?.emit('reqChatHistory', channelId);
    }

  }, [socket, channelId])

  useEffect(() => {
    if (serverId && socket && serverMembers) {
      socket?.emit('reqLoginMember', serverMembers);
    }
  }, [serverId, socket, serverMembers])

  useEffect(() => {
    if (socket) {
      socket.on('chatHistory', (chatHistory) => {
        setChatList(chatHistory)
      })
    }

    if (socket && channelId) {
      socket.on('newChat', (newChatData) => {
        if (channelId === newChatData.channelId) {
          const newChatListData = [...chatList]
          newChatListData.push(newChatData.message)
          setChatList(newChatListData)
        }
        // scrollerRef.current.scrollIntoView({ behavior: 'smooth' });
        // setTimeout(() => {
        //   const scrollLength = scrollerRef.current?.scrollHeight;
        //   scrollerRef.current.scrollTop = scrollLength;
        // }, 200)
      })
    }
  }, [socket, chatList, channelId])

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatList])



  return (
    <div className={styles.content}>
      <div className={styles.main}>
        <div className={styles.chatListScroller} ref={scrollerRef} >
          <div className={styles.chatList}>
            <ChatList>{chatList}</ChatList>
            <div ref={messageEndRef}></div>
          </div>
        </div>
        <MessageForm chatList={chatList} stateSetter={stateSetter} scrollerRef={scrollerRef}></MessageForm>
      </div>
    </div>
  )
}

export default Content;