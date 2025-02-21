type RainbowTextProps = {
	children: React.ReactNode;
	className?: string;
};

const RainbowText: React.FC<RainbowTextProps> = ({
	children,
	className = '',
}) => {
	return (
		<span
			className="animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] 
    bg-[200%_auto] bg-clip-text text-transparent"
		>
			<span className={className}>{children}</span>
		</span>
	);
};

export default RainbowText;
