/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { useState } from "react";

interface MovingBorderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  isActive?: boolean;
  isRead?: boolean;
  logo: string;
  name: string;
  lastMessage: string;
  open: boolean;
}

const MovingBorderLink: React.FC<MovingBorderLinkProps> = ({
  to,
  isActive,
  isRead,
  logo,
  name,
  lastMessage,
  open,
  className,
  ...props
}) => {
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
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`p-[2px] rounded-lg transition duration-300 group/link ${className}`}
    >
      <Link
        to={to}
        className={`flex border active:animate-click items-center gap-2 ${open ? "p-2 rounded-md" : "rounded-full p-1"} ${
          isRead ? "bg-gray-100" : "bg-white"
        } dark:bg-neutral-900 hover:border-2 transition cursor-pointer`}
        {...props}
      >
        <div className="relative">
          <img src={logo} alt="logo" className="h-10 w-10 rounded-full" />
          {isActive && (
            <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0"></div>
          )}
        </div>

        {open && (
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-400">{lastMessage}</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export { MovingBorderLink };