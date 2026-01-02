import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
              <span className="text-xl font-bold text-gray-50">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Motion Atlas</span>
          </Link>

          {/* Title */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-gray-700">{subtitle}</p>}
          </div>

          {/* Content */}
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-400 to-primary-300 p-12">
          <div className="max-w-lg text-center text-gray-950">
            <h1 className="text-4xl font-bold">Manage your digital assets with ease</h1>
            <p className="mt-4 text-lg text-gray-800">
              Store, organize, and collaborate on videos, images, and creative files — all in one
              place.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="rounded-lg bg-gray-950/10 p-4">
                <div className="text-3xl font-bold">50GB</div>
                <div className="text-sm text-gray-800">Storage</div>
              </div>
              <div className="rounded-lg bg-gray-950/10 p-4">
                <div className="text-3xl font-bold">4K</div>
                <div className="text-sm text-gray-800">Video Support</div>
              </div>
              <div className="rounded-lg bg-gray-950/10 p-4">
                <div className="text-3xl font-bold">∞</div>
                <div className="text-sm text-gray-800">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
