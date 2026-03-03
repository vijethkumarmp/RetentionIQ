import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { CohortAnalysisData } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CohortsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [cohorts, setCohorts] = useState<CohortAnalysisData[]>([]);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<CohortAnalysisData>('cohortanalysisdata');
      setCohorts(result.items);
    } catch (error) {
      console.error('Failed to load cohorts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retentionChartData = cohorts.map(cohort => ({
    name: cohort.cohortGroupName || 'Unknown',
    retention: cohort.retentionRate || 0,
    initial: cohort.initialCohortSize || 0,
    retained: cohort.retainedCustomers || 0,
  }));

  const churnChartData = cohorts.map(cohort => ({
    name: cohort.cohortGroupName || 'Unknown',
    churn: cohort.churnRate || 0,
  }));

  const avgRetention =
    cohorts.length > 0
      ? cohorts.reduce((sum, c) => sum + (c.retentionRate || 0), 0) / cohorts.length
      : 0;

  const avgChurn =
    cohorts.length > 0
      ? cohorts.reduce((sum, c) => sum + (c.churnRate || 0), 0) / cohorts.length
      : 0;

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
            <h1 className="font-heading text-5xl text-primary mb-4">Cohort Analysis</h1>
            <p className="font-paragraph text-xl text-primary/80 max-w-3xl">
              Analyze customer cohorts grouped by signup period, plan type, or region to understand retention patterns and identify opportunities for improvement.
            </p>
          </motion.div>

          {/* Summary Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-secondary p-8">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-3xl text-primary mb-2">{cohorts.length}</h3>
              <p className="font-paragraph text-base text-primary/70">Total Cohorts</p>
            </div>

            <div className="bg-secondary p-8">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-3xl text-primary mb-2">{avgRetention.toFixed(1)}%</h3>
              <p className="font-paragraph text-base text-primary/70">Avg Retention Rate</p>
            </div>

            <div className="bg-secondary p-8">
              <TrendingDown className="w-10 h-10 text-destructive mb-4" />
              <h3 className="font-heading text-3xl text-primary mb-2">{avgChurn.toFixed(1)}%</h3>
              <p className="font-paragraph text-base text-primary/70">Avg Churn Rate</p>
            </div>
          </motion.div>

          {/* Charts */}
          <div style={{ minHeight: '600px' }}>
            {isLoading ? null : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-secondary p-8 mb-8"
                >
                  <h2 className="font-heading text-3xl text-primary mb-6">Retention Rate by Cohort</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={retentionChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#5B3A29" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#5B3A29" />
                      <YAxis stroke="#5B3A29" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#F0EDE6', border: '1px solid #5B3A29' }}
                        labelStyle={{ color: '#5B3A29' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="retention"
                        stroke="#5B3A29"
                        strokeWidth={3}
                        name="Retention Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-secondary p-8 mb-12"
                >
                  <h2 className="font-heading text-3xl text-primary mb-6">Churn Rate Comparison</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={churnChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#5B3A29" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#5B3A29" />
                      <YAxis stroke="#5B3A29" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#F0EDE6', border: '1px solid #5B3A29' }}
                        labelStyle={{ color: '#5B3A29' }}
                      />
                      <Legend />
                      <Bar dataKey="churn" fill="#DF3131" name="Churn Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Cohort Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="font-heading text-3xl text-primary mb-8">Cohort Details</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {cohorts.map((cohort, index) => (
                      <motion.div
                        key={cohort._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="bg-background border border-buttonborder/30 p-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-2">
                            <h3 className="font-heading text-2xl text-primary mb-2">
                              {cohort.cohortGroupName}
                            </h3>
                            <div className="flex items-center gap-4 text-primary/70">
                              <span className="font-paragraph text-sm">{cohort.cohortType}</span>
                              {cohort.cohortStartDate && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-paragraph text-sm">
                                      {format(new Date(cohort.cohortStartDate), 'MMM yyyy')}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="font-paragraph text-sm text-primary/60 mb-1">Cohort Size</p>
                            <p className="font-heading text-2xl text-primary">
                              {cohort.initialCohortSize || 0}
                            </p>
                            <p className="font-paragraph text-sm text-primary/70 mt-1">
                              Retained: {cohort.retainedCustomers || 0}
                            </p>
                          </div>

                          <div>
                            <p className="font-paragraph text-sm text-primary/60 mb-1">Performance</p>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <TrendingUp className="w-4 h-4 text-primary" />
                                  <span className="font-heading text-lg text-primary">
                                    {cohort.retentionRate?.toFixed(1)}%
                                  </span>
                                </div>
                                <p className="font-paragraph text-xs text-primary/60">Retention</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <TrendingDown className="w-4 h-4 text-destructive" />
                                  <span className="font-heading text-lg text-destructive">
                                    {cohort.churnRate?.toFixed(1)}%
                                  </span>
                                </div>
                                <p className="font-paragraph text-xs text-primary/60">Churn</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
