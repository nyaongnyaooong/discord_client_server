import { useState, useEffect, useContext, useRef } from "react"
import { useParams } from "next/navigation";
import { AppContext } from "../../../layout"
import { io } from "socket.io-client";
import axios from "axios";
import styles from "../css/ChannelArea.Content.MessageForm.module.scss"

// 채팅 메세지 입력 란
const MessageForm = ({ chatListData, stateSetter, scrollerRef }) => {
  const { setChatList, setSocketObject } = stateSetter

  const { params } = useParams();
  const [_, receiverId] = params;

  const { coreData } = useContext(AppContext);
  const { socket, userInfo } = coreData;

  const sendMessage = (event) => {
    event.preventDefault();

    const dmSocketDto = {
      sender_Id: userInfo.id,
      receiver_Id: receiverId,
      type: 'text',
      content: event?.target?.message?.value
    }
    socket.emit('sendDm', dmSocketDto);

    event.target.message.value = '';
  }

  const uploadFile = async (event) => {

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const { protocol, hostname } = window.location;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
        `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
        "http://localhost:3040";
      const response = await axios.post(serverUrl + '/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      const imgUrl = response.data
      //----------------------
      // 업로드 삭제 코드 작성
      //----------------------
      // event.target.files[0].name = '';

      const chatSocketDto = {
        sender_Id: userInfo.id,
        type: 'image',
        server_id: serverId,
        channel_id: channelId,
        content: imgUrl
      }
      socket.emit('sendChat', chatSocketDto);

      console.log(imgUrl)
    } catch (err) {

    }
  }

  return (
    // <form onSubmit={sendMessage} className={styles.messageForm}>
    <div className={styles.messageForm}>
      <div className={styles.textArea}>
        {/* <form className={styles.uploadArea}>
          <svg className={styles.uploadButton} viewBox="0 0 24 24">
            <path d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z" />
          </svg>
          <input onChange={uploadFile} type="file" name="imgUpload" accept="image/png, image/jpeg" />
        </form> */}

        {/* <div className={styles.inputArea}> */}
        <form onSubmit={sendMessage} className={styles.inputArea}>
          <input name="message" autoComplete='off' />
        </form>
        {/* </div> */}

        <div className={styles.buttonArea}>
        </div>
      </div>
    </div>
    // </form>
  )
}

export default MessageForm;
