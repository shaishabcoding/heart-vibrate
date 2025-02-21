import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
	Mic,
	XCircle,
	CheckCircle,
	PlayCircle,
	PauseCircle,
} from 'lucide-react';

const VoiceRecorder = ({ onSend }: { onSend: (audioBlob: Blob) => void }) => {
	const [recording, setRecording] = useState(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			mediaRecorderRef.current = new MediaRecorder(stream);

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.start();
			setRecording(true);
			setAudioURL(null); // Reset previous audio
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		mediaRecorderRef.current!.onstop = () => {
			const audioBlob = new Blob(audioChunksRef.current, {
				type: 'audio/wav',
			});
			const url = URL.createObjectURL(audioBlob);
			setAudioURL(url);
			setRecording(false);
		};
	};

	const cancelRecording = () => {
		mediaRecorderRef.current?.stop();
		audioChunksRef.current = [];
		setRecording(false);
		setAudioURL(null);
	};

	const sendAudio = () => {
		if (!audioURL) return;
		fetch(audioURL)
			.then((res) => res.blob())
			.then((blob) => {
				onSend(blob);
				setAudioURL(null);
			});
	};

	const togglePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<div className="flex items-center text-sm gap-4">
			<motion.button
				onClick={recording ? cancelRecording : startRecording}
				whileTap={{ scale: 0.9 }}
				animate={{ scale: recording ? [1, 1.2, 1] : 1 }}
				transition={{ duration: 0.5, repeat: recording ? Infinity : 0 }}
				className={`p-2 rounded-full ${
					recording ? 'bg-red-500' : 'bg-blue-500'
				} text-white shadow-lg`}
			>
				<Mic size={24} />
			</motion.button>

			{recording && (
				<motion.button
					onClick={stopRecording}
					whileTap={{ scale: 0.9 }}
					className="p-2 bg-green-500 text-white rounded-full shadow-lg"
				>
					<CheckCircle size={24} />
				</motion.button>
			)}

			{audioURL && (
				<>
					<audio
						ref={audioRef}
						src={audioURL}
						onEnded={() => setIsPlaying(false)}
						className="hidden"
					></audio>
					<motion.button
						onClick={togglePlayPause}
						whileTap={{ scale: 0.9 }}
						className="p-2 bg-yellow-500 text-white rounded-full shadow-lg"
					>
						{isPlaying ? (
							<PauseCircle size={24} />
						) : (
							<PlayCircle size={24} />
						)}
					</motion.button>

					<motion.button
						onClick={sendAudio}
						whileTap={{ scale: 0.9 }}
						className="p-2 bg-green-500 text-white rounded-full shadow-lg"
					>
						<CheckCircle size={24} />
					</motion.button>

					<motion.button
						onClick={cancelRecording}
						whileTap={{ scale: 0.9 }}
						className="p-2 bg-gray-500 text-white rounded-full shadow-lg"
					>
						<XCircle size={24} />
					</motion.button>
				</>
			)}
		</div>
	);
};

export default VoiceRecorder;
