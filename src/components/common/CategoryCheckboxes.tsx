import { humanize, slugify } from '@/features/category/utils/format';
import { Category, categoryList } from '@/types';

interface CategoryCheckboxProps {
	checkboxId: string;
	category: Category;
	isChecked: boolean;
	handleChange: (category: Category) => void;
}

interface CategoryCheckboxesProps {
	handleChange: (category: Category) => void;
	categories: Category[];
}

function CategoryCheckbox({
	checkboxId,
	category,
	isChecked,
	handleChange,
}: CategoryCheckboxProps) {
	return (
		<div className="inline-flex items-center space-x-2">
			<label className="relative flex items-center">
				<input
					id={checkboxId}
					autoComplete="name"
					type="checkbox"
					checked={isChecked}
					onChange={() => handleChange(category)}
					className="peer h-5 w-5 appearance-none rounded border border-gray-200 shadow transition-all outline-none checked:border-blue-600 checked:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
				/>
				<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-3.5 w-3.5"
						viewBox="0 0 20 20"
						fill="currentColor"
						stroke="currentColor"
						strokeWidth="1"
					>
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				</span>
			</label>
			<label htmlFor={checkboxId} className="cursor-pointer text-sm">
				{humanize(category)}
			</label>
		</div>
	);
}

export function CategoryCheckboxes({
	categories,
	handleChange,
}: CategoryCheckboxesProps) {
	return categoryList.map((category) => {
		const checkboxId = `checkbox-${slugify(category)}`;
		const isChecked = categories.includes(category);

		return (
			<CategoryCheckbox
				key={category}
				checkboxId={checkboxId}
				category={category}
				isChecked={isChecked}
				handleChange={handleChange}
			/>
		);
	});
}
