import React, { type ComponentProps } from 'react';

import { cn } from '~/lib/utils';

interface HeaderProps extends ComponentProps<'div'> {
  title?: string;
  description?: string;
}

export const Header = ({
  title,
  description,
  className,
  ...props
}: HeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <h1 className='text-2xl font-semibold text-neutral-700'>{title}</h1>
      <p className='text-gray-500'>{description}</p>
    </div>
  );
};
