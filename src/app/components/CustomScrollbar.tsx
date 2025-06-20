'use client';
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef
} from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { useThemeStore } from '@/app/stores/useThemeStore';
import {
  useEffect,
  useRef,
  forwardRef,
  useState,
  type ReactNode,
  type CSSProperties
} from 'react';

type CustomCSSProperties = CSSProperties & {
  '--os-handle-bg'?: string;
  '--os-handle-bg-hover'?: string;
  '--os-handle-bg-active'?: string;
};

const CustomScrollbar = forwardRef<OverlayScrollbarsComponentRef, {
  direction?: 'vertical' | 'horizontal';
  children: ReactNode;
  className?: string;
}>(({ children, direction = 'vertical', className = '' }, ref) => {
  const osRef = useRef<OverlayScrollbarsComponentRef>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const instance = osRef.current?.osInstance();
    if (!instance) return;

    const updateScrollbarAppearance = () => {
      const elements = instance.elements();
      const handles = [
        elements.scrollbarHorizontal?.handle,
        elements.scrollbarVertical?.handle
      ].filter(Boolean) as HTMLElement[];

      handles.forEach(handle => {
        handle.classList.add('custom-scrollbar-handle');
      });
    };

    updateScrollbarAppearance();
    const unsubscribe = instance.on('updated', updateScrollbarAppearance);
    return () => unsubscribe();
  }, [isMobile]);

  const scrollbarStyle: CustomCSSProperties = {
    height: '100%',
    width: '100%',
    cursor: direction === 'horizontal' ? 'grab' : 'auto',
    // '--os-handle-bg': secondaryColor,
    // '--os-handle-bg-hover': secondaryColor,
    // '--os-handle-bg-active': secondaryColor,
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
