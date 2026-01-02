import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { Check } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const features = [
  '50GB cloud storage',
  'Unlimited team members',
  'AI-powered tagging',
  'Version control',
];

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const navigate = useNavigate();

  const { signup, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await signup(fullName, email, password);
      navigate('/', { replace: true });
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your digital assets today"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          helperText="Must be at least 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Workspace name"
          placeholder="My Team"
          helperText="You can invite team members later"
          required
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">Free plan includes:</p>
          <ul className="mt-2 space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create account
        </Button>

        <p className="text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
