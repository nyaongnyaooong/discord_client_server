'use client'
import { useState, useEffect, useContext, useRef } from "react"
import { AppContext } from "../../../layout"
import { useParams } from "next/navigation";
import styles from "../css/ChannelArea.Content.module.scss"
import ChatList from "./Content.ChatList";
import MessageForm from "./Content.MessageForm";

const Content = () => {
  const [chatList, setChatList] = useState([]);
  const scrollerRef = useRef();
  const messageEndRef = useRef(null);

  const { params } = useParams();
  const [_, targetUserId] = params;

  const { coreData } = useContext(AppContext);
  const { socket, userInfo, serverMembers } = coreData;
  const [members, setMembers] = useState({ online: null, offline: null })

  const stateSetter = {
    setChatList,
  }

  useEffect(() => {
    if (socket && targetUserId) {
      socket?.emit('reqDmHistory', targetUserId);
    }
  }, [socket, targetUserId])

  useEffect(() => {
    if (socket) {
      socket.on('dmHistory', (chatHistory) => {

        setChatList(chatHistory)
      })
    }

    if (socket && targetUserId) {

      socket.on('newDm', (newChatData) => {
        const newChatListData = [...chatList]
        newChatListData.push(newChatData)


        setChatList(newChatListData)

        // scrollerRef.current.scrollIntoView({ behavior: 'smooth' });
        // setTimeout(() => {
        //   const scrollLength = scrollerRef.current?.scrollHeight;
        //   scrollerRef.current.scrollTop = scrollLength;
        // }, 200)
      })
    }

    return () => {
      if(socket) {
        socket.off('dmHistory')
        socket.off('newDm')
      }
    }
  }, [socket, chatList, targetUserId])

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