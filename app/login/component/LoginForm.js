'use client';

import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import styles from "../css/LoginForm.module.scss";
import globalStyles from "../../css/global.module.scss";
import InputBox from '../../register/component/InputBox';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

axios.defaults.withCredentials = true;

export default function LoginForm() {
  const router = useRouter();

  const [descMail, setDescMail] = useState({ highlight: false, errMessage: '' });
  const [descPw, setDescPw] = useState({ highlight: false, errMessage: '' });

  const reqLogin = async (event) => {
    event.preventDefault();
    
    const { protocol, hostname } = window.location;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
      `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
      "http://localhost:3040";
    const userMail = event.target.mail.value;
    const userPw = event.target.password.value;

    try {
      if (!userMail) throw new Error('메일주소를 입력해주세요');
      if (!userPw) throw new Error('비밀번호를 입력해주세요');

      const formObj = {
        mail: event.target.mail.value,
        password: event.target.password.value
      }

      const response = await axios.post(serverUrl + '/api/user/login', formObj)

      router.push('/channels/me');
    } catch (err) {
      let errCode;
      if (err instanceof AxiosError) errCode = err?.response?.data?.message;
      else errCode = err.message;

      if (errCode === '존재하지 않는 메일주소입니다' || errCode === '메일주소를 입력해주세요') {
        setDescMail({ highlight: true, errMessage: errCode });
        setDescPw({ highlight: false, errMessage: '' });
      }
      if (errCode === '비밀번호가 일치하지 않습니다' || errCode === '비밀번호를 입력해주세요') {
        setDescMail({ highlight: false, errMessage: '' });
        setDescPw({ highlight: true, errMessage: errCode });
      }


    }

  }

  return (
    <form onSubmit={reqLogin} className={`${styles.loginForm} ${globalStyles.popDown}`}>
      <div className={styles.loginBox}>
        <div className={styles.titleWrapper}>
          <div className={styles.maintitleWrapper}>
            <h1>
              {/* 로그인 폼 타이틀 입력란 */}
              Discord Clone
            </h1>
          </div>
          <div className={styles.subtitleWrapper}>
            <span>
              {/* 로그인 폼 서브 타이틀 입력란 */}
            </span>
          </div>
        </div>

        <InputBox descHighlight={descMail.highlight} errMessage={descMail.errMessage} inputName='mail'>이메일</InputBox>

        <InputBox descHighlight={descPw.highlight} errMessage={descPw.errMessage} inputName='password' inputType='password'>비밀번호</InputBox>

        <div className={styles.findPassword}>
          <Link href="/register">비밀번호를 잊으셨나요?</Link>
        </div>

        <div className={styles.login}>
          <button type="submit">로그인</button>
        </div>
        <div className={styles.register}>
          <span>계정이 필요한가요?</span>
          <Link href="/register">가입하기</Link>
        </div>
      </div>

      <div className={styles.marginBox}>

      </div>

      <div className={styles.qrBox}>

      </div>
    </form>
  )
}