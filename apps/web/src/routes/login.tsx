import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-abyss-950 px-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Initialize Sequence</h1>
          <p className="mt-2 text-gray-400">Authenticating with VoidFlux Core</p>
        </div>

        {/* Auth form will be injected here via Better Auth components */}
        <div className="space-y-4">
          {/* Placeholder for now */}
          <div className="h-12 w-full animate-pulse rounded bg-white/10" />
          <div className="h-12 w-full animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
