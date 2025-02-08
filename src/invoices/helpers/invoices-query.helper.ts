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
        invoiceId: {
          $toString: '$_id',
        },
        client_id: {
          $toObjectId: '$clientId',
        },
      },
    },
    {
      $lookup: {
        from: 'invoice_items',
        localField: 'invoiceId',
        foreignField: 'invoiceId',
        as: 'items',
      },
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'client_id',
        foreignField: '_id',
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

export function PrepareQueryForInvoice(invoiceId: string) {
  return [
    {
      $addFields: {
        invoiceId: {
          $toString: '$_id',
        },
        client_id: {
          $toObjectId: '$clientId',
        },
      },
    },
    {
      $match: {
        invoiceId: invoiceId,
      },
    },
    {
      $lookup: {
        from: 'invoice_items',
        localField: 'invoiceId',
        foreignField: 'invoiceId',
        as: 'items',
      },
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'client_id',
        foreignField: '_id',
        as: 'client',
      },
    },
    {
      $unwind: '$client',
    },
    {
      $project: {
        client_id: 0,
        invoiceId: 0,
      },
    },
    {
      $limit: 1,
    },
  ];
}
