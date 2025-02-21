const Img = ({ src = '', alt = '', className = '' }) => {
	return (
		<img
			src={import.meta.env.VITE_BASE_URL + src}
			alt={alt}
			className={className}
		/>
	);
};

export default Img;
