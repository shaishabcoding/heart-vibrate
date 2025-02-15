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
import { languages } from '@/lib/languages';
import MovingBorder from '../ui/moving-border';

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
			<MovingBorder>
				<PopoverTrigger asChild>
					<Button
						translate="no"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="rounded-sm bg-white border-0 relative pr-10"
					>
						{value
							? languages.find((lang) => lang.code === value)
									?.name
							: 'Select Language'}
						<ChevronsUpDown className="opacity-50 absolute right-0" />
					</Button>
				</PopoverTrigger>
			</MovingBorder>
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
