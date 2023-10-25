'use client';

import Link from 'next/link'
import axios from 'axios'
import styles from "../css/RegisterForm.module.scss";
import globalStyles from "../../css/global.module.scss";
import InputBox from "./InputBox";

export default function RegisterForm() {
  const reqRegister = async (event) => {
    event.preventDefault();

    const { protocol, hostname } = window.location;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
      `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
      "http://localhost:3040";
    const formObj = {
      mail: event.target.mail.value,
      nickname: event.target.nickname.value,
      password: event.target.password.value
    }
    const response = await axios.post(serverUrl + '/api/user/register', formObj)
    console.log(response)
  }

  return (
    <form onSubmit={reqRegister} className={`${styles.RegisterForm} ${globalStyles.popDown}`}>
      <div className={styles.RegisterBox}>
        <div className={styles.titleWrapper}>
          <div className={styles.maintitleWrapper}>
            <h1>계정 만들기</h1>
          </div>
        </div>

        <InputBox inputName='mail'>이메일</InputBox>

        <InputBox inputName='nickname'>사용자명</InputBox>

        <InputBox inputName='password' inputType='password'>비밀번호</InputBox>

        <div className={styles.registerButton}>
          <button type="submit">계속하기</button>
        </div>

        <div className={styles.termsBox}>
          <span>
            {/* 약관 및 정책에 관한 내용 추가 */}
          </span>
        </div>

        <div className={styles.toLogin}>
          <Link href="/login">이미 계정이 있으신가요?</Link>
        </div>
      </div>

      <div className="marginBox">

      </div>

      <div className="qrBox">

      </div>
    </form>
  )
}