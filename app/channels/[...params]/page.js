'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ChannelArea from "./component/ChannelArea";

const Channels = () => {
  const { params } = useParams();
  const [serverId, channelId] = params;
  const router = useRouter();

  const [memberList, setMemberList] = useState([]);


  if (isNaN(serverId) || isNaN(channelId)) return (
    <div>

    </div>
    // 서버 및 채널 아이디가 잘못됨
  )
  else return (
    <ChannelArea serverId={serverId} channelId={channelId} list={memberList}></ChannelArea>
  )


}

export default Channels;