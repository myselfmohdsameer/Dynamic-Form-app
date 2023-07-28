import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }
  const { id } = req.query;
  const responses = req.body.data;
  let sheetdata = [];
  let lastvalue = 0;
  responses.forEach((response) => {
    lastvalue++;
    const propertyValues = Object.values(response);
    sheetdata.push(Object.values(response));
  });
  const oauth2Client = new google.auth.OAuth2();
  const token = await getToken({ req, secret, raw: false });
  if (token) {
    const accessToken = token.access_token as string;
    oauth2Client.setCredentials({ access_token: accessToken });
    try {
      const sheets = google.sheets({
        auth: oauth2Client,
        version: "v4",
      });
      const request = {
        spreadsheetId: `${id}`,

        resource: {
          valueInputOption: "USER_ENTERED",

          data: [
            {
              range: `A1:G${lastvalue}`,
              values: sheetdata,
            },
          ],
        },

        auth: oauth2Client,
      };

      const response = await sheets.spreadsheets.values.batchUpdate(request);
      return res.status(201).json({
        data: response.data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ message: e });
    }
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
