/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

interface MovingBorderProps {
  children: React.ReactNode;
}

const MovingBorder: React.FC<MovingBorderProps> = ({ children }) => {
  const radius = 100; // change this to increase the radius of the hover effect
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? radius + "px" : "0px"
            } circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300"
    >
      {children}
    </motion.div>
  );
};

export { MovingBorder };
