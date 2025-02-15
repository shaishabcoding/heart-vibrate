import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { getCookie } from '@/lib/getCookie';

const languages = [
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
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');

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

	useEffect(() => {
		const lang = getCookie('googtrans')?.split('/')?.at(-1);

		if (lang) setValue(lang);
	}, []);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					translate="no"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? languages.find((lang) => lang.code === value)?.name
						: 'Select Language'}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search language..." />
					<CommandList translate="no">
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{languages.map((lang) => (
								<CommandItem
									key={lang.code}
									value={lang.code}
									onSelect={(currentValue) => {
										setValue(
											currentValue === value
												? ''
												: currentValue
										);
										setOpen(false);
										changeLanguage(currentValue);
									}}
								>
									{lang.name}
									<Check
										className={cn(
											'ml-auto',
											value === lang.code
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default GoogleTranslate;
