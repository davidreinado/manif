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
  useImperativeHandle,
} from 'react';

import { useIsMobile } from '@/app/hooks/isMobile';

type CustomCSSProperties = CSSProperties & {
  '--os-handle-bg'?: string;
  '--os-handle-bg-hover'?: string;
  '--os-handle-bg-active'?: string;
};

const CustomScrollbar = forwardRef<
  OverlayScrollbarsComponentRef | HTMLDivElement,
  {
    direction?: 'vertical' | 'horizontal';
    children: ReactNode;
    className?: string;
  }
>(({ children, direction = 'vertical', className = '' }, ref) => {
  const osRef = useRef<OverlayScrollbarsComponentRef | HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Set consistent scrollbar styles for both mobile and desktop
  const scrollbarStyle: CustomCSSProperties = {
    height: '100%',
    width: '100%',
    overflowY: direction === 'vertical' ? 'auto' : 'hidden',
    overflowX: direction === 'horizontal' ? 'auto' : 'hidden',
    WebkitOverflowScrolling: 'touch', // enable momentum scroll on iOS
  };

  useImperativeHandle(ref, () => osRef.current as any);

  if (isMobile) {
    return (
      <div
        ref={osRef as any}
        className={`overflow-auto ${className}`}
        style={{
          ...scrollbarStyle,
          maxHeight: 'calc(100vh - 107px)', // ✅ CONSTRAIN HEIGHT ON MOBILE
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <OverlayScrollbarsComponent
      ref={osRef as any}
      className={`os-theme-tight ${className}`}
      options={{
        scrollbars: {
          visibility: 'auto',
          autoHide: direction === 'horizontal' ? 'never' : 'leave',
          dragScroll: true,
        },
        overflow: {
          x: direction === 'horizontal' ? 'scroll' : 'hidden',
          y: direction === 'vertical' ? 'scroll' : 'hidden',
        },
      }}
      style={{
        ...scrollbarStyle,
        // maxHeight: 'calc(100vh - 107px)', // ✅ CONSTRAIN HEIGHT ON DESKTOP TOO
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
});

CustomScrollbar.displayName = 'CustomScrollbar';

export default CustomScrollbar;
