/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';

interface MovingBorderProps {
	children: React.ReactNode;
	radius?: number;
	color?: string;
}

const MovingBorder: React.FC<MovingBorderProps> = ({
	children,
	radius = 100,
	color = '#60a5fa',
}) => {
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
				visible ? radius + 'px' : '0px'
			} circle at ${mouseX}px ${mouseY}px,
            ${color},
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
