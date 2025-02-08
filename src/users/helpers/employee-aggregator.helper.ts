export function PrepareEmployeeAggregation(data: {
  keyword: string;
  limit: number;
  sort: any;
  skip: number;
}) {
  const query: Array<any> = [
    {
      $match: {
        isBackOfficeUser: false,
        name: {
          $regex: data.keyword,
          $options: 'i',
        },
      },
    },
    {
      $addFields: {
        role: {
          $toObjectId: '$role',
        },
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'roles',
      },
    },
    {
      $unwind: '$roles',
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

  return query.filter((value) => Object.keys(value).length !== 0);
}
