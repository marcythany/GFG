import * as React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full min-w-0 rounded-md border border-secondary bg-primary px-3 py-2 text-sm',
        ' file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'file:text-foreground  focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
