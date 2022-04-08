import { Logtail } from '@logtail/node';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LogtailLogger implements NestMiddleware {
  logtail = new Logtail(process.env.LOGTAIL_KEY);

  public use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    let reqBody;
    const userAgent = request.get('user-agent') || '';
    let oldWrite = response.write,
      oldEnd = response.end;

    let chunks = [];

    response.write = function (chunk) {
      chunks.push(chunk);

      return oldWrite.apply(response, arguments);
    };

    response.end = function (chunk): any {
      if (chunk) chunks.push(chunk);

      var body = Buffer.concat(chunks).toString('utf8');
      reqBody = body;

      oldEnd.apply(response, arguments);
    };

    response.on('finish', () => {
      const { statusCode } = response;
      const reqMessage = JSON.stringify(request.body);
      //get response body

      statusCode === 200
        ? this.log(
            `${method} ${originalUrl} | User send: ${reqMessage} from (IP: ${ip}) | returned: ${reqBody} with status ${statusCode} | UserAgent: ${userAgent} `,
          )
        : this.error(
            `${method} ${originalUrl} | User send: ${reqMessage} from (IP: ${ip}) | returned: ${reqBody} with status ${statusCode} | UserAgent: ${userAgent} `,
          );
    });

    next();
  }
  //get current timestamp
  private getTimestamp(): string {
    const date = new Date();
    let year = date.getFullYear();
    let month: string | number = date.getMonth();
    let day: string | number = date.getDate();
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();
    if (month < 10) {
      month = `0${month}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    if (hours < 10) {
      hours = `0${hours}`;
    }
    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] `;
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any) {
    this.logtail.info(this.getTimestamp() + message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any) {
    this.logtail.error(this.getTimestamp() + message);
  }
}
