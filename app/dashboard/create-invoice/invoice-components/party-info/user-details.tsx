import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '~/lib/utils';
import { type PartyInfo } from '~/lib/zod';

import { City, Country, State } from 'country-state-city';

import { Button } from '~/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { ChevronUp } from 'lucide-react';

interface UserDetailsProps {
  type: 'reciever' | 'payer';
}

export const UserDetails = ({ type }: UserDetailsProps) => {
  'use no memo';
  const title = type === 'reciever' ? 'Reciever' : 'Payer';
  const form = useFormContext<PartyInfo>();

  const countryCode = form.watch(`${type}.userInfo.address.country`);
  const stateCode = form.watch(`${type}.userInfo.address.state`);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const identityType = form.watch(`${type}.identity.type`);

  return (
    <div className='mb-6 flex flex-col gap-2 rounded-xl p-2 shadow-[rgba(0,0,0,0.1)_0px_1px_2px_0px]'>
      <div className='py-1 text-lg font-semibold text-neutral-700'>
        {title} Details
      </div>
      <FormField
        control={form.control}
        name={`${type}.identity.type`}
        render={({ field }) => (
          <FormItem>
            <Select value={identityType} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select Reciever Type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='ethereumAddress'>Address</SelectItem>
                <SelectItem value='ethereumSmartContract'>
                  Smart Contract Address
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${type}.identity.value`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                autoCorrect='off'
                placeholder={
                  type === 'reciever'
                    ? 'Connect Wallet to Autofill'
                    : '0xe26...aA1'
                }
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex flex-row items-center justify-between'>
        <div className='text-xs font-medium text-neutral-700'>
          {title} Information
        </div>
        <Button
          className='h-8 w-8 rounded-full p-0'
          type='button'
          variant='ghost'
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <ChevronUp
            size={16}
            strokeWidth={2.5}
            className={cn(
              isExpanded ? 'rotate-0' : 'rotate-180',
              'transition-transform duration-200 ease-in-out'
            )}
          />
        </Button>
      </div>
      {isExpanded ? (
        <div className='flex w-full flex-col gap-1'>
          <div className='flex w-full flex-row items-center gap-2'>
            <FormField
              control={form.control}
              name={`${type}.userInfo.firstName`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      autoCorrect='off'
                      placeholder='First Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${type}.userInfo.lastName`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      autoCorrect='off'
                      placeholder='Last Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex w-full flex-row items-center gap-2'>
            <FormField
              control={form.control}
              name={`${type}.userInfo.businessName`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      autoCorrect='off'
                      placeholder='Business Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${type}.userInfo.taxRegistration`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      autoCorrect='off'
                      placeholder='Tax Identification Number (TIN)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`${type}.userInfo.address.street`}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    autoCorrect='off'
                    placeholder='Street Address'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex w-full flex-row items-center gap-2'>
            <FormField
              control={form.control}
              name={`${type}.userInfo.email`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input autoCorrect='off' placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${type}.userInfo.address.country`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Country' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Country.getAllCountries().map((country) => {
                        return (
                          <SelectItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex w-full flex-row items-center gap-2'>
            <FormField
              control={form.control}
              name={`${type}.userInfo.address.state`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='State' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {State.getStatesOfCountry(countryCode).map((state) => {
                        return (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${type}.userInfo.address.city`}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='City' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {City.getCitiesOfState(
                        countryCode ?? '',
                        stateCode ?? ''
                      ).map((city) => {
                        return (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
