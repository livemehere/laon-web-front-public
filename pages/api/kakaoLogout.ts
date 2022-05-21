// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const target_id = req.query.user_id;
  const r = await axios.post(
    `https://kapi.kakao.com/v1/user/logout`,
    { target_id_type: "user_id", target_id },
    {
      headers: {
        Authorization: `KakaoAK ${process.env.kakaoAdminKey}`,
      },
    }
  );
  console.log("kakao logout", r);
  res.end();
}
