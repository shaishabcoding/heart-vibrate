import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface MovingBorderProps extends React.HTMLAttributes<HTMLDivElement> {
	radius?: number;
	borderColor?: string;
	borderWidth?: number;
	className?: string;
}

/**
 * MovingBorder component creates a dynamic hover border effect around its children.
 */
const MovingBorder: React.FC<MovingBorderProps> = ({
	children,
	radius = 100,
	borderColor = 'var(--blue-500)',
	borderWidth = 2,
	className,
	...props
}) => {
	const [visible, setVisible] = React.useState(false);
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
            ${borderColor},
            transparent 80%
          )
        `,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			className={cn(
				`relative p-[${borderWidth}px] rounded-lg transition duration-300`,
				className
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
};

export default MovingBorder;
