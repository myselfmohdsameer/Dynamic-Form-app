import { NextApiRequest, NextApiResponse } from "next";
import Kafka from "node-rdkafka";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Form = {
  name: string;
  email: string;
  age: string;
  address: string;
  authorEmail: string;
};

async function createProducer() {
  const producer = new Kafka.Producer({
    "bootstrap.servers": "localhost:9092",
    "dr_cb": true,
  });

  return new Promise((resolve, reject) => {
    producer
      .on("ready", () => {
        resolve(producer);
      })
      .on("event.error", (err) => {
        console.warn("event.error", err);
        reject(err);
      });

    producer.connect();
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as Form;

  try {
    const producer: any = await createProducer();

    const key = "collect";
    const value = Buffer.from(
      JSON.stringify({
        name: body.name,
        email: body.email,
        age: body.age,
        address: body.address,
        authorEmail: body.authorEmail,
      })
    );

    console.log(`Producing record ${key}\t${value}`);

    producer.produce(
      "form_saved",
      null,
      value,
      key,
      Date.now(), // Add a timestamp as the message's partition key
      (err: any, offset: any) => {
        if (err) {
          console.warn("Error producing", err);
        } else {
          console.log(
            `Successfully produced record to topic "form_saved" at offset ${offset}`
          );
        }
      }
    );

    producer.flush(5000);

    await prisma.response.create({
      data: {
        name: body.name,
        email: body.email,
        age: body.age,
        address: body.address,
        authorEmail: body.authorEmail,
      },
    });

    producer.disconnect();

    return res.status(201).json({
      data: "OK",
    });
  } catch (error) {
    console.error("An error occurred", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
