import { Button } from '@/shared/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { PlusCircleIcon } from 'lucide-react';
import { AddProduct as AddProductForm } from '../forms/AddProduct';

export const AddProduct = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<PlusCircleIcon /> Add Product
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-full p-0 sm:max-w-xl">
				<ScrollArea className="max-h-screen">
					<AddProductForm />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
