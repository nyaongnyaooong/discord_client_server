'use client'

import { useEffect } from "react";
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation";

const Join = ({ params }) => {
  const { param: inviteCode } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { protocol, hostname } = window.location;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
        `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
        "http://localhost:3040";

      try {
        await axios.post(serverUrl + '/api/server/join/', { inviteCode }, { withCredentials: true });

        router.push('/channels/me')

      } catch (err) {
        let errMessage = ''
        if (err instanceof AxiosError) {
          errMessage = err?.response?.data?.message
          router.push('/channels/me')
        }

      }
    }
    fetchData();
  }, []);

  return (
    <>
    </>
  )
}

export default Join;