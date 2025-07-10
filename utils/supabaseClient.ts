import { supabase } from "@/lib/supabase-browser";
import { ResumeData, ResumeDataDb } from "@/lib/types";

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
    async fetchResumeById(id: string): Promise<ResumeDataDb | null>{
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .select('*')
                .eq("id", id)
                .single();
            if (error) throw error;
            return data;
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
    async deleteResume (resume_id: string){
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .delete()
                .eq("id",resume_id)
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error deleting resume:', err);
            return null;
        }
    },
}