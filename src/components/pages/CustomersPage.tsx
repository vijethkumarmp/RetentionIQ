import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingDown, TrendingUp } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { CustomerRecords } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function CustomersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerRecords[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerRecords[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [customers, searchTerm, planFilter, statusFilter, regionFilter]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<CustomerRecords>('customers');
      setCustomers(result.items);
      setFilteredCustomers(result.items);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(
        c =>
          c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(c => c.planType === planFilter);
    }

    if (statusFilter !== 'all') {
      const isChurned = statusFilter === 'churned';
      filtered = filtered.filter(c => c.isChurned === isChurned);
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(c => c.region === regionFilter);
    }

    setFilteredCustomers(filtered);
  };

  const uniquePlans = Array.from(new Set(customers.map(c => c.planType).filter(Boolean)));
  const uniqueRegions = Array.from(new Set(customers.map(c => c.region).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full" style={{ minHeight: '800px' }}>
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl text-primary mb-4">Customer Data</h1>
            <p className="font-paragraph text-xl text-primary/80 max-w-3xl">
              Browse and analyze customer records, subscription information, and churn patterns to identify retention opportunities.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-2xl text-primary">Filter Customers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/50" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-buttonborder text-primary font-paragraph"
                />
              </div>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="bg-background border-buttonborder text-primary font-paragraph">
                  <SelectValue placeholder="Plan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {uniquePlans.map(plan => (
                    <SelectItem key={plan} value={plan!}>
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background border-buttonborder text-primary font-paragraph">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="bg-background border-buttonborder text-primary font-paragraph">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map(region => (
                    <SelectItem key={region} value={region!}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6">
              <p className="font-paragraph text-base text-primary/70">
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>
          </motion.div>

          {/* Customer List */}
          <div style={{ minHeight: '400px' }}>
            {isLoading ? null : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <motion.div
                      key={customer._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/customers/${customer._id}`}
                        className="block bg-background border border-buttonborder/30 p-6 hover:border-buttonborder transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          <div className="md:col-span-2">
                            <h3 className="font-heading text-xl text-primary mb-2">
                              {customer.customerName}
                            </h3>
                            <p className="font-paragraph text-base text-primary/70">{customer.email}</p>
                          </div>

                          <div>
                            <p className="font-paragraph text-sm text-primary/60 mb-1">Plan Type</p>
                            <p className="font-paragraph text-base text-primary">{customer.planType}</p>
                          </div>

                          <div>
                            <p className="font-paragraph text-sm text-primary/60 mb-1">Region</p>
                            <p className="font-paragraph text-base text-primary">{customer.region}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-paragraph text-sm text-primary/60 mb-1">Status</p>
                              <div className="flex items-center gap-2">
                                {customer.isChurned ? (
                                  <>
                                    <TrendingDown className="w-4 h-4 text-destructive" />
                                    <span className="font-paragraph text-base text-destructive">Churned</span>
                                  </>
                                ) : (
                                  <>
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <span className="font-paragraph text-base text-primary">Active</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-paragraph text-sm text-primary/60 mb-1">LTV</p>
                              <p className="font-heading text-lg text-primary">
                                ${customer.lifetimeValue?.toFixed(0) || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="font-paragraph text-xl text-primary/60">No customers found matching your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
