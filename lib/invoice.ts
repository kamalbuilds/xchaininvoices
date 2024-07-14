import { z } from 'zod';

export const userInfoSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
  taxRegistration: z.string().optional(),
  companyRegistration: z.string().optional(),
  miscellaneous: z.record(z.any()).optional(),
});

export const invoiceSchema = z
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
    sellerInfo: userInfoSchema
      .strict()
      .describe('Seller information')
      .optional(),
    buyerInfo: userInfoSchema.strict().describe('Buyer information').optional(),
    invoiceItems: z.array(
      z
        .object({
          name: z.string(),
          reference: z.string().optional(),
          quantity: z.number().gte(0),
          unitPrice: z.string().regex(/^\d+$/),
          discount: z.string().regex(/^\d+$/).optional(),
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

export type UserInfo = z.infer<typeof userInfoSchema>;
export type InvoiceType = z.infer<typeof invoiceSchema>;
// https://icons.llamao.fi/icons/chains/rsz_rsz_zksync era
