import { Mongoose } from 'mongoose';
import { InvoiceSchema } from '../schemas/invoice.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { InvoicePaymentSchema } from '../schemas/invoice-payment.schema';

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
];
