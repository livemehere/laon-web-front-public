// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  x: number;
  y: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.body; // client에서 전달받은 token
  const userData = await axios.get("https://openapi.naver.com/v1/nid/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log("naver user Data : ", userData);

  res.status(200).json(userData.data);
}
