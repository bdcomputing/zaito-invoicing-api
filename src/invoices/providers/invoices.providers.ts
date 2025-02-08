import { Mongoose } from 'mongoose';
import { InvoiceSchema } from '../schemas/invoice.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { InvoicePaymentSchema } from '../schemas/invoice-payment.schema';
import { InvoiceItemSchema } from '../schemas/invoice-item.schema';

export const invoicesProviders = [
  {
    provide: DatabaseModelEnums.INVOICE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.INVOICE_MODEL, InvoiceSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.RECEIPTS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.RECEIPTS_MODEL, InvoicePaymentSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.INVOICE_ITEM_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.INVOICE_ITEM_MODEL, InvoiceItemSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
