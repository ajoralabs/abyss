import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { signIn, signUp } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/login')({
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const name = formData.get('name') as string;

		try {
			if (isLogin) {
				await signIn.email({
					email,
					password,
					callbackURL: '/dashboard',
					fetchOptions: {
						onSuccess: () => {
							navigate({ to: '/dashboard' });
						},
						onError: (ctx) => {
							setError(ctx.error.message);
						},
					},
				});
			} else {
				await signUp.email({
					email,
					password,
					name,
					callbackURL: '/dashboard',
					fetchOptions: {
						onSuccess: () => {
							navigate({ to: '/dashboard' });
						},
						onError: (ctx) => {
							setError(ctx.error.message);
						},
					},
				});
			}
		} catch (err) {
			setError('An unexpected error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-abyss-950 px-6">
			<Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-white text-center">
						{isLogin ? 'Welcome Back' : 'Create Account'}
					</CardTitle>
					<CardDescription className="text-gray-400 text-center">
						{isLogin
							? 'Enter your credentials to access your account'
							: 'Sign up to get started with Abyss'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{!isLogin && (
							<div className="space-y-2">
								<Label htmlFor="name" className="text-white">
									Name
								</Label>
								<Input
									id="name"
									name="name"
									placeholder="John Doe"
									required={!isLogin}
									className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
								/>
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-white">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								required
								className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-white">
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
							/>
						</div>

						{error && (
							<p className="text-sm text-red-500 text-center">{error}</p>
						)}

						<Button
							type="submit"
							className="w-full bg-neon-cyan hover:bg-neon-cyan/90 text-abyss-950 font-bold"
							disabled={loading}
						>
							{loading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							{isLogin ? 'Sign In' : 'Sign Up'}
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						variant="link"
						className="w-full text-gray-400 hover:text-white"
						onClick={() => setIsLogin(!isLogin)}
					>
						{isLogin
							? "Don't have an account? Sign up"
							: 'Already have an account? Sign in'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
