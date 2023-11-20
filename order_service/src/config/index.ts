import dotenv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

export default {
  amqplib: {
    message_broker_url: process.env.MESSAGE_BROKER_URL!,
    exchange_name: "FOOTBALL_STORE",
    order_binding_key: "ORDER_SERVICE",
    user_binding_key: "USER_SERVICE",
    queue_name: "ORDER_QUEUE",
  },
  db_url: process.env.MONGODB_URI!,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.API_KEY!,
    api_secret: process.env.API_SECRET!,
    folderPath: process.env.FOLDER_PATH!,
    publicId_prefix: process.env.PUBLIC_ID_PREFIX!,
  },
  port: process.env.PORT!,
  googlePass: process.env.PASS_EMAIL_GOOGLE!,
  jwt: {
    accessKey: process.env.JWT_ACCESS_SECRET_KEY!,
    refreshKey: process.env.JWT_REFRESH_SECRET_KEY!,
  },
  facebook: {
    app_id: process.env.FACEBOOK_APP_ID,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    app_callback_url: "http://localhost:3000/auth/facebook/callback",
  },
  redis: {
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
    uri: process.env.REDIS_URI,
  },
};
