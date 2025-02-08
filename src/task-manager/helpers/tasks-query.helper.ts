import { AggregationPayload } from 'src/database/interfaces/aggregation.interface';

/**
 * Prepare search for tasks
 *
 * @export
 * @param {string} keyword
 * @return {*}
 */
export function PrepareQueryForTasks(keyword: string) {
  return {
    $or: [
      {
        batchNo: {
          $regex: keyword,
          $options: 'i',
        },
      },

      {
        description: {
          $regex: keyword,
          $options: 'i',
        },
      },
    ],
  };
}

export function PrepareAggregateForTasks(data: AggregationPayload) {
  return [
    {
      $addFields: {
        createdBy: {
          $toObjectId: '$createdBy',
        },
      },
    },
    {
      $match: {
        assignee: {
          $regex: data.clientId,
          $options: 'i',
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'creator',
      },
    },
    {
      $unwind: '$creator',
    },
    {
      $match: {
        $or: [
          {
            batchNo: {
              $regex: data.keyword,
              $options: 'i',
            },
          },

          {
            description: {
              $regex: data.keyword,
              $options: 'i',
            },
          },
          {
            'creator.name': {
              $regex: data.keyword,
              $options: 'i',
            },
          },
        ],
      },
    },
    {
      $sort: data.sort,
    },
    {
      $skip: data.skip,
    },
    data.limit > 0
      ? {
          $limit: data.limit,
        }
      : {},
  ];
}
