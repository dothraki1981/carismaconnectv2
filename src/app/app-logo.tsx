import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.5 16.5c-2-1-3.1-3.1-3.1-5.1 0-2.4 1.5-4.4 3.6-5.1" />
      <path d="M15.5 16.5c1.7 1.4 3.5 2.5 5.5 2.5" />
      <path d="M12.4 5.9C10.5 4.6 8.3 4 6 4 3.2 4 1 6.2 1 9c0 2.2 1.5 4.1 3.6 4.8" />
      <path d="M4.6 13.8c-.6-.8-1-1.8-1-2.8 0-2.8 2.2-5 5-5 .7 0 1.4.1 2.1.4" />
    </svg>
  );
}
