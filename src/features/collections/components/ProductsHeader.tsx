export default function ProductsHeader({ query }: { query?: string }) {
	return (
		<div className="mt-1 mb-3 flex w-full items-center justify-between pl-3">
			<h3 className="text-lg font-semibold text-slate-800">Products</h3>
			{query && <p className="text-slate-500">Results for "{query}".</p>}
		</div>
	);
}
