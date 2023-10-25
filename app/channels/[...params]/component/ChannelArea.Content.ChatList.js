import { useState, useEffect, useContext, useRef } from "react"
import styles from "./css/ChannelArea.Content.ChatList.module.scss"


// 채팅 리스트 내 한줄 한줄 컴포넌트
const Chat = ({ data, children, createdAt, withProfile }) => {
  const { type } = data;
  const { nickname: sender, avatar } = data.user;

  let chatContent;
  if (type === 'image') {
    chatContent = (
      <div className={styles.content}>
        <img src={children} />
      </div>
    )
  } else {
    chatContent = (
      <div className={styles.content}>
        <span>{children}</span>
      </div>
    )
  }

  if (withProfile) {
    return (
      <div className={styles.chatHeader}>
        <div className={avatar ? styles.profile : styles.profileNoAvatar}>
          <img src={avatar || 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdSZ2nX%2Fbtsy3gA9t3F%2F5M0ObZONRlqxqwzfQjOHlk%2Fimg.png'}></img>
        </div>

        <div className={styles.userName}>
          <span className={styles.name}>{sender}</span>
          <span className={styles.time}>{createdAt}</span>
        </div>

        <div className={styles.chat}>
          <div className={styles.chatTime}>
          </div>
          {chatContent}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.chat}>
        <div className={styles.chatTime}>
          <span>{createdAt}</span>
        </div>
        {chatContent}
      </div>
    )
  }


}

// 채팅 리스트 보여지는 부분
const ChatList = ({ children }) => {
  // const messageEndRef = useRef(null);

  let prevSender;
  const now = new Date();

  const ChatListDom = children.map((e, i) => {
    const createdTime = new Date(e.createdAt);

    let viewTime = (createdTime.getFullYear() === now.getFullYear() && createdTime.getMonth() === now.getMonth() && createdTime.getDate() === now.getDate()) ?
      '오늘' :
      `${createdTime.getFullYear()}.${createdTime.getMonth()}.${createdTime.getDate()}`;

    if (prevSender !== e.sender_Id) {
      viewTime += createdTime.getHours() < 12 ?
        ` 오전 ${createdTime.getHours()}:${(createdTime.getMinutes() < 10 ? '0' : '') + createdTime.getMinutes()}` :
        ` 오후 ${createdTime.getHours()}:${(createdTime.getMinutes() < 10 ? '0' : '') + createdTime.getMinutes()}`;

      prevSender = e.sender_Id;

      return <Chat key={i} withProfile={true} data={e} createdAt={viewTime}>{e.content}</Chat>
    } else {
      viewTime = createdTime.getHours() < 12 ?
        ` 오전 ${createdTime.getHours()}:${(createdTime.getMinutes() < 10 ? '0' : '') + createdTime.getMinutes()}` :
        ` 오후 ${createdTime.getHours()}:${(createdTime.getMinutes() < 10 ? '0' : '') + createdTime.getMinutes()}`;

      prevSender = e.sender_Id;

      return <Chat key={i} data={e} createdAt={viewTime}>{e.content}</Chat>
    }
  });

  return (
    <>
      {ChatListDom}
    </>
  )
}

export default ChatList;
