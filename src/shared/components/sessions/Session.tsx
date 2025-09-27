import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle2, Laptop, Smartphone, Tablet } from 'lucide-react';
import { DeviceLabel, ISession } from '@/types';

type SessionInfo = ISession & {
	browser: string;
	device: string;
	deviceLabel: DeviceLabel;
	createdAt: string;
};

interface SessionProps {
	sessionInfo: SessionInfo;
	onRevoke?: (sessionId: string) => void;
}

const Session = ({ sessionInfo, onRevoke }: SessionProps) => {
	const { sessionId, ip, browser, device, createdAt, deviceLabel } =
		sessionInfo;

	return (
		<div
			key={sessionId}
			className="flex items-center justify-between rounded-lg border p-3"
		>
			<div className="flex items-center gap-3">
				{deviceLabel === 'Mobile' ? (
					<Smartphone className="text-muted-foreground h-5 w-5" />
				) : deviceLabel === 'Tablet' ? (
					<Tablet className="text-muted-foreground h-5 w-5" />
				) : (
					<Laptop className="text-muted-foreground h-5 w-5" />
				)}

				<div>
					<p className="flex space-x-2 font-medium">
						<span>
							{browser} on {device}
						</span>
						{sessionInfo.current && (
							<Badge variant="secondary" className="flex items-center gap-1">
								<CheckCircle2 className="h-3 w-3 text-green-600" />
								This device
							</Badge>
						)}
					</p>
					<p className="text-muted-foreground text-sm">
						{ip || 'Unknown IP'} • {createdAt}
					</p>
				</div>
			</div>

			{!sessionInfo.current && (
				<Button
					variant="default"
					size="sm"
					onClick={() => onRevoke?.(sessionId)}
				>
					Revoke
				</Button>
			)}
		</div>
	);
};

export default Session;
