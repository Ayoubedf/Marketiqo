import { Category } from '@/types';
import { humanize } from '../utils/humanize';

interface ProductsHeaderProps {
	category: Category | null;
}

export default function ProductsHeader({ category }: ProductsHeaderProps) {
	return (
		<div className="mt-1 mb-3 flex w-full items-center justify-between pl-3">
			<div>
				<h3 className="text-lg font-semibold text-slate-800">Products</h3>
				{category && (
					<p className="text-slate-500">
						Overview of the {humanize(category)}.
					</p>
				)}
			</div>
		</div>
	);
}
