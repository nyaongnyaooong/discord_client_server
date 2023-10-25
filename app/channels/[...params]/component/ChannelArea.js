import styles from "./css/ChannelArea.module.scss"
import { AppContext } from "../../layout"
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "./ChannelArea.Header";
import DivideLine from "./ChannelArea.DivideLine";
import Content from "./ChannelArea.Content";

const ChannelArea = () => {

  return (
    <div className={styles.chatBox}>
      <Header></Header>
      <DivideLine direction='column'></DivideLine>
      <Content></Content>
    </div>
  )
}

export default ChannelArea;