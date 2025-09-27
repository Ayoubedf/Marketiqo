import ErrorMessage from '@/shared/components/common/ErrorMessage';
import Session from '@/shared/components/sessions/Session';
import SessionSkeleton from '@/shared/components/sessions/SessionSkeleton';
import { ApiError, DeviceLabel, ISession } from '@/types';
import { motion } from 'framer-motion';
import { UAParser } from 'ua-parser-js';

interface ActiveSessionsProps {
	error: ApiError | null;
	loading: boolean;
	sessions: ISession[] | null;
	onRevoke?: (sessionId: string) => void;
}

export function ActiveSessionsList({
	error,
	loading,
	sessions,
	onRevoke,
}: ActiveSessionsProps) {
	const formatUserAgent = (
		ua?: string
	): {
		browser: string;
		device: string;
		deviceLabel: DeviceLabel;
	} => {
		if (!ua) {
			return {
				browser: 'Unknown Browser',
				device: 'Unknown Device',
				deviceLabel: 'Desktop',
			};
		}

		const parser = new UAParser(ua);
		const browser = parser.getBrowser().name ?? 'Unknown Browser';
		const os = parser.getOS().name ?? 'Unknown OS';

		const deviceMap: Record<string, DeviceLabel> = {
			mobile: 'Mobile',
			tablet: 'Tablet',
		};

		const rawDeviceType = parser.getDevice().type ?? 'desktop';
		const deviceLabel = deviceMap[rawDeviceType] ?? 'Desktop';

		return {
			browser,
			device: os,
			deviceLabel,
		};
	};

	return (
		<div className="container mx-auto space-y-2">
			{error ? (
				<ErrorMessage
					title="There was an error while retrieving the sessions."
					reason={error.message}
				/>
			) : loading ? (
				[...Array(3)].map((_, id) => <SessionSkeleton key={`skeleton-${id}`} />)
			) : sessions && sessions.length > 0 ? (
				sessions.map((session) => {
					const { browser, device, deviceLabel } = formatUserAgent(
						session.userAgent
					);
					const createdAt = new Date(session.createdAt).toLocaleDateString(
						'en-US',
						{
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						}
					);

					const sessionInfo = {
						...session,
						browser,
						device,
						deviceLabel,
						createdAt,
					};

					return (
						<Session
							key={sessionInfo.sessionId}
							sessionInfo={sessionInfo}
							onRevoke={onRevoke}
						/>
					);
				})
			) : (
				<motion.p
					className="col-span-full text-center text-gray-500 italic"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					No sessions found.
				</motion.p>
			)}
		</div>
	);
}
