import * as React from 'react';

const Hero = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-svh">
    <div className="min-w-full max-w-4xl absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto sm:top-1/2">
      {children}
    </div>
  </div>
);

export default Hero;
