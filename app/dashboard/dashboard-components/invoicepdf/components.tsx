import { createTw } from 'react-pdf-tailwind';

import { type UserInfo } from '~/lib/invoice';
import { currencyDetails } from '~/lib/payment';
import { APP_URL } from '~/lib/utils';

import { Font, Path, Rect, Svg, Text, View } from '@react-pdf/renderer';
import type { Types } from '@requestnetwork/request-client.js';
import { Country, State } from 'country-state-city';

export const tw = createTw({
  theme: {
    fontFamily: {
      sfProRegular: ['SF Pro Regular'],
      sfProMedium: ['SF Pro Medium'],
      sfProSemibold: ['SF Pro Semibold'],
      sfProBold: ['SF Pro Bold'],
    },
    extend: {
      colors: {
        headings: '#869098',
      },
    },
  },
});

Font.register({
  family: 'SF Pro Regular',
  src: `${APP_URL}/sfPro-regular.otf`,
});

Font.register({
  family: 'SF Pro Medium',
  src: `${APP_URL}/sfPro-medium.otf`,
});

Font.register({
  family: 'SF Pro Semibold',
  src: `${APP_URL}/sfPro-semibold.otf`,
});

Font.register({
  family: 'SF Pro Bold',
  src: `${APP_URL}/sfPro-bold.otf`,
});

export const Logo = () => {
  return (
    <Svg height='64' viewBox='0 0 512 512' width='64'>
      <Path
        d='m58.852 423.328-32.851 61.799.821-336.709c0-67.651 54.613-122.366 122.365-122.366h335.889c-95.469 29.668-194.943 96.702-260.643 173.078-72.474 83.559-113.639 141.047-165.581 224.198'
        fill='#047863'
      />
      <Path
        d='m485.896 26.052s-146.591 68.574-191.35 171.538c-23.815 55.023-29.666 121.235-72.886 162.812-29.667 28.537-71.653 39.215-108.095 57.795-23.816 12.318-68.164 41.576-87.155 67.752h337.12c67.753 0 122.468-54.717 122.468-122.366-.102-.001-.102-337.531-.102-337.531z'
        fill='#06a261'
      />
    </Svg>
  );
};

interface AddressProps extends UserInfo {
  type: 'from' | 'to';
}

export const Address = (props: AddressProps) => {
  const { type, ...userInfo } = props;

  const getCountryName = () => {
    if (userInfo.address?.country) {
      const country = Country.getCountryByCode(userInfo.address.country);
      return country?.name ?? userInfo.address.country;
    }
    return null;
  };

  const getStateName = () => {
    const countryCode = userInfo.address?.country ?? null;
    if (!countryCode) return null;

    const stateCode = userInfo.address?.state ?? null;
    if (!stateCode) return null;

    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state?.name ?? userInfo.address?.state ?? null;
  };

  const countryName = getCountryName();
  const stateName = getStateName();

  return (
    <View style={tw('flex w-full  basis-1/2 flex-col')}>
      <Text style={tw('text-lg font-sfProSemibold text-headings')}>
        Bill {type}
      </Text>
      <Text style={tw('text-lg font-sfProBold text-neutral-700 pb-1')}>
        {`${userInfo.firstName ?? ''} ${userInfo.lastName ?? ''}`}
      </Text>
      <Text
        style={tw(
          'text-lg font-sfProMedium text-neutral-700 leading-[1.2] pb-1'
        )}
      >
        {userInfo.email ? `(${userInfo.email})` : ''}
      </Text>
      <Text
        style={tw('text-lg font-sfProMedium text-neutral-700 leading-[1.2]')}
      >
        {userInfo.address?.street ?? ''}
      </Text>
      <Text
        style={tw('text-lg font-sfProMedium text-neutral-700 leading-[1.2]')}
      >
        {userInfo.address?.city}
      </Text>
      <Text
        style={tw('text-lg font-sfProMedium text-neutral-700 leading-[1.2]')}
      >
        {`${stateName ?? ''} ${countryName ? `, ${countryName}` : ''}`}
      </Text>
    </View>
  );
};

interface PaymentDetailsProps {
  paymentType?: Types.RequestLogic.CURRENCY;
  currency: string;
  network?: string;
}

export const PaymentDetails = (props: PaymentDetailsProps) => {
  return (
    <View style={tw('flex flex-col pt-12')}>
      <Text style={tw('text-lg font-sfProSemibold text-headings py-1')}>
        Payment Details
      </Text>
      <View style={tw('flex flex-col')}>
        <View style={tw('flex flex-row gap-2')}>
          <Text style={tw('font-sfProSemibold text-base text-neutral-600')}>
            Payment Type:{' '}
          </Text>
          <View style={tw('flex flex-row gap-2')}>
            <Text style={tw('font-sfProMedium text-base text-neutral-700')}>
              {props.paymentType ? currencyDetails[props.paymentType] : ''}
            </Text>
          </View>
        </View>
        <View style={tw('flex flex-row gap-2')}>
          <Text style={tw('font-sfProSemibold text-base text-neutral-600')}>
            Currency:{' '}
          </Text>
          <Text style={tw('font-sfProMedium text-base text-neutral-700')}>
            {props.currency}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const CalenderLogo = () => {
  return (
    <Svg
      fill='#fff'
      height='24'
      stroke='currentColor'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      width='24'
    >
      <Path d='M8 2v4' fill='#64707B' stroke='#64707B' strokeWidth={1.5} />
      <Path d='M16 2v4' fill='#64707B' stroke='#64707B' strokeWidth={1.5} />
      <Rect
        height='18'
        rx='2'
        stroke='#64707B'
        strokeWidth={1.5}
        width='18'
        x='3'
        y='4'
      />
      <Path d='M3 10h18' fill='#64707B' stroke='#64707B' strokeWidth={1.5} />
    </Svg>
  );
};

interface DateBoxProps {
  title: string;
  date: string;
}

export const DateBox = ({ title, date }: DateBoxProps) => {
  const jsDate = new Date(date);
  const formattedDate = jsDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={tw('flex flex-col')}>
      <Text style={tw('text-sm font-sfProSemibold text-headings py-1')}>
        {title}
      </Text>
      <View
        style={tw(
          'border border-neutral-300 rounded-md flex flex-row items-center gap-3 w-[12rem] py-1 px-2'
        )}
      >
        <CalenderLogo />
        <Text style={tw('text-base font-sfProMedium text-neutral-700')}>
          {formattedDate}
        </Text>
      </View>
    </View>
  );
};

interface NoteProps {
  text?: string;
}

export const Note = ({ text }: NoteProps) => {
  return (
    <View style={tw('flex flex-col w-full')}>
      <Text style={tw('text-sm font-sfProSemibold text-headings py-1')}>
        Note
      </Text>
      <View
        style={tw(
          'border border-neutral-300 rounded-md flex flex-row items-center gap-3 py-1 px-2'
        )}
      >
        <Text style={tw('text-base font-sfProMedium text-neutral-700')}>
          {text}
        </Text>
      </View>
    </View>
  );
};

interface TableProps {
  items: {
    name?: string;
    quantity?: number;
    unitPrice?: string;
    tax: {
      type: 'percentage' | 'fixed';
      amount?: string;
    };
    discount?: string;
  }[];
}

const calculateTotal = (items: TableProps['items']) => {
  let total = 0;

  items.forEach((item) => {
    const { quantity, unitPrice, tax, discount } = item;
    const base = Number(unitPrice ?? 0) * (quantity ?? 0);
    const discounted = base - Number(discount ?? 0);
    let afterTax: number;

    if (tax.type === 'percentage') {
      afterTax = discounted + discounted * (Number(tax.amount ?? 0) / 100);
    } else {
      afterTax = discounted + Number(tax.amount);
    }

    total += afterTax;
  });

  return total.toFixed(2);
};

export const ItemsTable = ({ items }: TableProps) => {
  return (
    <View style={tw('flex flex-col w-full pt-8 gap-2')}>
      <View
        style={tw(
          'flex flex-row items-center gap-1 justify-around bg-[#01A262] p-2 rounded-t-md text-lg font-sfProSemibold text-white pt-4'
        )}
      >
        <Text style={tw('w-[10rem]')}>Item</Text>
        <Text style={tw('')}>Quantity</Text>
        <Text style={tw('')}>Unit Price</Text>
        <Text style={tw('')}>Tax</Text>
        <Text style={tw('')}>Discount</Text>
        <Text style={tw('')}>Total</Text>
      </View>
      {items.map((item) => {
        const { name, quantity, unitPrice, tax, discount } = item;
        return (
          <View
            key={item.name}
            style={tw(
              'flex flex-row items-center gap-1 justify-around p-2 rounded-md text-lg font-sfProMedium text-neutral-700 px-2 border-b '
            )}
          >
            <Text style={tw('w-[20rem]')}>{name}</Text>
            <Text style={tw('flex-1')}>{quantity ?? '0'}</Text>
            <Text style={tw('flex-1')}>{unitPrice ?? '0'}</Text>
            <Text style={tw('flex-1')}>{tax.amount ?? 0}%</Text>
            <Text style={tw('flex-1')}>{discount}</Text>
            <Text style={tw('flex-1')}>{calculateTotal([item])}</Text>
          </View>
        );
      })}
      <View
        style={tw(
          'flex flex-row items-center gap-1 p-2 rounded-md text-lg font-sfProMedium text-neutral-700 px-2 border-b justify-end border-neutral-300'
        )}
      >
        <Text
          style={tw(
            'font-sfProMedium flex-1 justify-end items-end flex text-neutral-700'
          )}
        >
          Total
        </Text>
        <Text style={tw('px-[6.5rem] text-neutral-700 font-sfProSemibold')}>
          {calculateTotal(items)}
        </Text>
      </View>
    </View>
  );
};

interface PaymentTermsProps {
  terms?: string;
  lateFeesPercent?: number;
  lateFeesFix?: string;
}

export const PaymentTerms = (props: PaymentTermsProps) => {
  const lateFees = Number(props.lateFeesPercent ?? props.lateFeesFix ?? '0');
  const lateFeesType = props.lateFeesPercent ? '%' : '';
  const hasLateFees = Boolean(lateFees);
  return (
    <View style={tw('flex flex-col w-full gap-3 py-12')}>
      <Text style={tw('text-xl font-sfProMedium text-neutral-700')}>
        Payment Terms
      </Text>

      <View
        style={tw(
          'border border-neutral-300 rounded-md flex flex-row items-center gap-3 py-1 px-2'
        )}
      >
        <Text style={tw('text-base font-sfProMedium text-neutral-700')}>
          {props.terms}
        </Text>
      </View>
      {hasLateFees ? (
        <View style={tw('flex flex-row items-center gap-2')}>
          <Text style={tw('text-base font-sfProSemibold text-headings py-1')}>
            Late Fees:
          </Text>
          <Text style={tw('text-base font-sfProMedium text-neutral-700')}>
            {lateFees}
            {lateFeesType}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
