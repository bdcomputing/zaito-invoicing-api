export function PrepareBankAggregation(data: {
  keyword: string;
  limit: number;
  sort: any;
  skip: number;
}) {
  const query: Array<any> = [
    {
      $match: {
        name: {
          $regex: data.keyword,
          $options: 'i',
        },
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
  return query.filter((value) => Object.keys(value).length !== 0);
}
