import React, { useEffect, useRef } from 'react';

const Slideout = ({ isOpen, onClose, children }) => {
  const panelRef = useRef(null);

  // Optional: fire a callback after transition ends
  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const handleTransitionEnd = () => {
      if (isOpen && window.electronAPI?.resizeWindow) {
        window.electronAPI.resizeWindow(1000, 600);
      }
    };

    node.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      node.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slideout Panel — respects 64px sidebar */}
      <div
        ref={panelRef}
        style={{ width: 'calc(100% - 64px)', height: 'calc(100% - 24px)' }}
        className={`fixed top-[24px] left-[64px] h-full bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 will-change-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Content */}
        <div className="p-6 h-full">{children}</div>
      </div>
    </>
  );
};

export default Slideout;
