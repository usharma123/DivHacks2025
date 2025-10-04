import React from 'react';

import { cn } from '@/lib/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  priority?: boolean;
}
export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, containerClassName, onClick, priority, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={containerClassName}
        {...props}
      >
        <img
          src="/logo/light.svg"
          alt="Merit Systems Logo"
          width={200}
          height={200}
          className={cn('dark:hidden size-6', className)}
          loading={priority ? 'eager' : undefined}
        />
        <img
          src="/logo/dark.svg"
          alt="Merit Systems Logo"
          width={200}
          height={200}
          className={cn('hidden dark:block size-6', className)}
          loading={priority ? 'eager' : undefined}
        />
      </div>
    );
  }
);

Logo.displayName = 'Logo';
