import { create } from 'zustand';

import type { InvoiceInfo, PartyInfo, PaymentInfo } from '../zod';

export enum InvoiceFormStep {
  PartyInfo = 0,
  PaymentInfo,
  InvoiceInfo,
}

interface InvoiceFormState {
  step: InvoiceFormStep;
  partyInfo: PartyInfo | undefined;
  paymentInfo: PaymentInfo | undefined;
  invoiceInfo: InvoiceInfo | undefined;
  setStep: (step: InvoiceFormStep) => void;
  next: () => void;
  previous: () => void;
  setPartyInfo: (data: PartyInfo) => void;
  setPaymentInfo: (data: PaymentInfo) => void;
  setInvoiceInfo: (data: InvoiceInfo) => void;
}

const useInvoiceFormStore = create<InvoiceFormState>((set, get) => ({
  step: InvoiceFormStep.PartyInfo,
  partyInfo: undefined,
  paymentInfo: undefined,
  invoiceInfo: undefined,
  setStep: (step) => set({ step }),
  next: () => {
    const currentStep = get().step;
    set({ step: currentStep + 1 });
  },
  previous: () => {
    const currentStep = get().step;
    set({ step: currentStep - 1 });
  },
  setPartyInfo: (partyInfo) => set({ partyInfo }),
  setPaymentInfo: (paymentInfo) => set({ paymentInfo }),
  setInvoiceInfo: (invoiceInfo) => set({ invoiceInfo }),
}));

export const useInvoiceForm = () => {
  const store = useInvoiceFormStore();
  return { ...store };
};
