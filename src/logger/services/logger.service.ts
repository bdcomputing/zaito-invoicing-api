import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { RequestLogHelper } from 'src/shared/utils/req-log-helper';
import { CreateLogDto, PostLogDto } from '../dto/log.dto';
import { Log } from '../interfaces/log.interface';
import { PaginatedData } from 'src/database/interfaces/paginated-data.interface';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { ExpressQuery } from 'src/shared/utils/express-query.util';

@Injectable()
export class LoggerService extends Logger implements Logger {
  /**
   * Constructor
   * @param logs - The AuthLog model.
   * @param user - The User model.
   */
  constructor(
    @Inject(DatabaseModelEnums.LOG_MODEL)
    private logs: Model<Log>,
  ) {
    super();
  }

  /**
   * Create a new  log
   * @param log the  log data
   * @returns {Promise<void>}
   */
  @OnEvent(SystemEventsEnum.CreateLogEntry, { async: true })
  async create(log: CreateLogDto) {
    const { email, originalReq, userId, method, url } = log;
    const { ip, userAgent } = RequestLogHelper(originalReq);

    // save the log
    const newLog: PostLogDto = {
      method,
      ip,
      userId,
      email,
      userAgent,
      url,
    };

    await this.logs.create(newLog);
  }

  /**
   * Get all logs
   * @param query - The query parameters.
   * @returns {Promise<CustomHttpResponse>} - The response.
   */
  async getAllLogs(query?: ExpressQuery): Promise<CustomHttpResponse> {
    try {
      const email: string | undefined = query?.email
        ? (query.email as string)
        : undefined;

      const limitQ = query.limit;
      const totalDocuments = email
        ? await this.logs.find({ email }).countDocuments().exec()
        : await this.logs.find().countDocuments().exec();

      const limit = +limitQ === -1 ? totalDocuments : +query.limit || 20;
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);

      const sort: any =
        query && query.sort ? { ...(query.sort as any) } : { createdAt: -1 };

      const aggregation: Array<any> = [
        email
          ? {
              $match: {
                email: email,
              },
            }
          : {},
        {
          $match: {
            $or: [
              {
                ip: {
                  $regex: keyword,
                  $options: 'i',
                },
              },
            ],
          },
        },
        {
          $sort: sort,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];
      const search = aggregation.filter(
        (value) => Object.keys(value).length !== 0,
      );
      // Count all documents
      const counts = await this.logs
        .aggregate([...search.slice(0, -2), { $count: 'count' }])
        .exec();

      // get all the auth logs
      const logs: Log[] = await this.logs.aggregate(search).exec();

      const total = counts.length > 0 ? counts[0].count : 0;

      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData = {
        page,
        limit,
        total,
        data: logs,
        pages,
      };
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Logs loaded from database successfully!',
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading Logs from database',
        error,
      );
    }
  }
  override debug(context: string, message: string) {
    if (process.env['NODE_ENV'] !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }
  override log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
  }
  override error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }
  override warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }
  override verbose(context: string, message: string) {
    if (process.env['NODE_ENV'] !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
