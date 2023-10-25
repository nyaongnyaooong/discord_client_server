import LoginForm from "./component/LoginForm";
import styles from "./css/page.module.scss";

export default function Login() {

  return (
    <div className={styles.root}>
      <LoginForm />
    </div>
  )
}
