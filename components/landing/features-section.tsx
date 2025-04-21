import { CheckCircle, Download, Laptop, PenTool, Shield, Users } from "lucide-react"

export function FeaturesSection() {
    return (
        <section id="features" className="bg-gray-50 dark:bg-gray-950 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#1E3A8A]/10 px-3 py-1 text-sm text-[#1E3A8A] dark:text-blue-600">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1E3A8A] dark:text-blue-600">
                Everything you need to succeed
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-muted-foreground md:text-xl">
                KaziKit provides all the tools you need to build a standout professional profile and advance your career.
                </p>
            </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 pt-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <PenTool className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Resume Builder</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Customizable templates to create professional resumes that stand out.</p>
            </div>
            <div className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Laptop className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Cover Letter Generator</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Create compelling cover letters tailored to specific job applications.</p>
            </div>
            <div className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Users className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Professional Photo Generator</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Generate professional cover photos to enhance your profile.</p>
            </div>
            <div className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <CheckCircle className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Skills Tracker</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Track and showcase your skills and experience in a compelling way.</p>
            </div>
            <div className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Download className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Local & Cloud Saving</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Save locally or sync with your cloud account for access anywhere.</p>
            </div>
            <div className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Shield className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Real-time Previews</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Preview your documents in real-time with multiple template options.</p>
            </div>
            </div>
        </div>
        </section>
    )
}
