import { Link } from 'react-router-dom';
import { BarChart3, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-footerbackground text-primary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
              <span className="font-heading text-xl text-primary-foreground">RetentionIQ</span>
            </div>
            <p className="font-paragraph text-base text-primary-foreground/80 max-w-sm">
              Advanced customer retention and churn analysis platform helping businesses understand customer behavior and improve retention strategies.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg text-primary-foreground mb-6">Quick Links</h3>
            <nav className="flex flex-col gap-4">
              <Link to="/" className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/customers" className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Customer Data
              </Link>
              <Link to="/cohorts" className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Cohort Analysis
              </Link>
              <Link to="/request-analysis" className="font-paragraph text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Request Analysis
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-heading text-lg text-primary-foreground mb-6">Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-foreground/80" />
                <span className="font-paragraph text-base text-primary-foreground/80">insights@retentioniq.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-foreground/80" />
                <span className="font-paragraph text-base text-primary-foreground/80">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <p className="font-paragraph text-sm text-primary-foreground/60 text-center">
            © {new Date().getFullYear()} RetentionIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
