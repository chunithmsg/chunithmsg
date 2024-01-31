/* eslint-disable react/prop-types */
import * as React from 'react';

import { cn } from '@/libs';

const Hero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('min-h-svh', className)} {...props} />
));

Hero.displayName = 'Hero';

const HeroBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'max-w-4xl absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto sm:top-1/2',
      className,
    )}
    {...props}
  />
));

HeroBody.displayName = 'HeroBody';

export { Hero, HeroBody };
