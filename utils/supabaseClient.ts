import { supabase } from "@/lib/supabase-browser";
import { ResumeData, ResumeDataDb, ATSTest, ATSAnalysisResult } from "@/lib/types";
import { CoverLetter } from "@/lib/types/cover-letter";

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
/**
 * CoverLettersDB provides CRUD operations for cover letters.
 */
export const CoverLettersDB = {
    /**
     * Create a new cover letter entry in the database.
     * @param user_id - The user's ID.
     * @param coverLetterData - The data for the new cover letter.
     */
    async createCoverLetter(user_id: string, coverLetterData: CoverLetter) {
      try {
        const { data, error } = await supabase
          .from("CoverLetters")
          .insert({
            user_id,
            title: coverLetterData.title,
            company: coverLetterData.company,
            position: coverLetterData.position,
            job_description: coverLetterData.jobDescription,
            content: coverLetterData.content,
            status: coverLetterData.status || "draft",
            word_count: coverLetterData.wordCount || 0,
            downloads: coverLetterData.downloads || 0,
            metadata: coverLetterData.metadata || {},
          })
          .select();
  
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Unexpected error adding cover letter:", err);
        return null;
      }
    },
  
    /**
     * Update a cover letter entry in the database.
     * @param cover_letter_id - The ID of the cover letter.
     * @param updates - The updated fields.
     */
    async updateCoverLetter(cover_letter_id: string, updates: Partial<CoverLetter>) {
      try {
        const { data, error } = await supabase
          .from("CoverLetters")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", cover_letter_id)
          .select();
  
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Unexpected error updating cover letter:", err);
        return null;
      }
    },
  
    /**
     * Fetch a specific cover letter by ID.
     * @param id - The cover letter ID.
     * @param user_id - The user ID for ownership validation.
     */
    async fetchCoverLetterById(id: string, user_id: string): Promise<CoverLetter | null> {
      try {
        const { data, error } = await supabase
          .from("CoverLetters")
          .select("*")
          .eq("id", id)
          .eq("user_id", user_id.trim())
          .maybeSingle();
  
        if (error) {
          console.error("Supabase error fetching cover letter:", error);
          return null;
        }
  
        if (!data) {
          console.warn(`No cover letter found for id: ${id} and user: ${user_id}`);
          return null;
        }
  
        return data;
      } catch (err) {
        console.error("Unexpected error fetching cover letter:", err);
        return null;
      }
    },
  
    /**
     * Fetch all cover letters for a specific user.
     * @param limit - Number of records to fetch.
     * @param offset - Pagination offset.
     * @param user_id - User ID.
     */
    async fetchCoverLettersByUser(limit = 5, offset = 0, user_id: string): Promise<CoverLetter[]> {
      try {
        const { data, error } = await supabase
          .from("CoverLetters")
          .select("*")
          .eq("user_id", user_id)
          .order("updated_at", { ascending: false })
          .range(offset, offset + limit - 1);
  
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Unexpected error fetching user cover letters:", err);
        return [];
      }
    },
  
    /**
     * Delete a cover letter by ID.
     * @param cover_letter_id - The cover letter ID.
     * @param user_id - The user ID for validation.
     */
    async deleteCoverLetter(cover_letter_id: string, user_id: string) {
      try {
        const { data, error } = await supabase
          .from("CoverLetters")
          .delete()
          .eq("id", cover_letter_id)
          .eq("user_id", user_id);
  
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Unexpected error deleting cover letter:", err);
        return null;
      }
    },
  };