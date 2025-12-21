export interface JobApplicationData {
  company_id: number;
  status_id: number;
  position_title: string;
  job_description?: string;
  job_link?: string;
  location?: string;
  job_type: string; 
  date_applied: string;
  application_deadline?: string;
  salary_offered?: number;
}
