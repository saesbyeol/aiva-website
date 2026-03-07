"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ProgressBar() {
  const [show, setShow] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Disable on touch/mobile — continuous scroll tracking causes jank
  React.useEffect(() => {
    setShow(!("ontouchstart" in window || navigator.maxTouchPoints > 0));
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-light))",
      }}
    />
  );
}
