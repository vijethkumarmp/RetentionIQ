import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { TrendingDown, TrendingUp, Users, Calendar, ArrowRight, BarChart3, PieChart, Activity } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { CustomerRecords, CohortAnalysisData, RetentionInsights } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

// HPI 1.7-V

// --- Utility Components ---

const SectionDivider = () => (
  <div className="w-full h-px bg-primary/20 my-0" />
);

const VerticalDivider = () => (
  <div className="hidden lg:block w-px h-full bg-primary/20 absolute right-0 top-0 bottom-0" />
);

// --- Main Component ---

export default function HomePage() {
  // 1. Data Fidelity Protocol: Canonical Data Sources
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    churnedCustomers: 0,
    churnRate: 0,
    avgLifetimeValue: 0,
  });
  const [cohortData, setCohortData] = useState<CohortAnalysisData[]>([]);
  const [insights, setInsights] = useState<RetentionInsights[]>([]);

  // Scroll Hooks for Parallax & Motion
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [customersResult, cohortsResult, insightsResult] = await Promise.all([
        BaseCrudService.getAll<CustomerRecords>('customers'),
        BaseCrudService.getAll<CohortAnalysisData>('cohortanalysisdata', [], { limit: 6 }),
        BaseCrudService.getAll<RetentionInsights>('retentioninsights', [], { limit: 3 }),
      ]);

      const customers = customersResult.items;
      const churned = customers.filter(c => c.isChurned).length;
      const total = customers.length;
      const avgLTV = customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0) / total;

      setMetrics({
        totalCustomers: total,
        churnedCustomers: churned,
        churnRate: total > 0 ? (churned / total) * 100 : 0,
        avgLifetimeValue: avgLTV,
      });

      setCohortData(cohortsResult.items);
      setInsights(insightsResult.items);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = cohortData.map(cohort => ({
    name: cohort.cohortGroupName || 'Unknown',
    retention: cohort.retentionRate || 0,
    churn: cohort.churnRate || 0,
    size: cohort.initialCohortSize || 0,
  }));

  // --- Render ---

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-primary font-paragraph selection:bg-primary selection:text-background overflow-clip">
      <Header />

      {/* HERO SECTION - Replicating the Inspiration Layout Structure */}
      {/* Structure: Massive Typography Top, Full Width Image Bottom */}
      <section className="relative w-full min-h-screen flex flex-col pt-32 lg:pt-40">
        <div className="w-full max-w-[120rem] mx-auto px-6 lg:px-12 flex flex-col z-10">
          
          {/* Brand / Title Area */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center text-center mb-12 lg:mb-24"
          >
            <h1 className="font-heading text-[12vw] leading-[0.85] tracking-tight text-primary uppercase">
              Retention
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <span className="h-px w-12 bg-primary/40 hidden md:block"></span>
              <p className="font-paragraph text-xl md:text-2xl text-primary/80 tracking-wide">
                Intelligence for Sustainable Growth
              </p>
              <span className="h-px w-12 bg-primary/40 hidden md:block"></span>
            </div>
          </motion.div>

          {/* Hero Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex justify-center mb-16"
          >
             <Link
                to="/customers"
                className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full bg-primary text-background transition-all hover:bg-primary/90"
              >
                <span className="relative font-medium text-lg">Explore Data</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
          </motion.div>
        </div>

        {/* Visual Anchor - Full Bleed Image */}
        <motion.div 
          className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden mt-auto"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
           <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-multiply pointer-events-none" />
           <Image
              src="https://static.wixstatic.com/media/ba2849_163f467523a04a89979547cd12838bc4~mv2.png?originWidth=2048&originHeight=768"
              alt="Artisanal data visualization dashboard"
              className="w-full h-full object-cover"
              width={2400}
            />
            {/* Decorative Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 opacity-80" />
        </motion.div>
      </section>

      <SectionDivider />

      {/* METRICS SECTION - Hairline Grid Layout */}
      <section className="w-full bg-background py-24 lg:py-32 relative">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24 max-w-2xl">
            <h2 className="font-heading text-5xl lg:text-6xl text-primary mb-6">
              Performance Indicators
            </h2>
            <p className="text-xl text-primary/70 font-light">
              Real-time analysis of your customer base health, tracking the vital signs of retention and value generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-primary/20">
            {/* Metric 1 */}
            <div className="relative p-8 lg:p-12 group hover:bg-secondary/20 transition-colors duration-500">
              <VerticalDivider />
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <Users className="w-8 h-8 text-primary/60 mb-8" />
                <div>
                  <h3 className="font-heading text-5xl lg:text-6xl text-primary mb-2">
                    {isLoading ? "..." : metrics.totalCustomers}
                  </h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Total Customers</p>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="relative p-8 lg:p-12 group hover:bg-secondary/20 transition-colors duration-500">
              <VerticalDivider />
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <TrendingDown className="w-8 h-8 text-destructive mb-8" />
                <div>
                  <h3 className="font-heading text-5xl lg:text-6xl text-primary mb-2">
                    {isLoading ? "..." : `${metrics.churnRate.toFixed(1)}%`}
                  </h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Churn Rate</p>
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="relative p-8 lg:p-12 group hover:bg-secondary/20 transition-colors duration-500">
              <VerticalDivider />
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <TrendingUp className="w-8 h-8 text-primary/60 mb-8" />
                <div>
                  <h3 className="font-heading text-5xl lg:text-6xl text-primary mb-2">
                    {isLoading ? "..." : `$${metrics.avgLifetimeValue.toFixed(0)}`}
                  </h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Avg Lifetime Value</p>
                </div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="relative p-8 lg:p-12 group hover:bg-secondary/20 transition-colors duration-500">
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <Calendar className="w-8 h-8 text-primary/60 mb-8" />
                <div>
                  <h3 className="font-heading text-5xl lg:text-6xl text-primary mb-2">
                    {isLoading ? "..." : cohortData.length}
                  </h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Active Cohorts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS SECTION - Sticky Layout */}
      <section className="w-full bg-secondary/30 py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Sticky Header */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <h2 className="font-heading text-5xl lg:text-6xl text-primary mb-8">
                  Cohort Analysis
                </h2>
                <p className="text-xl text-primary/80 mb-12 leading-relaxed">
                  Deep dive into retention patterns across different customer segments. Identify where drop-offs occur and correlate them with lifecycle events.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-primary/70">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Retention Curve Stability</span>
                  </div>
                  <div className="flex items-center gap-4 text-primary/70">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span>Churn Risk Factors</span>
                  </div>
                </div>
                
                <div className="mt-12">
                   <Link
                    to="/cohorts"
                    className="inline-flex items-center gap-2 text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                  >
                    View Full Report <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scrollable Charts */}
            <div className="lg:w-2/3 flex flex-col gap-16">
              
              {/* Chart 1: Retention */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-background p-8 lg:p-12 rounded-none border border-primary/10 shadow-sm"
              >
                <div className="flex justify-between items-end mb-8">
                  <h3 className="font-heading text-2xl text-primary">Retention Rate by Cohort</h3>
                  <BarChart3 className="w-6 h-6 text-primary/40" />
                </div>
                <div className="h-[400px] w-full">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10 animate-pulse">Loading Data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5B3A29" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#5B3A29" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#5B3A29" opacity={0.1} vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#5B3A29" 
                          tick={{fill: '#5B3A29', fontSize: 12}} 
                          tickLine={false}
                          axisLine={{ stroke: '#5B3A29', opacity: 0.2 }}
                        />
                        <YAxis 
                          stroke="#5B3A29" 
                          tick={{fill: '#5B3A29', fontSize: 12}} 
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#F0EDE6', border: '1px solid #5B3A29', borderRadius: '0px' }}
                          itemStyle={{ color: '#5B3A29' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="retention" 
                          stroke="#5B3A29" 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#colorRetention)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              {/* Chart 2: Churn */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-background p-8 lg:p-12 rounded-none border border-primary/10 shadow-sm"
              >
                <div className="flex justify-between items-end mb-8">
                  <h3 className="font-heading text-2xl text-primary">Churn Rate Comparison</h3>
                  <PieChart className="w-6 h-6 text-primary/40" />
                </div>
                <div className="h-[400px] w-full">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10 animate-pulse">Loading Data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#5B3A29" opacity={0.1} vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#5B3A29" 
                          tick={{fill: '#5B3A29', fontSize: 12}} 
                          tickLine={false}
                          axisLine={{ stroke: '#5B3A29', opacity: 0.2 }}
                        />
                        <YAxis 
                          stroke="#5B3A29" 
                          tick={{fill: '#5B3A29', fontSize: 12}} 
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#F0EDE6', border: '1px solid #5B3A29', borderRadius: '0px' }}
                          cursor={{fill: '#D9E0B0', opacity: 0.2}}
                        />
                        <Bar dataKey="churn" fill="#DF3131" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS SECTION - Magazine Layout */}
      <section className="w-full bg-background py-24 lg:py-32">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-primary/20 pb-8">
            <h2 className="font-heading text-5xl lg:text-6xl text-primary">
              Strategic Insights
            </h2>
            <p className="text-primary/60 mt-4 md:mt-0">
              AI-driven recommendations based on your data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-secondary/20 animate-pulse"></div>
              ))
            ) : (
              insights.map((insight, index) => (
                <motion.div
                  key={insight._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full"
                >
                  <div className="mb-6 overflow-hidden">
                    <div className="text-8xl font-heading text-secondary-foreground/10 group-hover:text-secondary-foreground/20 transition-colors duration-500">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 border border-primary/20 text-xs uppercase tracking-wider text-primary/70">
                      {insight.insightCategory}
                    </span>
                    <div className="flex items-center gap-1 text-primary">
                      <Activity className="w-4 h-4" />
                      <span className="font-bold text-sm">Impact: {insight.impactScore}/10</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl text-primary mb-4 leading-tight group-hover:underline decoration-1 underline-offset-4">
                    {insight.insightTitle}
                  </h3>
                  
                  <p className="text-primary/80 mb-6 flex-grow leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-primary/10">
                    <p className="text-sm font-medium text-primary italic">
                      "{insight.recommendation}"
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* VISUAL BREATHER / CTA SECTION */}
      <section className="w-full relative py-32 lg:py-48 overflow-hidden bg-primary text-background">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-5xl lg:text-7xl mb-8 text-background">
              Ready to Optimize?
            </h2>
            <p className="font-paragraph text-xl lg:text-2xl text-background/80 mb-12 leading-relaxed">
              Transform your raw data into a competitive advantage. Our advanced analytics suite provides the clarity you need to reduce churn and maximize lifetime value.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/request-analysis"
                className="px-10 py-5 bg-background text-primary font-medium text-lg hover:bg-secondary transition-colors duration-300 min-w-[200px]"
              >
                Request Analysis
              </Link>
              <Link
                to="/customers"
                className="px-10 py-5 border border-background/30 text-background font-medium text-lg hover:bg-background/10 transition-colors duration-300 min-w-[200px]"
              >
                View Demo Data
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}