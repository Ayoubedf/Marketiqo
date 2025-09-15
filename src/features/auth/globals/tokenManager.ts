import { Token } from '@/types';
import { jwtDecode } from 'jwt-decode';
type TokenListener = (accessToken: Token, resetToken: Token) => void;

interface ResetTokenPayload {
	email: string;
	iat: number;
	exp: number;
}

export class TokenManager {
	private accessToken: Token = null;
	private resetToken: Token = null;
	private listeners = new Set<TokenListener>();

	public setAccessToken(token: Token) {
		this.accessToken = token;
		this.notify();
	}

	public setResetToken(token: Token) {
		this.resetToken = token;
		this.notify();
	}

	public getAccessToken(): Readonly<Token> {
		return this.accessToken;
	}

	public getResetToken(): Readonly<Token> {
		if (this.resetToken) {
			try {
				const decoded = jwtDecode<ResetTokenPayload>(this.resetToken);
				if (decoded.exp * 1000 < Date.now()) {
					this.resetToken = null;
					this.notify();
				}
			} catch (err) {
				console.error('Invalid reset token:', err);
				this.resetToken = null;
				this.notify();
			}
		}

		return this.resetToken;
	}

	public clear() {
		this.accessToken = null;
		this.resetToken = null;
		this.notify();
	}

	public subscribe(listener: TokenListener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener); // unsubscribe
	}

	private notify() {
		this.listeners.forEach((cb) => cb(this.accessToken, this.resetToken));
	}
}

export const tokenManager = new TokenManager();
