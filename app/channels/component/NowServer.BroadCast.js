import styles from "./css/NowServer.BroadCast.module.scss";
const IconLeaveVoice = () => {
  return (
    <svg className={styles.iconLeaveVoice} role="img" width="20" height="20" viewBox="0 0 24 24">
      <path d="M21.1169 1.11603L22.8839 2.88403L19.7679 6.00003L22.8839 9.11603L21.1169 10.884L17.9999 7.76803L14.8839 10.884L13.1169 9.11603L16.2329 6.00003L13.1169 2.88403L14.8839 1.11603L17.9999 4.23203L21.1169 1.11603ZM18 22H13C6.925 22 2 17.075 2 11V6C2 5.447 2.448 5 3 5H7C7.553 5 8 5.447 8 6V10C8 10.553 7.553 11 7 11H6C6.063 14.938 9 18 13 18V17C13 16.447 13.447 16 14 16H18C18.553 16 19 16.447 19 17V21C19 21.553 18.553 22 18 22Z"></path>
    </svg>
  )
}

const IconPing = () => {

  return (
    <svg className={styles.iconPing} aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
      <path d="M7.19999 18C7.19999 17.3364 6.77 16.8 6.24019 16.8H3.3598C2.82999 16.8 2.39999 17.3364 2.39999 18V20.4C2.39999 21.0636 2.82999 21.6 3.3598 21.6H6.23923C6.76904 21.6 7.19903 21.0636 7.19903 20.4V18H7.19999Z" ></path>
      <path d="M14.4 10.6909C14.4 10.0876 13.9699 9.6 13.44 9.6H10.56C10.0301 9.6 9.60001 10.0876 9.60001 10.6909V20.5091C9.60001 21.1124 10.0301 21.6 10.56 21.6H13.44C13.9699 21.6 14.4 21.1124 14.4 20.5091V10.6909Z" ></path>
      <path d="M21.6 3.46667C21.6 2.8768 21.1699 2.4 20.64 2.4H17.76C17.2301 2.4 16.8 2.8768 16.8 3.46667V20.5333C16.8 21.1232 17.2301 21.6 17.76 21.6H20.64C21.1699 21.6 21.6 21.1232 21.6 20.5333V3.46667Z" ></path>
    </svg>

  )
}

const BroadCast = ({ clickFunction }) => {

  return (
    <div className={styles.broadCast}>

      <div className={styles.statusArea}>
        <div className={styles.iconArea}>
          <IconPing />
        </div>
        <div className={styles.textArea}>
          음성 연결됨
        </div>
      </div>

      <div className={styles.buttonArea}>
        <div className={styles.buttonLeave} onClick={clickFunction}>
          <IconLeaveVoice />
        </div>
      </div>
    </div>
  )
}

export default BroadCast;