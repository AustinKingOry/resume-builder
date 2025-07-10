import { createServerClient } from "@/lib/supabase-server";
import { ResumeData } from "@/lib/types";

const supabase = await createServerClient();

export const ResumeDB = {
    async createResume (user_id: string, resumeData: ResumeData){
        try {
            const { data, error } = await supabase
                .from('Resumes')
                .insert({
                    user_id,
                    full_name: resumeData,
                    data: resumeData,
                })
                .select();
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Unexpected error adding resume to database:', err);
            return null;
        }
    },
    async updateResume (resume_id: string, resumeData: ResumeData){
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
    async fetchResumeById(id: string): Promise<ResumeData | null>{
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
    async fetchResumesByUser(limit=5, offset = 0, user_id: string): Promise<ResumeData[]>{
        const supabase = await createServerClient();
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