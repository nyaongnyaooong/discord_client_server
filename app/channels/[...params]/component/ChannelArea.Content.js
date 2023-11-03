'use client'
import { useState, useEffect, useContext, useRef } from "react"
import { AppContext } from "../../layout"
import { useParams } from "next/navigation";
import styles from "./css/ChannelArea.Content.module.scss"
import ChatList from "./ChannelArea.Content.ChatList";
import MessageForm from "./ChannelArea.Content.MessageForm";

const Content = () => {
  const [chatList, setChatList] = useState([]);
  const scrollerRef = useRef();
  const messageEndRef = useRef(null);

  const { params } = useParams();
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

    if (socket && serverMembers) {
      socket?.on('onlineUsers', ({ onlineUsers }) => {
        console.log(serverMembers)
        // Map 객체화
        const isUserOnline = {};
        onlineUsers.forEach(onlineUser => {
          isUserOnline[onlineUser.user_Id] = true;
        });

        // 서버 멤버 목록 중 로그인 멤버 목록에 없는 유저들은 로그아웃 유저
        const offlineMembers = serverMembers.filter(member => !isUserOnline[member.user_Id]);

        setMembers({
          online: onlineUsers,
          offline: offlineMembers,
        })

      });

      socket.on('online', (onlineUserId) => {
        // 유저가 접속함 -> onlineUserId
        console.log('online', serverMembers)
        const onlineUser = serverMembers.filter(member => member.user_Id === onlineUserId);
        if (onlineUser.length === 0) return

        const newOfflineUsers = members.offline.filter(user => user.user_Id !== onlineUserId);

        const newOfflineUsersObject = {};
        newOfflineUsers.forEach(user => {
          newOfflineUsersObject[user.user_Id] = user;
        })

        const newOnlineMembers = [];
        serverMembers.forEach(serverMember => {
          if(!newOfflineUsersObject[serverMember.user_Id]) newOnlineMembers.push(serverMember)
        })

        // const newOnlineUsers = [...members.online];
        // newOnlineUsers.push(onlineUser[0])

        setMembers({
          online: newOnlineMembers,
          offline: newOfflineUsers
        })

      });

      socket.on('offline', (offlineUserId) => {
        // socket?.emit('reqLoginMember', serverMembers);
        console.log('offline', serverMembers)
        const offlineUser = serverMembers.filter(member => member.user_Id === offlineUserId);

        const newOnlineUsers = members.online.filter(user => user.user_Id !== offlineUserId);

        const newOnlineUsersObject = {};
        newOnlineUsers.forEach(user => {
          newOnlineUsersObject[user.user_Id] = user;
        })

        const newOfflineMembers = [];
        serverMembers.forEach(serverMember => {
          if(!newOnlineUsersObject[serverMember.user_Id]) newOfflineMembers.push(serverMember)
        })

        // const newOfflineUsers = [...members.offline];
        // newOfflineUsers.push(offlineUser[0])

        setMembers({
          online: newOnlineUsers,
          offline: newOfflineMembers
        })
      });
    }

    return () => {
      if (socket) {
        socket?.off('onlineUsers');
        socket?.off('offline');

      }
    }
  }, [socket, serverMembers, members])

  useEffect(() => {
    if (serverId && socket && serverMembers) {
      socket?.emit('reqLoginMember', serverMembers);
    }
  }, [serverId, socket, serverMembers])

  useEffect(() => {
    if (socket) {
      socket.on('chatHistory', (chatHistory) => {
        setChatList(chatHistory)
        // if (scrollerRef.current?.scrollHeight) {
        //   setTimeout(() => {
        //     const scrollLength = scrollerRef.current?.scrollHeight;
        //     console.log(scrollerRef.current, scrollLength)
        //     scrollerRef.current.scrollTop = scrollLength;
        //   }, 500)
        // }
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

      <div className={styles.memberList}>
        <div className={styles.memberStatus}>
          <span className={styles.online}>온라인 - {members?.online?.length}</span>
          <span></span>
        </div>

        {
          members?.online?.map((member, i) => {
            console.log(member)
            return (
              <div key={i} className={styles.itemMember}>
                <div className={styles.profile}>
                  <img src={member.user.avatar || 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdSZ2nX%2Fbtsy3gA9t3F%2F5M0ObZONRlqxqwzfQjOHlk%2Fimg.png'} />
                </div>
                <div className={styles.nickname}>
                  <span>{member.user.nickname}</span>
                </div>
              </div>
            )
          })
        }


        <div className={styles.memberStatus}>
          <span className={styles.online}>오프라인 - {members?.offline?.length}</span>
          <span></span>
        </div>

        {
          members?.offline?.map((member, i) => {
            return (
              <div key={i} className={styles.itemMember_offline}>
                <div className={styles.profile}>
                  <img src={member.user.avatar || 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdSZ2nX%2Fbtsy3gA9t3F%2F5M0ObZONRlqxqwzfQjOHlk%2Fimg.png'} />
                </div>
                <div className={styles.nickname}>
                  <span>{member.user.nickname}</span>
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default Content;