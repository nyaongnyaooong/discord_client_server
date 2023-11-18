'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Main = () => {
  const router = useRouter();



  useEffect(() => {
    // const fetchData = async () => {
    //   const response = await axios.get(serverUrl + '/api/docs');
    //   const docs = response.data;
    // };
    // fetchData();
    const { protocol, hostname } = window.location;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_PORT ?
      `${protocol}//${hostname}:${process.env.NEXT_PUBLIC_SERVER_PORT}` :
      "http://localhost:3040";
  
    const apiDocsUrl = serverUrl + '/api/docs';

    router.push(apiDocsUrl);
  }, [])


  return (
    <>
    </>
  );
}

export default Main;