/* eslint-disable react/prop-types */
import * as React from 'react';
import dynamic from 'next/dynamic';
import type * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/libs';

const Root = dynamic(() =>
  import('@radix-ui/react-switch').then((mod) => mod.Root),
);
const Thumb = dynamic(() =>
  import('@radix-ui/react-switch').then((mod) => mod.Thumb),
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className,
    )}
    {...props}
    ref={ref}
  >
    <Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      )}
    />
  </Root>
));

Switch.displayName = Root.displayName;

export { Switch };
