import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_ROUTES } from '@/constants/app';
import useAuth from '@/hooks/useAuth';
import { AuthContextProps, User } from '@/types/auth';

import {
	BoltIcon,
	ChevronDownIcon,
	LogOutIcon,
	StoreIcon,
	UserPenIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
	const { state, logout } = useAuth() as AuthContextProps;
	const user: User = state?.user || {
		name: 'Guest User',
		email: 'guest@example.com',
		avatar: '',
	};
	const userAvatar =
		user.avatar ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(
			user.name
		)}&background=random&color=fff&size=32&format=svg`;

	const userInfo: User = {
		...user,
		avatar: userAvatar,
	};

	const navigate = useNavigate();
	const handleLogout = () => {
		logout();
		navigate(APP_ROUTES.LOGIN);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="group h-auto p-0 hover:bg-transparent"
				>
					<Avatar>
						<AvatarImage
							src={userInfo?.avatar}
							alt={`${userInfo.name}'s avatar`}
						/>
						<AvatarFallback className="text-xs">{userInfo.name}</AvatarFallback>
					</Avatar>
					<ChevronDownIcon
						size={16}
						className="opacity-60 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-[180deg]"
						aria-hidden="true"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="text-foreground truncate text-sm font-medium">
						{userInfo?.name || 'Guest User'}
					</span>
					<span className="text-muted-foreground truncate text-xs font-normal">
						{userInfo?.email || 'guest@example.com'}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{state?.user ? (
						<>
							<DropdownMenuItem onClick={() => navigate(APP_ROUTES.PROFILE)}>
								<UserPenIcon
									size={16}
									className="opacity-60"
									aria-hidden="true"
								/>
								<span>Edit Profile</span>
							</DropdownMenuItem>

							{state.user.role === 'merchant' && (
								<DropdownMenuItem onClick={() => navigate(APP_ROUTES.STORE)}>
									<StoreIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
									<span>My Store</span>
								</DropdownMenuItem>
							)}

							<DropdownMenuItem onClick={() => navigate(APP_ROUTES.SETTINGS)}>
								<BoltIcon size={16} className="opacity-60" aria-hidden="true" />
								<span>Settings</span>
							</DropdownMenuItem>
						</>
					) : (
						<>
							<DropdownMenuItem onClick={() => navigate(APP_ROUTES.LOGIN)}>
								<span>Log In</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate(APP_ROUTES.REGISTER)}>
								<span>Sign Up</span>
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuGroup>
				{state?.user && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
							<span>Logout</span>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
