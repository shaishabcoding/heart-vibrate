import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';
import { IconPhoto, IconVideo } from '@tabler/icons-react';

interface MediaCaptureProps {
	onSend: (media: Blob, type: 'image' | 'video') => void;
}

const MediaCaptureComponent: React.FC<MediaCaptureProps> = ({ onSend }) => {
	const [mediaURL, setMediaURL] = useState<string | null>(null);
	const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const selectMedia = (type: 'image' | 'video') => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = type === 'image' ? 'image/*' : 'video/*';
		input.onchange = (event: Event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (file) {
				setMediaURL(URL.createObjectURL(file));
				setMediaType(type);
			}
		};
		input.click();
	};

	const sendCapture = () => {
		if (!mediaURL || !mediaType) return;
		fetch(mediaURL)
			.then((res) => res.blob())
			.then((blob) => onSend(blob, mediaType));
		setMediaURL(null);
		setMediaType(null);
	};

	return (
		<div className="flex items-center text-sm gap-2">
			<motion.button
				onClick={() => selectMedia('image')}
				whileTap={{ scale: 0.9 }}
				className="p-2 rounded-full bg-blue-500 text-white shadow-lg"
			>
				<IconPhoto size={24} />
			</motion.button>
			<motion.button
				onClick={() => selectMedia('video')}
				whileTap={{ scale: 0.9 }}
				className="p-2 rounded-full bg-blue-500 text-white shadow-lg"
			>
				<IconVideo size={24} />
			</motion.button>

			{mediaURL && mediaType && (
				<div className="fixed z-[999] inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-lg shadow-lg">
						{mediaType === 'video' ? (
							<video
								ref={videoRef}
								src={mediaURL}
								controls
								className="max-w-full max-h-96"
							/>
						) : (
							<img
								src={mediaURL}
								alt="Captured"
								className="max-w-full max-h-96"
							/>
						)}
						<div className="flex justify-end gap-2 mt-4">
							<motion.button
								onClick={sendCapture}
								whileTap={{ scale: 0.9 }}
								className="p-2 bg-green-500 text-white rounded-full shadow-lg"
							>
								<CheckCircle size={24} />
							</motion.button>
							<motion.button
								onClick={() => setMediaURL(null)}
								whileTap={{ scale: 0.9 }}
								className="p-2 bg-gray-500 text-white rounded-full shadow-lg"
							>
								<XCircle size={24} />
							</motion.button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MediaCaptureComponent;
