interface InvoiceAggregatePayload {
  keyword: string;
  skip: number;
  limit: number;
  sort: object;
  clientId: string;
  paid: boolean;
}
/**
 * Prepare search for receipts
 *
 * @export
 * @param {string} keyword
 * @return {*}
 */
export function PrepareQueryForInvoices(data: InvoiceAggregatePayload) {
  return [
    {
      $addFields: {
        client_id: {
          $toObjectId: '$clientId',
        },
      },
    },
    {
      $lookup: {
        from: 'clients',
        localField: 'client_id',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1, clientName: 1 } }],
        as: 'client',
      },
    },
    {
      $unwind: '$client',
    },
    {
      $match: {
        clientId: {
          $regex: data.clientId || '',
          $options: 'i',
        },
        balance: data.paid
          ? 0
          : {
              $gt: 0,
            },
        $or: [
          {
            serial: {
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
    {
      $limit: data.limit,
    },
  ];
}
