'use client'

import { useEffect } from "react";
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation";

const Main = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3040";

      try {
        await axios.get(serverUrl + '/user/auth', { withCredentials: true });

        router.push('/channels/me')

      } catch (err) {
        if (err instanceof AxiosError) router.push('/channels/me')
      }
    }
    fetchData();
  }, []);

  return (
    <>
    </>
  )
}

export default Main;