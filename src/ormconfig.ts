import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
require('dotenv').config();

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  //logging: process.env.NODE_ENV == 'production' ? true : false,
  //insecureAuth: process.env.NODE_ENV == 'production' ? false : true,
  supportBigNumbers: true,
  dateStrings: true,
  bigNumberStrings: true,
  //debug: true,
  synchronize: false,
};
export default config;