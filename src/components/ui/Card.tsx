import { HTMLAttributes, forwardRef } from 'react';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
        {...props}
      />
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
    );
  }
);

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
        {...props}
      />
    );
  }
);

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />;
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };