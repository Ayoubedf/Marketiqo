import { Button } from '@/shared/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { notify } from '@/lib/notify';
import { itemVariants } from '@/shared/animations';
import { ActiveSessionsSection, PasswordSection } from '@/features/settings';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { useMemo } from 'react';
import { APP_NAME } from '@/core/config/constants';

const Settings = () => {
	const title = useMemo(() => `Settings | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return (
		<motion.div
			initial="hidden"
			animate="show"
			transition={{ duration: 0.5, ease: 'easeOut' }}
			variants={itemVariants}
			className="container mx-auto max-w-3xl space-y-12 px-6 py-16"
		>
			<h1 className="mb-8 text-3xl font-bold">Settings</h1>

			{/* Password Section */}
			<PasswordSection />

			{/* Active Sessions Section */}
			<ActiveSessionsSection />

			{/* Delete Section */}
			<div>
				<h2 className="mb-4 text-xl font-semibold text-red-600">
					Delete Account
				</h2>
				<Button
					variant="destructive"
					onClick={() => notify.info('Feature coming soon!')}
				>
					<TrashIcon
						className="-ms-1 opacity-60"
						size={16}
						aria-hidden="true"
					/>
					Delete Account
				</Button>
			</div>
		</motion.div>
	);
};

export default Settings;
