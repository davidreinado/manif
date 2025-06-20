'use client';

import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import {
  useRef,
  forwardRef,
  type ReactNode,
  type CSSProperties,
} from 'react';

import { useIsMobile } from '@/app/hooks/isMobile'; // 👈 custom hook

type CustomCSSProperties = CSSProperties & {
  '--os-handle-bg'?: string;
  '--os-handle-bg-hover'?: string;
  '--os-handle-bg-active'?: string;
};

const CustomScrollbar = forwardRef<
  OverlayScrollbarsComponentRef,
  {
    direction?: 'vertical' | 'horizontal';
    children: ReactNode;
    className?: string;
  }
>(({ children, direction = 'vertical', className = '' }, ref) => {
  const osRef = useRef<OverlayScrollbarsComponentRef>(null);
  const isMobile = useIsMobile(); // ✅ reliable mobile check

  const scrollbarStyle: CustomCSSProperties = {
    height: '100%',
    width: '100%',
    cursor: direction === 'horizontal' ? 'grab' : 'auto',
    // '--os-handle-bg': '#ccc',
    // '--os-handle-bg-hover': '#aaa',
    // '--os-handle-bg-active': '#888',
  };

  if (isMobile) {
    return (
      <div
        ref={ref as any}
        className={`overflow-auto ${className}`}
        style={scrollbarStyle}
      >
        {children}
      </div>
    );
  }

  return (
    <OverlayScrollbarsComponent
      ref={ref || osRef}
      className={`os-theme-tight ${className}`}
      options={{
        scrollbars: {
          visibility: 'auto',
          autoHide: direction === 'horizontal' ? 'never' : 'leave',
          dragScroll: true,
          clickScroll: false,
        },
        overflow: {
          x: direction === 'horizontal' ? 'scroll' : 'hidden',
          y: direction === 'vertical' ? 'scroll' : 'hidden',
        },
        paddingAbsolute: false,
      }}
      style={scrollbarStyle}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
});

CustomScrollbar.displayName = 'CustomScrollbar';

export default CustomScrollbar;
