import { Link, useLocation } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-buttonborder/20">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span className="font-heading text-2xl text-primary">RetentionIQ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-base transition-colors ${
                isActive('/') ? 'text-primary' : 'text-primary/70 hover:text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/customers"
              className={`font-paragraph text-base transition-colors ${
                isActive('/customers') ? 'text-primary' : 'text-primary/70 hover:text-primary'
              }`}
            >
              Customers
            </Link>
            <Link
              to="/cohorts"
              className={`font-paragraph text-base transition-colors ${
                isActive('/cohorts') ? 'text-primary' : 'text-primary/70 hover:text-primary'
              }`}
            >
              Cohort Analysis
            </Link>
            <Link
              to="/request-analysis"
              className={`font-paragraph text-base px-6 py-2 border border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground transition-colors ${
                isActive('/request-analysis') ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              Request Analysis
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
