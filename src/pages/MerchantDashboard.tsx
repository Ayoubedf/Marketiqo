import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import StoreCard from '../components/common/StoreCard';

export default function MerchantDashboard() {
	const { user } = useAuth();
	const [stores, setStores] = useState([]);

	useEffect(() => {
		if (user?.role === 'merchant') {
			getStores().then(setStores);
		}
	}, [user]);

	return (
		<div>
			<h1>Your Stores</h1>
			{stores.map((store) => (
				<StoreCard key={store._id} store={store} />
			))}
		</div>
	);
}
