import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
require('dotenv').config();

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_HOST
      : process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_USERNAME
      : process.env.DB_USERNAME,
  password:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_PASSWORD
      : process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_DATABASE
      : process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
  logging: true,
  //insecureAuth: process.env.NODE_ENV == 'production' ? false : true,
  supportBigNumbers: true,
  dateStrings: true,
  bigNumberStrings: true,
  //debug: true,
  synchronize: true,
};
export default config;
