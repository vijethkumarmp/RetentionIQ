/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: analysisrequests
 * Interface for AnalysisRequests
 */
export interface AnalysisRequests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  requestTitle?: string;
  /** @wixFieldType text */
  requestDescription?: string;
  /** @wixFieldType text */
  requesterName?: string;
  /** @wixFieldType text */
  requesterEmail?: string;
  /** @wixFieldType text */
  priorityLevel?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType text */
  desiredOutcome?: string;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: cohortanalysisdata
 * Interface for CohortAnalysisData
 */
export interface CohortAnalysisData {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  cohortGroupName?: string;
  /** @wixFieldType text */
  cohortType?: string;
  /** @wixFieldType date */
  cohortStartDate?: Date | string;
  /** @wixFieldType number */
  analysisPeriod?: number;
  /** @wixFieldType number */
  initialCohortSize?: number;
  /** @wixFieldType number */
  retainedCustomers?: number;
  /** @wixFieldType number */
  retentionRate?: number;
  /** @wixFieldType number */
  churnRate?: number;
}


/**
 * Collection ID: customers
 * Interface for CustomerRecords
 */
export interface CustomerRecords {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  customerName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  planType?: string;
  /** @wixFieldType text */
  region?: string;
  /** @wixFieldType date */
  signupDate?: Date | string;
  /** @wixFieldType boolean */
  isChurned?: boolean;
  /** @wixFieldType date */
  churnDate?: Date | string;
  /** @wixFieldType number */
  lifetimeValue?: number;
}


/**
 * Collection ID: retentioninsights
 * Interface for RetentionInsights
 */
export interface RetentionInsights {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  insightTitle?: string;
  /** @wixFieldType text */
  insightCategory?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  recommendation?: string;
  /** @wixFieldType number */
  impactScore?: number;
}
