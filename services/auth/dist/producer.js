import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();
let producer;
let admin;
export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: "auth-service",
            brokers: [process.env.Kafka_Broker || "localhost:9092"]
        });
        admin = kafka.admin();
        admin.connect();
        const topics = await admin.listTopics();
        if (!topics?.includes("send-mail")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-mail",
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ]
            });
            console.log("✅ Topic Send Mail Created!");
        }
        await admin.disconnect();
        producer = kafka.producer();
        await producer.connect();
        console.log("Connected to kafka producer!!");
    }
    catch (error) {
        console.log("Failed to connect kafka ====>>>", error);
    }
};
export const publishToTopic = async (topic, message) => {
    if (!producer) {
        console.log("Kafka producer is not initialized");
        return;
    }
    try {
        const data = await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(message)
                }
            ]
        });
    }
    catch (error) {
        console.log("Failed to publish message to kafka ====>> ", error);
    }
};
export const disconnectKafka = async () => {
    if (producer) {
        producer.disconnect();
    }
};
