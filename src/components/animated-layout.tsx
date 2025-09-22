import { motion, Variants } from 'motion/react';
import { Outlet, useLocation } from 'react-router';

const pageVariants: Variants = {
  initial: {
    opacity: 0.5,
    scale: 0.99,
    y: 15,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  out: {
    opacity: 0.5,
    scale: 0.99,
    y: 15,
  },
};

export default function AnimationLayout() {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.3,
      }}
    >
      <Outlet />
    </motion.div>
  );
}
