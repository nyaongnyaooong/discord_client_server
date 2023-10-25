'use client'

import styles from "./css/NowServer.UserData.module.scss";
import axios from 'axios';
import { useState, useRef, useEffect } from "react";
import { IconMuteMic, IconMic, IconHear, IconMuteHear, IconSetup } from "./NowServer.UserData.Icon";


const UserData = ({ coreData, userStatus, setUserStatus }) => {
  const { socket, userInfo } = coreData;
  const [modalOn, setModalOn] = useState(false);
  const [remove, setRemove] = useState(false);

  const handleMic = () => {
    if (userStatus.mic) setUserStatus((oldUserStatus) => { return { mic: false, hear: oldUserStatus.hear } })
    else setUserStatus((oldUserStatus) => { return { mic: true, hear: oldUserStatus.hear } })
  }

  const handleHear = () => {
    if (userStatus.hear) setUserStatus((oldUserStatus) => { return { mic: oldUserStatus.mic, hear: false } })
    else setUserStatus((oldUserStatus) => { return { mic: oldUserStatus.mic, hear: true } })
  }

  const SetUpModal = () => {
    const [page, setPage] = useState(0);
    const [avatarImgSrc, setAvatarImgSrc] = useState(userInfo.avatar || 'https://avatars.githubusercontent.com/u/68260365?v=4');
    const [newData, setNewData] = useState();

    const [updatePwModal, setUpdatePwModal] = useState(false);

    const ModalUpdatePw = () => {
      const topInputRef = useRef();

      useEffect(() => {
        topInputRef.current.focus();
      }, [])

      const updatePw = async (event) => {
        event.preventDefault();

        const nowPw = event.target.nowPw.value;
        const newPw = event.target.newPw.value;
        const newPwConfirm = event.target.newPwConfirm.value;

        if (newPw !== newPwConfirm) return;

        try {
          const { protocol, hostname } = window.location;
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
            `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
            "http://localhost:3040";
          const response = await axios.patch(serverUrl + '/api/user/password',
            { nowPw, newPw },
            { withCredentials: true });

          console.log(response.data)

        } catch (err) {

        }
      }

      return (
        <div className={styles.modalUpdatePw}>
          <div className={styles.bgDark} onClick={() => setUpdatePwModal(false)} />
          <form className={styles.setWindow} onSubmit={updatePw}>
            <div className={styles.setArea}>
              <h2>비밀번호를 바꿔주세요</h2>
              <h3>현재 비밀번호와 새 비밀번호를 입력하세요.</h3>
              <div className={styles.item}>
                <div className={styles.textWrapper}>
                  <span>현재 비밀번호</span>
                </div>
                <div className={styles.inputWrapper}>
                  <input ref={topInputRef} name='nowPw' type='password'></input>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.textWrapper}>
                  <span>새 비밀번호</span>
                </div>
                <div className={styles.inputWrapper}>
                  <input name='newPw' type='password'></input>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.textWrapper}>
                  <span>새 비밀번호 확인</span>
                </div>
                <div className={styles.inputWrapper}>
                  <input name='newPwConfirm' type='password'></input>
                </div>
              </div>
            </div>
            <div className={styles.buttonArea}>
              <button type="button" className={styles.buttonCancle} onClick={() => setUpdatePwModal(false)}>
                취소
              </button>
              <button type="submit" className={styles.buttonConfirm}>
                완료
              </button>
            </div>
          </form>
        </div>
      )
    }

    const Content = () => {
      const uploadFile = (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        console.log(event.target.files[0])
        console.log(formData)


        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (event2) => {
          const img = new Image();
          img.src = event2.target.result;

          img.onload = () => {
            // canvas  생성
            const canvas = document.createElement("canvas");

            // 원본 이미지의 비율 유지하면서 한쪽의 사이즈를 150px로 줄임
            if (img.height > img.width) {
              canvas.width = 150;
              canvas.height = Math.floor(img.height / img.width * canvas.width)
            } else {
              canvas.height = 150;
              canvas.width = Math.floor(img.width / img.height * canvas.height)
            }
            // canvas에 이미지를 담음
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

            // canvas의 dataurl를 blob(file)화
            // 확장자 png로
            const dataUrl = canvas.toDataURL("image/png");
            const byteString = atob(dataUrl.split(',')[1]);
            const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }

            // 리사이징된 Blob 객체
            const resizedBlob = new Blob([ab], { type: mimeString });

            // blob객체 File로 변환
            const resizedFile = new File([resizedBlob], 'resized', { type: 'image/png' });

            const reader2 = new FileReader();
            reader2.readAsDataURL(resizedFile);

            reader2.onload = (event3) => {
              setNewData({ avatar: resizedFile })
              setAvatarImgSrc(event3.target.result)
            }

            // const url = window.URL.createObjectURL(resizedBlob);

            const formData = new FormData();
            formData.append("file", resizedFile);
            console.log(resizedFile)
            console.log(formData)
          }
        };

      }

      if (page === 1) {
        return (
          <div className={styles.content}>
            <h2>프로필</h2>
            <div className={styles.setProfile}>
              <div className={styles.setArea}>
                <div className={styles.item}>
                  <div className={styles.text}>
                    <span>별명</span>
                  </div>
                  <input />
                </div>

                <div className={styles.item}>
                  <div className={styles.text}>
                    <span>아바타</span>
                  </div>
                  <div className={styles.buttonArea}>
                    <div className={styles.buttonChange}>
                      <input onChange={uploadFile} type="file" name="imgUpload" accept="image/png, image/jpeg" />
                      아바타 변경하기
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.previewArea}>
                <div className={styles.text}>
                  <span>미리보기</span>
                </div>
                <div className={styles.profileCard2}>
                  <div className={styles.avatar}>
                    <div className={styles.imageWrapper}>
                      <div className={styles.image}>
                        <img src={avatarImgSrc} />
                      </div>
                    </div>
                    <div className={styles.userStatusWrapper}>
                      <div className={styles.userStatus}>

                      </div>
                    </div>
                  </div>
                  <div className={styles.banner}>

                  </div>
                  <div className={styles.underBanner}>
                    <div className={styles.userInfoArea}>
                      <div className={styles.nicknameArea}>
                        <div>재아</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.saveArea} ${styles.aniPopUp}`}>
              <div className={styles.textArea}>
              </div>
              <div className={styles.buttonArea}>
                <div className={styles.buttonUndo} onClick={() => {
                  setNewData();
                  setAvatarImgSrc('');
                }}>
                  원상복구
                </div>
                <div className={styles.buttonSave} onClick={updateUserProfile}>
                  변경사항 저장하기
                </div>
              </div>
            </div>
          </div>
        )

      } else {
        return (
          <div className={styles.content}>
            <h2>내 계정</h2>
            <div className={styles.profileCard}>
              <div className={styles.banner}>

              </div>
              <div className={styles.userTitle}>
                <div className={styles.avatar}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.image}>
                      <img src={userInfo.avatar || 'https://avatars.githubusercontent.com/u/68260365?v=4'} />
                      <div className={styles.userStatusWrapper}>
                        <div className={styles.userStatus}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.nickname}>
                  <span>재아</span>
                </div>
                <div className={styles.buttonArea}>
                  <div className={styles.button}>
                    사용자 프로필 편집
                  </div>
                </div>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.info}>
                  <div className={styles.nickname}>
                    <div className={styles.textArea}>
                      <span>별명</span>
                      <span>재아</span>
                    </div>
                    <div className={styles.buttonArea}>
                      <div>수정</div>
                    </div>
                  </div>
                  <div className={styles.email}>
                    <div className={styles.textArea}>
                      <span>이메일</span>
                      <span>test@test.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.divineLine} />
            <h2>비밀번호</h2>
            <div className={styles.password}>
              <div className={styles.buttonUpdatePassword} onClick={() => {
                setUpdatePwModal(true);
              }}>
                비밀번호 변경하기
              </div>
              {
                updatePwModal ?
                  <ModalUpdatePw /> :
                  <></>
              }
            </div>
          </div>
        )
      }
    }

    const updateUserProfile = async () => {
      if (!newData) return;

      const formData = new FormData();
      formData.append("file", newData.avatar);

      try {
        const { protocol, hostname } = window.location;
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
          `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
          "http://localhost:3040";
        const response = await axios.patch(serverUrl + '/api/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });

        const imgUrl = response.data

      } catch (err) {

      }
    }

    return (
      <div className={remove ? `${styles.setUpModal} ${styles.animatePopDown}` : `${styles.setUpModal} ${styles.animatePopUp}`}>
        <div className={styles.list}>
          <div className={styles.itemTitle}>
            <span>사용자 설정</span>
          </div>
          <div className={styles.item} onClick={() => setPage(0)}>
            <span>내 계정</span>
          </div>
          <div className={styles.item} onClick={() => setPage(1)}>
            <span>프로필</span>
          </div>
        </div>

        <Content />

        <div className={styles.close}>
          <div className={styles.button}>

            <div className={styles.buttonImage} onClick={() => {
              setRemove(true)
              setTimeout(() => {
                setModalOn(false)
                setRemove(false)
              }, 100)
            }}>
              <div className={styles.buttonCircle}>
                <svg aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24">
                  <path d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
                </svg>
              </div>
            </div>

            <div className={styles.buttonText}>
              <span>ESC</span>
            </div>

          </div>
        </div>
      </div>
    )

  }

  return (
    <div className={styles.userData}>

      <div className={styles.userProfile}>

        <div className={styles.userImgWrapper}>
          <img src={userInfo.avatar || 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdSZ2nX%2Fbtsy3gA9t3F%2F5M0ObZONRlqxqwzfQjOHlk%2Fimg.png'} />
        </div>

        <div className={styles.textArea}>
          <div className={styles.userName}>{userInfo.nickname}</div>
          <div className={styles.userStatus}>온라인</div>
        </div>

      </div>

      <div className={styles.userControl}>

        <div className={`${styles.setMic} ${styles.icon}`} onClick={handleMic}>
          {
            userStatus.mic ?
              <IconMic /> :
              <IconMuteMic />
          }
        </div>
        <div className={`${styles.setHear} ${styles.icon}`} onClick={handleHear}>
          {
            userStatus.hear ?
              <IconHear /> :
              <IconMuteHear />
          }
        </div>
        <div className={`${styles.setup} ${styles.icon}`} onClick={() => { setModalOn(true) }}>
          <IconSetup />
        </div>

        {
          modalOn ?
            <SetUpModal /> :
            <></>
        }
      </div>
    </div>
  )
}

export default UserData;