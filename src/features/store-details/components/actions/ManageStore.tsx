import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SettingsIcon } from 'lucide-react';
import { ManageStore as ManageStoreForm } from '../forms/ManageStore';
import { Store } from '@/types';

interface ManageStoreProps {
	store: Store;
}

export const ManageStore = ({ store }: ManageStoreProps) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default" className="flex items-center gap-2">
					<SettingsIcon className="h-4 w-4" />
					Manage Store
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-full p-0 sm:max-w-xl">
				<ScrollArea className="max-h-screen">
					<ManageStoreForm store={store} />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
