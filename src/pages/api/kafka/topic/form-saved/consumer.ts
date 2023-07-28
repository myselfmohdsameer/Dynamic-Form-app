import { NextApiRequest, NextApiResponse } from "next";
import Kafka from "node-rdkafka";

const ERR_TOPIC_ALREADY_EXISTS = 36;

type SheetForm = {
  name: string;
  email: string;
  age: string;
  message: string;
};

async function createConsumer() {
  const consumer = new Kafka.KafkaConsumer(
    { "group.id": "kafka", "metadata.broker.list": "localhost:9092" },
    {}
  );

  consumer.setDefaultConsumeTimeout(1000); // Set a timeout for consuming messages

  return new Promise((resolve, reject) => {
    consumer
      .on("ready", () => {
        console.log("Consumer is ready");
        resolve(consumer);
      })
      .on("data", (message) => {
        console.log("Message found! Contents below:");
        console.log(message.value.toString());
        // Process the message as needed
      })
      .on("event.error", (err) => {
        console.warn("Event error:", err);
        reject(err);
      });

    consumer.connect(null, (err: any) => {
      if (err) {
        console.error("Error connecting consumer:", err);
        reject(err);
      } else {
        console.log("Consumer connected");
        consumer.subscribe(["form_saved"]);
        consumer.consume();
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as SheetForm;

  try {
    const consumer: any = await createConsumer();

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
