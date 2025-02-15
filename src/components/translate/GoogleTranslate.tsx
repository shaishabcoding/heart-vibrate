type Language = {
	code: string;
	name: string;
};

declare global {
	interface Window {
		googleTranslateElementInit: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		google: any;
	}
}

const languages: Language[] = [
	{ code: 'en', name: 'English' },
	{ code: 'bn', name: 'Bangla (বাংলা)' },
	{ code: 'hi', name: 'Hindi (हिन्दी)' },
	{ code: 'es', name: 'Spanish (Español)' },
	{ code: 'ar', name: 'Arabic (العربية)' },
	{ code: 'fr', name: 'French (Français)' },
	{ code: 'zh-CN', name: 'Chinese (中文)' },
	{ code: 'ru', name: 'Russian (Русский)' },
	{ code: 'pt', name: 'Portuguese (Português)' },
	{ code: 'ur', name: 'Urdu (اردو)' },
	{ code: 'de', name: 'German (Deutsch)' },
	{ code: 'ja', name: 'Japanese (日本語)' },
	{ code: 'it', name: 'Italian (Italiano)' },
];

const GoogleTranslate = () => {
	const changeLanguage = (langCode: string) => {
		const interval = setInterval(() => {
			const select =
				document.querySelector<HTMLSelectElement>('.goog-te-combo');
			if (select) {
				clearInterval(interval);
				select.value = langCode;
				select.dispatchEvent(new Event('change'));
			}
		}, 500);
	};

	return (
		<div>
			<select
				translate="no"
				onChange={(e) => changeLanguage(e.target.value)}
				style={{
					padding: '8px',
					fontSize: '16px',
					borderRadius: '5px',
					border: '1px solid #ccc',
				}}
			>
				<option value="">Select Language</option>
				{languages.map((lang) => (
					<option
						key={lang.code}
						value={lang.code}
					>
						{lang.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default GoogleTranslate;
