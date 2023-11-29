"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./css/ServerList.module.scss"
import Modal from "./ServerList.Modal"

const ServerMark = ({ serverInfo, popContext, setPopContext }) => {
  console.log('info?', serverInfo)
  const serverName = serverInfo?.name;
  const avatar = serverInfo?.avatar;
  const hrefUrl = '/channels/' + serverInfo?.id;

  const handleOnContextMenu = (event) => {
    event.preventDefault();

    const { clientX, clientY } = event;
    setPopContext({ pos: { x: clientX, y: clientY }, serverId: serverInfo.id })
  }

  return (
    <Link href={hrefUrl} className={styles.serverMark} onContextMenu={handleOnContextMenu}>
      <div className={styles.imgWrapper}>
        {
          avatar ?
            <img src={avatar}></img> :
            serverName
        }
      </div>
    </Link>
  )
}



const ServerList = ({ list, setList }) => {
  const [modalPopup, setModalPopup] = useState(false);
  const [serverListDom, setServerListDom] = useState(<></>);
  const [popContext, setPopContext] = useState(null);

  useEffect(() => {
    const newDom = list.map((e, i) => {
      return (
        <ServerMark key={i} serverInfo={e.server} popContext={popContext} setPopContext={setPopContext}>
        </ServerMark>
      )
    });

    setServerListDom(newDom)
  }, [list])

  const stateSetter = {
    setModalPopup,
    setList
  }

  const ContextMenuServer = ({ contextInfo, setPopContext }) => {
    const { pos, serverId } = contextInfo;

    const handleContext = (page) => {

      return () => {
        setPopContext(null)
        setModalPopup({ page, serverId })
      }
    }
    return (
      <div className={styles.contextMenuServerWrapper}>
        <div className={styles.closeContextMenuServer} onClick={() => setPopContext(null)}></div>

        <div className={styles.contextMenuServer} style={{ left: pos.x, top: pos.y }}>
          <div className={styles.item} onClick={handleContext('inviteServer')}>
            <span>초대하기</span>
          </div>

          <div className={styles.divineItem} />

          <div className={styles.item} onClick={handleContext('setServer')}>
            <span>서버설정</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.serverList}>

      <Link href='/channels/me' className={styles.serverMark}>
        <div className={styles.imgWrapper} >
          <svg className={styles.svgDm} role="img" viewBox="0 0 28 20">
            <path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z">
            </path>
          </svg>
        </div>
      </Link>
      <div className={styles.serverMark}>
        <div className={styles.divineLine}>

        </div>
      </div>

      {/* 서버리스트 */}
      {
        serverListDom
      }

      {/* 새로운 서버 생성 버튼 */}
      <div className={styles.serverMark}>
        <div className={styles.addServerWrapper} onClick={() => {
          setModalPopup({ page: 'createServer' });
        }}>
          <svg className={styles.svgAddServer} role="img" viewBox="0 0 24 24">
            <path d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z">
            </path>
          </svg>
        </div>
      </div>

      {
        modalPopup ?
          <Modal modalInfo={modalPopup} setStates={stateSetter}></Modal> :
          <></>
      }
      {
        popContext ?
          <ContextMenuServer contextInfo={popContext} setPopContext={setPopContext}></ContextMenuServer> :
          <></>
      }

    </div>
  )
}

export default ServerList;