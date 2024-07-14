import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import LoadingImage from 'public/loading.gif';

interface MessageProps extends PropsWithChildren {
  message?: string;
}

export const Message = ({ message, children }: MessageProps) => {
  return (
    <div className='mx-auto flex flex-col items-center justify-center py-12 text-center'>
      <Image alt='Loading' height={400} src={LoadingImage} width={500} />
      <div className='text-xl font-medium text-neutral-700'>{message}</div>
      {children}
    </div>
  );
};
