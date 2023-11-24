import { createClient } from "redis";
import config from "./config";

const client = createClient({
  url: config.redis.uri,
});

client.on("error", (err: any) => console.log("Redis Client Error", err));

const connectClient = async () => {
  await client.connect();
};
connectClient();
export default client;
