import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sizes: Record<string, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };

export default function Modal({ open, onClose, title, children, size = 'md', footer }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: string; footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }
    else document.body.style.overflow = '';
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sidebar/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-card rounded-2xl shadow-2xl w-full ${sizes[size] || sizes.md} max-h-[90vh] overflow-hidden flex flex-col border border-border`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold font-heading">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-fg transition-colors" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto p-6 flex-1">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-border bg-surface/50">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
