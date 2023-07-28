import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allResponses = await prisma.response.findMany({
    where: {
      authorEmail: req.body.authorEmail,
    },
  });

  return res.status(201).json({
    data: allResponses,
  });
}
