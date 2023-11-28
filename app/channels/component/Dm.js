import styles from "./css/Dm.module.scss";
import { useEffect, useState, createContext } from "react";
import UserData from './NowServer.UserData';
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from 'next/navigation';

const Dm = ({ coreData }) => {
  const router = useRouter();

  const { socket, userInfo } = coreData;
  const [userStatus, setUserStatus] = useState({ mic: true, hear: true });
  const [modal, setModal] = useState(false);
  const [dmUsers, setDmUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { protocol, hostname } = window.location;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
        `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
        "http://localhost:3040";

      try {
        // DM 보낼 유저들 목록 요청
        const req = await axios.get(serverUrl + '/api/dm/user/list', { withCredentials: true });

        const userList = req.data;

        setDmUsers(req.data);
      } catch (err) {

      }
    }
    fetchData();
  }, [])

  const Item = ({ children }) => {
    return (
      <Link href={`/channels/me/${children.receiver_Id}`} className={styles.item}>
        <div className={styles.avatarArea}>
          <div className={styles.avatarWrapper}>
            <img src={children?.receiver?.avatar || 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdSZ2nX%2Fbtsy3gA9t3F%2F5M0ObZONRlqxqwzfQjOHlk%2Fimg.png'}>
            </img>
          </div>
        </div>
        <div className={styles.textArea}>
          {children.receiver.nickname}
        </div>
      </Link>
    )
  }

  const Modal = () => {

    if (modal === 'addDm') {
      // DM 보낼 유저들 목록 - 같은 서버에 있는 유저들 리스트
      const [members, setMembers] = useState([]);

      // DM 보낼 유저들 목록을 받기 위해 모달 생성시 1회 실행
      useEffect(() => {
        const fetchData = async () => {
          const { protocol, hostname } = window.location;
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
            `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
            "http://localhost:3040";

          try {
            // DM 보낼 유저들 목록 요청
            const req = await axios.get(serverUrl + '/api/server/members', { withCredentials: true });

            // server[sever1, server2, ...]
            // server1[user1, user2, ...]
            const serverMemberList = req.data;

            const memberObject = {};
            serverMemberList.forEach(server => {
              server.forEach(member => {
                const newMember = {};
                newMember[member.user_Id] = member.user;
                newMember[member.user_Id].id = member.user_Id;
                Object.assign(memberObject, newMember);
              })
            });

            const memberArray = Object.keys(memberObject).map(id => memberObject[id]).filter(member=> member.id !== userInfo.id)
            // memberArray.filter(member=> member.id !== userInfo.id)

            setMembers(memberArray);
          } catch (err) {

          }
        }
        fetchData();
      }, []);

      const routeDmUser = (userId) => {
        // 모달창 닫기
        setModal(false);

        // 해당 유저 DM 메세지 창으로 페이지 변경
        router.push(`/channels/me/${userId}`);
      }

      return (
        <div className={styles.ModalArea}>
          <div className={styles.controlArea}>
            <div className={styles.titleArea}>
              <h1>유저 선택하기</h1>
              <h3>DM 보낼 상대를 선택하세요.</h3>
            </div>
            <div className={styles.userList}>
              {
                members.map((member, idx) => {
                  return (
                    <div key={idx} className={styles.item} onClick={() => routeDmUser(member.id)}>
                      <div className={styles.avatarArea}>
                        <div className={styles.avatarWrapper}>
                          <img src={member.avatar || 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdSZ2nX%2Fbtsy3gA9t3F%2F5M0ObZONRlqxqwzfQjOHlk%2Fimg.png'}></img>
                        </div>
                      </div>
                      <div className={styles.textArea}>
                        <div className={styles.nickname}>
                          {member.nickname}
                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
          <div className={styles.bgDark} onClick={() => setModal(false)}>

          </div>
        </div>
      )
    }
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
        {
          dmUsers.map((user, idx) => {
            return <Item key={idx}>{user}</Item>
          })
        }

      </div>
      <UserData coreData={coreData} userStatus={userStatus} setUserStatus={setUserStatus}></UserData>
    </div>
  )
}

export default Dm;