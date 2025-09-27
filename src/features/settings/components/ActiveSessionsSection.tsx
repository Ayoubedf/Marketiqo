import { notify } from '@/lib/notify';
import { ActiveSessionsList } from './ActiveSessionsList';
import useSessions from '../hooks/use-sessions';
// import { ISession } from '@/types';

// const sessions: ISession[] = [
// 	{
// 		sessionId: '5c173e6f-5e4c-46c0-b356-099a1a3569c8',
// 		userId: '68d7ecbdfc13ae490d5fe588',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 6.1; rv:21.0) Gecko/20100101 Firefox/21.0',
// 		ip: '249.183.148.133',
// 		createdAt: '4/14/2025',
// 		updatedAt: '8/14/2025',
// 	},
// 	{
// 		sessionId: '8ebef46f-8ed1-43b0-996b-5ba22ccd045e',
// 		userId: '68d7ecbdfc13ae490d5fe589',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
// 		ip: '209.163.177.47',
// 		createdAt: '10/12/2024',
// 		updatedAt: '6/16/2025',
// 		current: true,
// 	},
// 	{
// 		sessionId: 'b6465ea8-c936-4364-9dda-f4d6fa948beb',
// 		userId: '68d7ecbdfc13ae490d5fe58a',
// 		userAgent:
// 			'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; ko-kr) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16',
// 		ip: '171.70.140.195',
// 		createdAt: '1/9/2025',
// 		updatedAt: '12/27/2024',
// 	},
// 	{
// 		sessionId: '3874fb24-43bd-4ec3-86ad-41f6685d46a9',
// 		userId: '68d7ecbdfc13ae490d5fe58b',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0',
// 		ip: '2.44.222.211',
// 		createdAt: '8/28/2025',
// 		updatedAt: '12/5/2024',
// 	},
// 	{
// 		sessionId: '91a15240-f39b-4d21-8ad3-e38f381982f7',
// 		userId: '68d7ecbdfc13ae490d5fe58c',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 5.1; rv:21.0) Gecko/20130401 Firefox/21.0',
// 		ip: '33.251.255.118',
// 		createdAt: '5/17/2025',
// 		updatedAt: '1/10/2025',
// 	},
// 	{
// 		sessionId: '6495790d-12b3-465d-83ab-f7700ce58a88',
// 		userId: '68d7ecbdfc13ae490d5fe58d',
// 		userAgent:
// 			'Mozilla/5.0 (X11; Ubuntu; Linux armv7l; rv:17.0) Gecko/20100101 Firefox/17.0',
// 		ip: '121.43.86.191',
// 		createdAt: '7/21/2025',
// 		updatedAt: '10/8/2024',
// 	},
// 	{
// 		sessionId: '802cc032-97a1-4201-88c4-153abcc88cae',
// 		userId: '68d7ecbdfc13ae490d5fe58e',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
// 		ip: '113.46.238.103',
// 		createdAt: '4/30/2025',
// 		updatedAt: '5/11/2025',
// 	},
// 	{
// 		sessionId: 'a4880f77-2af3-43b5-8613-eb4feb069691',
// 		userId: '68d7ecbdfc13ae490d5fe58f',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 6.2; rv:9.0.1) Gecko/20100101 Firefox/9.0.1',
// 		ip: '145.240.218.25',
// 		createdAt: '9/16/2025',
// 		updatedAt: '4/15/2025',
// 	},
// 	{
// 		sessionId: '39e77e05-464b-45ec-be7b-7f1a77e318b2',
// 		userId: '68d7ecbdfc13ae490d5fe590',
// 		userAgent:
// 			'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) AppleWebKit/534.17 (KHTML, like Gecko) Chrome/11.0.655.0 Safari/534.17',
// 		ip: '208.120.92.128',
// 		createdAt: '1/25/2025',
// 		updatedAt: '12/24/2024',
// 	},
// 	{
// 		sessionId: 'bbc326fe-f13e-41e4-9f10-3961000ae59b',
// 		userId: '68d7ecbdfc13ae490d5fe591',
// 		userAgent:
// 			'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3',
// 		ip: '170.181.212.224',
// 		createdAt: '9/28/2024',
// 		updatedAt: '12/13/2024',
// 	},
// ];

export const ActiveSessionsSection = () => {
	const { error, loading, sessions } = useSessions();

	const onRevoke = () => notify.info('Feature coming soon');
	return (
		<div>
			<h2 className="mb-4 text-xl font-semibold">Active Sessions</h2>
			<ActiveSessionsList
				error={error}
				loading={loading}
				sessions={sessions}
				onRevoke={onRevoke}
			/>
		</div>
	);
};
