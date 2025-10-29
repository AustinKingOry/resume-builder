import { supabase } from "@/lib/supabase-browser";
import { ResumeData, ResumeDataDb, ATSTest, ATSAnalysisResult } from "@/lib/types";

export const ResumeDB = {
    async createResume (user_id: string, resumeData: ResumeData){
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .insert({
                    user_id,
                    data: resumeData,
                    template_id: resumeData.selectedTemplate,
                })
                .select();
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error adding resume to database:', err);
            return null;
        }
    },
    async updateResume (resume_id: string, resumeData: ResumeDataDb){
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .update(resumeData)
                .eq("id", resume_id)
                .select();
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error syncing resume with database:', err);
            return null;
        }
    },
    async fetchResumeById(id: number, user_id: string): Promise<ResumeDataDb | null>{
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .select('*')
                .eq("id", id)
                .eq("user_id", user_id.trim())
                .maybeSingle();
          
              if (error) {
                console.error('Supabase error fetching resume:', error);
                return null;
              }
          
              if (!data) {
                console.warn(`No resume found for id: ${id} and user: ${user_id}`);
                return null;
              }
          
              return data;
            // if (error) throw error;
            // return data;
        } catch (err) {
            console.error('Unexpected error fetching resume:', err);
            return null;
        }
    },
    async fetchResumesByUser(limit=5, offset = 0, user_id: string): Promise<ResumeDataDb[]>{
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .select('*')
                .eq("user_id", user_id)
                .order('updated_at', { ascending: false })
                .limit(limit)
                .range(offset, offset + limit - 1);
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error fetching user resumes:', err);
            return [];
        }
    },
    async deleteResume (resume_id: string, user_id: string){
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .delete()
                .eq("id",resume_id)
                .eq("user_id",user_id)
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error deleting resume:', err);
            return null;
        }
    },
}


export const AtsDB = {
    async updateAtsTest (test_id: string, testData: ATSTest){
        try {
            const { data, error } = await supabase
                .from('ats_jobs')
                .update(testData)
                .eq("id", test_id)
                .select();
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error syncing ats test with database:', err);
            return null;
        }
    },
    async fetchAtsTestById(id: number, user_id: string): Promise<ATSTest | null>{
        try {
            const { data, error } = await supabase
                .from('ats_jobs')
                .select('*')
                .eq("id", id)
                .eq("user_id", user_id.trim())
                .maybeSingle();
          
              if (error) {
                console.error('Supabase error fetching ats test:', error);
                return null;
              }
          
              if (!data) {
                console.warn(`No ats test found for id: ${id} and user: ${user_id}`);
                return null;
              }
          
              return data;
            // if (error) throw error;
            // return data;
        } catch (err) {
            console.error('Unexpected error fetching ats test:', err);
            return null;
        }
    },
    async fetchAtsTestsByUser(limit=5, offset = 0, user_id: string): Promise<ATSTest[]>{
        try {
            const { data, error } = await supabase
                .from('ats_jobs')
                .select('*')
                .eq("user_id", user_id)
                .eq("status", "completed")
                .order('updated_at', { ascending: false })
                .limit(limit)
                .range(offset, offset + limit - 1);
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error fetching ats tests:', err);
            return [];
        }
    },
    async deleteAtsTest (test_id: string, user_id: string){
        try {
            const { data, error } = await supabase
                .from('ats_jobs')
                .delete()
                .eq("id",test_id)
                .eq("user_id",user_id)
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error deleting ats test:', err);
            return null;
        }
    },

    async fetchTestAnalyis (test_id: string): Promise<ATSAnalysisResult | null>{
        try {
            const { data, error } = await supabase
            .from("ats_responses")
            .select("*")
            .eq("ats_job_id", test_id)
            .maybeSingle();
            if (error) throw error;

            const { data: summary, error:jobError } = await supabase
            .from("ats_jobs")
            .select("summary")
            .eq("id", test_id)
            .maybeSingle();
            if (jobError) throw jobError;
            
            const result = {
                ...data,
                ...summary
            }

            return result;
        } catch (err) {
            console.error('Unexpected error fetching ats test analysis:', err);
            return null;
        }
    },
}