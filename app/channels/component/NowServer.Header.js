import styles from "./css/NowServer.module.scss";

const Header = ({ children }) => {
  return (
    <div className={styles.header}>
      <h1>{children}</h1>
    </div>
  )
}

export default Header;