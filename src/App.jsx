import Header from './components/header';

function App() {
	return (
		<>
			<Header />
			<section className='py-10 dark:text-white'>
				<figure className='container mx-auto text-center'>
					<blockquote>
						<h1 className='text-4xl font-semibold mb-5'>Marketiqo</h1>
					</blockquote>
					<figcaption className='blockquote-footer text-slate-700 dark:text-slate-400'>
						<span className='font-semibold'>MarketIQO</span> is your all-in-one e-commerce
						platform, empowering you to build, customize, and manage your online store with
						ease. With user-friendly tools, stunning templates, integrated payments, and
						seamless inventory management, MarketIQO simplifies selling online. Expand your
						reach with multi-channel sales, leverage powerful analytics, and enjoy 24/7
						customer support. Whether you are launching a new business or scaling an
						existing one, MarketIQO is your key to online success. Start selling today!
					</figcaption>
				</figure>
			</section>
		</>
	);
}

export default App;
