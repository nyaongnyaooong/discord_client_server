'use client';

import Link from 'next/link'
import axios, { AxiosError } from 'axios'
import styles from "../css/RegisterForm.module.scss";
import globalStyles from "../../css/global.module.scss";
import InputBox from "./InputBox";
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();

  const reqRegister = async (event) => {
    event.preventDefault();

    try {
      if (!event.target.mail.value) throw new Error('no email');
      if (!event.target.nickname.value) throw new Error('no nickname');
      if (!event.target.password.value) throw new Error('no password');

      const { protocol, hostname } = window.location;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
        `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
        "http://localhost:3040";
      const formObj = {
        mail: event.target.mail.value,
        nickname: event.target.nickname.value,
        password: event.target.password.value
      }
      const response = await axios.post(serverUrl + '/api/user/register', formObj);
      alert('회원가입한 이메일로 로그인해 주세요');
      router.push('/login');
    } catch (err) {
      if (err instanceof AxiosError) {
        const errMessage = err.response.data.message;

        if (errMessage === 'duplicated mail adress') alert('이미 존재하는 이메일 주소입니다');
      } else {
        const errMessage = err.message;

        if (errMessage === 'no email') alert('메일 주소를 입력해주세요');
        if (errMessage === 'no nickname') alert('닉네임을 입력해주세요');
        if (errMessage === 'no password') alert('패스워드를 입력해주세요');
      }
    }
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