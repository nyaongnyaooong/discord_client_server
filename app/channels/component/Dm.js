import styles from "./css/Dm.module.scss";
import { useEffect, useState, createContext } from "react";
import UserData from './NowServer.UserData';
import Link from "next/link";

const Dm = ({ coreData }) => {
  const { socket, userInfo } = coreData;
  const [userStatus, setUserStatus] = useState({ mic: true, hear: true });
  const [modal, setModal] = useState(false);

  const Item = () => {
    return (
      <Link href='me/1' className={styles.item}>
        <div className={styles.avatar}>

        </div>
        <div className={styles.nickname}>
          테스트
        </div>
      </Link>
    )
  }

  const Modal = () => {
    if (modal === 'addDm') return (
      <div className={styles.ModalArea}>
        <div className={styles.bgDark} onClick={() => setModal(false)}>

        </div>
        <div className={styles.controlArea}>

        </div>
      </div>
    )
  }

  const addDm = () => {
    setModal('addDm')
  }

  return (
    <div className={styles.dm}>
      {
        modal ?
          <Modal></Modal> :
          <></>
      }

      <div className={styles.header}>
        <h1>대화</h1>
      </div>
      <div className={styles.dmContent}>
        <div className={styles.title}>
          <div className={styles.text}>
            다이렉트 메세지
          </div>
          <div className={styles.icon}>
            <svg className={styles.addDm} onClick={addDm} role="img" viewBox="0 0 18 18">
              <polygon points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon>
            </svg>
          </div>

        </div>
        <Item></Item>
      </div>
      <UserData coreData={coreData} userStatus={userStatus} setUserStatus={setUserStatus}></UserData>
    </div>
  )
}

export default Dm;