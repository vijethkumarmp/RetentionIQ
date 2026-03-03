import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { AnalysisRequests } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface FormData {
  requestTitle: string;
  requestDescription: string;
  requesterName: string;
  requesterEmail: string;
  priorityLevel: string;
  desiredOutcome: string;
}

export default function RequestAnalysisPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>();

  const priorityLevel = watch('priorityLevel');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await BaseCrudService.create<AnalysisRequests>('analysisrequests', {
        _id: crypto.randomUUID(),
        requestTitle: data.requestTitle,
        requestDescription: data.requestDescription,
        requesterName: data.requesterName,
        requesterEmail: data.requesterEmail,
        priorityLevel: data.priorityLevel,
        desiredOutcome: data.desiredOutcome,
        submissionDate: new Date().toISOString(),
        status: 'Pending',
      });

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit analysis request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="font-heading text-5xl text-primary mb-4">Request Custom Analysis</h1>
            <p className="font-paragraph text-xl text-primary/80 max-w-3xl">
              Submit a request for custom retention analysis or specific data insights. Our team will review your request and provide tailored recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-secondary p-8 lg:p-12">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h2 className="font-heading text-3xl text-primary mb-4">Request Submitted!</h2>
                    <p className="font-paragraph text-lg text-primary/80">
                      Thank you for your request. Our team will review it and get back to you within 2-3 business days.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="font-paragraph text-base text-primary mb-2 block">
                        Request Title *
                      </label>
                      <Input
                        {...register('requestTitle', { required: 'Title is required' })}
                        placeholder="e.g., Churn Analysis for Premium Plan Users"
                        className="bg-background border-buttonborder text-primary font-paragraph"
                      />
                      {errors.requestTitle && (
                        <p className="font-paragraph text-sm text-destructive mt-1">
                          {errors.requestTitle.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="font-paragraph text-base text-primary mb-2 block">
                        Description *
                      </label>
                      <Textarea
                        {...register('requestDescription', { required: 'Description is required' })}
                        placeholder="Describe what insights you're looking for and any specific questions you want answered..."
                        rows={5}
                        className="bg-background border-buttonborder text-primary font-paragraph"
                      />
                      {errors.requestDescription && (
                        <p className="font-paragraph text-sm text-destructive mt-1">
                          {errors.requestDescription.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-paragraph text-base text-primary mb-2 block">
                          Your Name *
                        </label>
                        <Input
                          {...register('requesterName', { required: 'Name is required' })}
                          placeholder="John Doe"
                          className="bg-background border-buttonborder text-primary font-paragraph"
                        />
                        {errors.requesterName && (
                          <p className="font-paragraph text-sm text-destructive mt-1">
                            {errors.requesterName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-paragraph text-base text-primary mb-2 block">
                          Email Address *
                        </label>
                        <Input
                          {...register('requesterEmail', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          type="email"
                          placeholder="john@example.com"
                          className="bg-background border-buttonborder text-primary font-paragraph"
                        />
                        {errors.requesterEmail && (
                          <p className="font-paragraph text-sm text-destructive mt-1">
                            {errors.requesterEmail.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="font-paragraph text-base text-primary mb-2 block">
                        Priority Level *
                      </label>
                      <Select
                        value={priorityLevel}
                        onValueChange={(value) => setValue('priorityLevel', value)}
                      >
                        <SelectTrigger className="bg-background border-buttonborder text-primary font-paragraph">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low - General inquiry</SelectItem>
                          <SelectItem value="Medium">Medium - Important insights needed</SelectItem>
                          <SelectItem value="High">High - Urgent business decision</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.priorityLevel && (
                        <p className="font-paragraph text-sm text-destructive mt-1">
                          Priority level is required
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="font-paragraph text-base text-primary mb-2 block">
                        Desired Outcome *
                      </label>
                      <Textarea
                        {...register('desiredOutcome', { required: 'Desired outcome is required' })}
                        placeholder="What specific outcomes or actions do you hope to achieve with this analysis?"
                        rows={4}
                        className="bg-background border-buttonborder text-primary font-paragraph"
                      />
                      {errors.desiredOutcome && (
                        <p className="font-paragraph text-sm text-destructive mt-1">
                          {errors.desiredOutcome.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          Submit Request
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-background border border-buttonborder/30 p-8">
                <h3 className="font-heading text-2xl text-primary mb-4">What to Expect</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="font-heading text-primary">1.</span>
                    <p className="font-paragraph text-base text-primary/80">
                      Our team reviews your request within 24 hours
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-heading text-primary">2.</span>
                    <p className="font-paragraph text-base text-primary/80">
                      We analyze your data and identify key insights
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-heading text-primary">3.</span>
                    <p className="font-paragraph text-base text-primary/80">
                      You receive a detailed report with actionable recommendations
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary p-8">
                <h3 className="font-heading text-2xl text-primary mb-4">Common Requests</h3>
                <ul className="space-y-3">
                  <li className="font-paragraph text-base text-primary/80">
                    • Segment-specific churn analysis
                  </li>
                  <li className="font-paragraph text-base text-primary/80">
                    • Cohort retention patterns
                  </li>
                  <li className="font-paragraph text-base text-primary/80">
                    • Customer lifetime value optimization
                  </li>
                  <li className="font-paragraph text-base text-primary/80">
                    • Regional performance comparison
                  </li>
                  <li className="font-paragraph text-base text-primary/80">
                    • Plan upgrade/downgrade trends
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
