import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { AuthLogInterface } from '../interfaces/auth-log.interface';
import { CreateAuthLogDto, PostAuthLogDto } from '../dto/auth-log.dto';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { UserInterface } from '../../users/interfaces/user.interface';
import { ExpressQuery } from 'src/shared/utils/express-query.util';
import { CustomHttpResponse } from 'src/shared';
import { PaginatedDataInterface } from 'src/database/interfaces/paginated-data.interface';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { RequestLogHelper } from 'src/shared/utils/req-log-helper';

@Injectable()
export class AuthLogsService {
  /**
   * Creates an instance of AuthLogsService.
   * @param {Model<AuthLogInterface>} logs
   * @param {Model<UserInterface>} user
   * @memberof AuthLogsService
   */
  constructor(
    @Inject(DatabaseModelEnums.AUTH_LOG_MODEL)
    private logs: Model<AuthLogInterface>,
    @Inject(DatabaseModelEnums.USER_MODEL)
    private user: Model<UserInterface>,
  ) {}

  /**
   * Create a new auth log
   * @param authLog the auth log data
   * @returns {Promise<void>}
   */
  @OnEvent(SystemEventsEnum.AddAuthLog, { async: true })
  async create(authLog: CreateAuthLogDto) {
    const { loginSuccess, email, originalReq } = authLog;
    let { userId } = authLog;
    const { ip, userAgent } = RequestLogHelper(originalReq);
    // get the user id from the email
    if (!userId) {
      userId =
        (
          (await this.user.findOne({ email }).exec()) as UserInterface
        )._id.toString() || undefined;
    }
    // save the log
    const newLog: PostAuthLogDto = {
      ip,
      loginSuccess,
      userId,
      email,
      userAgent,
    };

    await this.logs.create(newLog);
  }

  async getAllAuthLogs(query?: ExpressQuery): Promise<CustomHttpResponse> {
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
      const logs: AuthLogInterface[] = await this.logs.aggregate(search).exec();

      const total = counts.length > 0 ? counts[0].count : 0;

      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedDataInterface = {
        page,
        limit,
        total,
        data: logs,
        pages,
      };
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Auth Logs loaded from database successfully!',
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading Auth Logs from database',
        error,
      );
    }
  }
}
