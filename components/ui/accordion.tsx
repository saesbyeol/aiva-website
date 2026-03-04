"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: number | string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<number | string | null>(null);

  return (
    <div className={cn("divide-y divide-border", className)} role="list">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div role="listitem">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
      >
        <span className="text-h4 font-semibold text-fg">{item.question}</span>
        <span
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full border border-border-strong flex items-center justify-center transition-all duration-300",
            isOpen && "border-accent bg-accent/10 rotate-0"
          )}
          aria-hidden="true"
        >
          {isOpen ? (
            <Minus className="w-4 h-4 text-accent" />
          ) : (
            <Plus className="w-4 h-4 text-fg-secondary" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-6 text-body-lg text-fg-secondary leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
