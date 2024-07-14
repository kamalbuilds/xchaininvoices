import { z } from 'zod';

export const invoiceInfoSchema = z
  .object({
    meta: z
      .object({ format: z.literal('rnf_invoice'), version: z.literal('0.0.3') })
      .strict()
      .describe('Meta information about the format'),
    creationDate: z.string().datetime(),
    invoiceNumber: z.string(),
    purchaseOrderId: z.string().optional(),
    note: z.string().optional(),
    terms: z.string().optional(),
    invoiceItems: z.array(
      z
        .object({
          name: z.string(),
          reference: z.string().optional(),
          quantity: z.number().gte(0),
          unitPrice: z.string(),
          discount: z.string().optional(),
          tax: z
            .object({
              amount: z.string(),
              type: z.enum(['percentage', 'fixed']),
            })
            .strict()
            .describe('Tax information about the invoice'),
          currency: z.string().min(2),
          deliveryDate: z.string().datetime().optional(),
          deliveryPeriod: z.string().optional(),
        })
        .strict()
    ),
    paymentTerms: z
      .object({
        dueDate: z.string().datetime().optional(),
        lateFeesPercent: z.number().optional(),
        lateFeesFix: z.string().regex(/^\d+$/).optional(),
        miscellaneous: z.record(z.any()).optional(),
      })
      .strict()
      .describe('Payment terms')
      .optional(),
    miscellaneous: z.record(z.any()).optional(),
  })
  .strict()
  .describe('Request Network Format of an invoice');

export type InvoiceInfo = z.infer<typeof invoiceInfoSchema>;
