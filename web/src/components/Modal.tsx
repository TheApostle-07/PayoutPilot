'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save currently focused element
    previouslyFocused.current = document.activeElement as HTMLElement;
    // Prevent background scrolling
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Focus modal content
    contentRef.current?.focus();

    // Handle key events for ESC and Tab trapping
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Restore scrolling
      document.body.style.overflow = originalOverflow;
      // Restore focus
      previouslyFocused.current?.focus();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-6 focus:outline-none transition-transform transform scale-100 animate-fadeIn"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

// Add this to your globals.css or tailwind config for fadeIn animation:
// @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
// .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
