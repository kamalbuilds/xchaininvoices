import { Types } from '@requestnetwork/request-client.js';
import { z } from 'zod';

import { ChainNames, EVMChains } from '../chains';
import { constructZodLiteralUnionType } from '../utils';

export const currencySchema = z.object({
  type: z.nativeEnum(Types.RequestLogic.CURRENCY),
  value: z.string(),
  network: constructZodLiteralUnionType(
    ChainNames.map((chain) => z.literal(chain.id))
  ).optional(),
});

export const PnAnyDeclarativeSchema = z.object({
  id: z.literal('pn-any-declarative'),
  paymentInfo: z.string().optional(),
  refundInfo: z.string().optional(),
  recieverDelegate: z.string().optional(),
  payerDelegate: z.string().optional(),
  salt: z.string().optional(),
});

export const PnAddressBasedSchema = PnAnyDeclarativeSchema.omit({
  id: true,
}).extend({
  id: z.literal('pn-address-based'),
  paymentAddress: z.string(),
  refundAddress: z.string().optional(),
});

export const PnReferenceBasedSchema = PnAddressBasedSchema.omit({
  id: true,
}).extend({
  id: z.literal('pn-reference-based'),
  paymentNetworkName: constructZodLiteralUnionType(
    ChainNames.map((chain) => z.literal(chain.id))
  ).optional(),
});

export const PnFeeReferenceBasedSchema = PnReferenceBasedSchema.omit({
  id: true,
}).extend({
  id: z.literal('pn-fee-reference-based'),
  feeAddress: z
    .string()
    .optional()
    .default('0x0000000000000000000000000000000000000000'),
  feeAmount: z.string().optional().default('0'),
});

export const PnStreamReferenceBasedSchema = PnReferenceBasedSchema.omit({
  id: true,
}).extend({
  id: z.literal('pn-stream-reference-based'),
  expectedFlowRate: z.string(),
  expectedStartDate: z.string(),
});

export const PnAnyToAnyConversionSchema = PnFeeReferenceBasedSchema.omit({
  id: true,
}).extend({
  id: z.literal('pn-any-to-any-conversion'),
  maxRateTimespan: z.number().optional(),
  network: constructZodLiteralUnionType(
    ChainNames.map((chain) => z.literal(chain.id))
  ).optional(),
});

export const PnAnyToErc20Schema = PnAnyToAnyConversionSchema.omit({
  id: true,
  network: true,
}).extend({
  id: z.literal('pn-any-to-erc20'),
  network: constructZodLiteralUnionType(
    EVMChains.map((chain) => z.literal(chain.id)),
    { message: 'Chain should be an EVM chain' }
  ),
  acceptedTokens: z
    .array(z.string())
    .min(1, { message: 'At least one token should be accepted' }),
});

export const PnAnyToEthSchema = PnAnyToAnyConversionSchema.omit({
  id: true,
  network: true,
}).extend({
  id: z.literal('pn-any-to-eth'),
  network: constructZodLiteralUnionType(
    ChainNames.map((chain) => z.literal(chain.id)),
    { message: 'Chain should be an EVM chain' }
  ),
});

export const paymentInfoSchema = z.object({
  currency: currencySchema,
  expectedAmount: z.union([z.string(), z.number()]),
  id: z.nativeEnum(Types.Extension.PAYMENT_NETWORK_ID),
  parameters: z.discriminatedUnion('id', [
    PnAnyDeclarativeSchema,
    PnAddressBasedSchema,
    PnReferenceBasedSchema,
    PnFeeReferenceBasedSchema,
    PnStreamReferenceBasedSchema,
    PnAnyToAnyConversionSchema,
    PnAnyToErc20Schema,
    PnAnyToEthSchema,
  ]),
});

export type Currency = z.infer<typeof currencySchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
