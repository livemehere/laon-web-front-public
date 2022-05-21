// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  x: number;
  y: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const addr = req.query.query;
  const r = await axios.get(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode`,
    {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.naverClientKey!,
        "X-NCP-APIGW-API-KEY": process.env.naverSecretKey!,
      },
      params: {
        query: addr,
      },
    }
  );
  const { x, y } = r.data.addresses[0];

  res.status(200).json({ x, y });
}
