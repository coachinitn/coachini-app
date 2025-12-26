declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react';

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: { [key: number]: number };
    children?: ReactNode;
    className?: string;
  }

  export interface MasonryProps {
    columnsCount?: number;
    gutter?: string | number;
    children?: ReactNode;
    className?: string;
  }

  export function ResponsiveMasonry(props: ResponsiveMasonryProps): JSX.Element;
  
  export default function Masonry(props: MasonryProps): JSX.Element;
}
