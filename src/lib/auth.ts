import { Token, UserReset } from '@/types';
type TokenListener = (token: Token) => void;

export class TokenManager {
	private accessToken: Token = null;
	private listeners = new Set<TokenListener>();

	public setAccessToken(token: Token) {
		this.accessToken = token;
		this.notify();
	}

	public getAccessToken(): Readonly<Token> | null {
		return this.accessToken;
	}

	public clearToken() {
		this.accessToken = null;
		this.notify();
	}

	public subscribe(listener: TokenListener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener); // unsubscribe
	}

	private notify() {
		this.listeners.forEach((cb) => cb(this.accessToken));
	}
}

export class UserResetManager {
	private userReset: UserReset | null = null;
	private listeners = new Set<(user: UserReset | null) => void>();

	public get(): Readonly<UserReset> | null {
		return this.userReset;
	}
	public set = (data: UserReset | null) => {
		this.userReset = data;
		this.notify();
	};
	public update(data: Partial<UserReset>): void {
		if (!this.userReset) {
			throw new Error('Cannot update UserReset: no user set yet.');
		}
		this.userReset = { ...this.userReset, ...data };
		this.notify();
	}
	public clear = (): void => {
		this.userReset = null;
		this.notify();
	};

	public subscribe = (listener: (user: UserReset | null) => void) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener); // unsubscribe
	};

	private notify = () => {
		this.listeners.forEach((cb) => cb(this.userReset));
	};
}

export const tokenManager = new TokenManager();
export const userResetManager = new UserResetManager();
