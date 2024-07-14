import { IdentityTypes } from '@requestnetwork/types';
import { isAddress } from 'viem';
import { z } from 'zod';

import { userInfoSchema } from '../invoice';

export const identitySchema = z.object({
  identity: z.object({
    type: z.nativeEnum(IdentityTypes.TYPE),
    value: z.string().refine((value) => {
      return isAddress(value);
    }, 'Invalid Ethereum address'),
  }),
  userInfo: userInfoSchema.optional(),
});

export const partyInfoSchema = z
  .object({
    reciever: identitySchema,
    payer: identitySchema,
    timestamp: z.string().datetime().optional(),
    nonce: z.number().optional(),
  })
  .refine(
    (data) => {
      return data.reciever.identity.value !== data.payer.identity.value;
    },
    { path: ['payer', 'value'], message: 'Reciever and payer cannot be the same' }
  );

export type Identity = z.infer<typeof identitySchema>;
export type PartyInfo = z.infer<typeof partyInfoSchema>;
