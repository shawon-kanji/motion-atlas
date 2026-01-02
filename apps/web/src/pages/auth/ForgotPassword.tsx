import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a password reset link">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Mail className="h-8 w-8 text-primary-600" />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="No worries, we'll send you reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Send reset link
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
