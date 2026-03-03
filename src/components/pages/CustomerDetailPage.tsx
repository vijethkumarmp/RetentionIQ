import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Calendar, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { CustomerRecords } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerRecords | null>(null);

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<CustomerRecords>('customers', id!);
      setCustomer(data);
    } catch (error) {
      console.error('Failed to load customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full" style={{ minHeight: '800px' }}>
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 font-paragraph text-base text-linkcolor hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Link>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : !customer ? (
            <div className="text-center py-20">
              <h2 className="font-heading text-3xl text-primary mb-4">Customer Not Found</h2>
              <p className="font-paragraph text-lg text-primary/70">
                The customer you're looking for doesn't exist or has been removed.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="font-heading text-5xl text-primary mb-4">{customer.customerName}</h1>
                    <div className="flex items-center gap-3">
                      {customer.isChurned ? (
                        <>
                          <TrendingDown className="w-5 h-5 text-destructive" />
                          <span className="font-paragraph text-lg text-destructive">Churned Customer</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span className="font-paragraph text-lg text-primary">Active Customer</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-paragraph text-sm text-primary/60 mb-1">Lifetime Value</p>
                    <p className="font-heading text-4xl text-primary">
                      ${customer.lifetimeValue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-secondary p-8"
                >
                  <h2 className="font-heading text-2xl text-primary mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="font-paragraph text-sm text-primary/60">Email</p>
                        <p className="font-paragraph text-base text-primary">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="font-paragraph text-sm text-primary/60">Region</p>
                        <p className="font-paragraph text-base text-primary">{customer.region}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-secondary p-8"
                >
                  <h2 className="font-heading text-2xl text-primary mb-6">Subscription Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="font-paragraph text-sm text-primary/60">Plan Type</p>
                        <p className="font-paragraph text-base text-primary">{customer.planType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="font-paragraph text-sm text-primary/60">Signup Date</p>
                        <p className="font-paragraph text-base text-primary">
                          {customer.signupDate
                            ? format(new Date(customer.signupDate), 'MMMM d, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {customer.isChurned && customer.churnDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-destructive/10 border border-destructive/30 p-8"
                >
                  <h2 className="font-heading text-2xl text-destructive mb-4">Churn Information</h2>
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-destructive/70" />
                    <div>
                      <p className="font-paragraph text-sm text-destructive/70">Churn Date</p>
                      <p className="font-paragraph text-base text-destructive">
                        {format(new Date(customer.churnDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 bg-background border border-buttonborder/30 p-8"
              >
                <h2 className="font-heading text-2xl text-primary mb-6">Customer Timeline</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-paragraph text-base text-primary mb-1">Customer Signed Up</p>
                      <p className="font-paragraph text-sm text-primary/60">
                        {customer.signupDate
                          ? format(new Date(customer.signupDate), 'MMMM d, yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {customer.isChurned && customer.churnDate && (
                    <div className="flex gap-4">
                      <div className="w-3 h-3 rounded-full bg-destructive mt-2"></div>
                      <div>
                        <p className="font-paragraph text-base text-destructive mb-1">Customer Churned</p>
                        <p className="font-paragraph text-sm text-destructive/70">
                          {format(new Date(customer.churnDate), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
