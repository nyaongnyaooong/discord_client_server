import styles from "./css/ChannelArea.module.scss"
import Header from "./ChannelArea.Header";
import DivideLine from "./ChannelArea.DivideLine";
import Content from "./DmArea/Content";

const DmArea = () => {

  return (
    <div className={styles.chatBox}>
      <Header></Header>
      <DivideLine direction='column'></DivideLine>
      <Content></Content>
    </div>
  )
}

export default DmArea;