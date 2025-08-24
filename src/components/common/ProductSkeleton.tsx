const ProductSkeleton = () => {
	return (
		<div className="mx-auto w-96 max-w-full animate-pulse rounded-xl border-[1px] border-gray-500/10 shadow-sm dark:border-gray-200/20">
			<div aria-busy className="h-80 overflow-hidden rounded-t-xl">
				<div className="h-full w-full bg-gray-300"></div>
			</div>
			<div aria-busy className="rounded-b-xl bg-white p-5 dark:bg-gray-800">
				<span className="loading-skeleton w-[80%]">&zwnj;</span>
				<p aria-busy className="mt-3 mb-5 text-sm">
					<span className="loading-skeleton w-full">&zwnj;</span>
					<span className="loading-skeleton w-full">&zwnj;</span>
				</p>
				<div className="flex gap-2">
					<del aria-busy className="text-sm">
						<span className="loading-skeleton w-10">&zwnj;</span>
					</del>
					<span aria-busy className="text-sm">
						<span className="loading-skeleton w-10">&zwnj;</span>
					</span>
					<div className="ml-auto flex flex-col items-end">
						<div aria-busy className="flex items-center">
							{[...Array(5)].map((_, key) => (
								<span
									key={key}
									className="loading-skeleton mx-[2.5px] h-4 w-4 rounded-full"
								>
									&zwnj;
								</span>
							))}
						</div>
						<p aria-busy className="mt-1 text-sm">
							<span className="loading-skeleton w-12">&zwnj;</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductSkeleton;
