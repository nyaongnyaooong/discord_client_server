import RegisterForm from "./component/RegisterForm";
import styles from "./css/page.module.scss";

export default function Register() {
  return (
    <div className={styles.root}>
      <RegisterForm />
    </div>
  )
}
