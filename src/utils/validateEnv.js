import { cleanEnv, str, port, url } from 'envalid';

export default function validateEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: port({ default: 3000 }),
    MONGODB_URI: url(),
    JWT_SECRET: str(),
    FRONTEND_URL: url(),
    LOG_LEVEL: str({ 
      choices: ['error', 'warn', 'info', 'debug'],
      default: 'info'
    })
  });
}