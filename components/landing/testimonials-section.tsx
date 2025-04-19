import { Star } from "lucide-react"

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#1E3A8A]/10 px-3 py-1 text-sm text-[#1E3A8A]">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1E3A8A]">
                What Our Users Say
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Hear from professionals who have transformed their career journey with KaziKit.
                </p>
            </div>
            <div className="inline-flex items-center justify-center space-x-1 pt-2">
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
            </div>
            <p className="text-sm text-gray-600">Loved by early professionals across Africa</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col space-y-4 rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                </div>
                <p className="text-gray-600">
                &quot;KaziKit transformed my job search. I created a professional resume and cover letter that helped me land
                my dream job in tech.&quot;
                </p>
                <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                    <p className="font-medium">Sarah M.</p>
                    <p className="text-sm text-gray-600">Software Developer</p>
                </div>
                </div>
            </div>
            <div className="flex flex-col space-y-4 rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                </div>
                <p className="text-gray-600">
                &quot;As a recent graduate, I was struggling to create a professional resume. KaziKit made it simple and I
                received multiple interview calls.&quot;
                </p>
                <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                    <p className="font-medium">David K.</p>
                    <p className="text-sm text-gray-600">Marketing Associate</p>
                </div>
                </div>
            </div>
            <div className="flex flex-col space-y-4 rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                </div>
                <p className="text-gray-600">
                &quot;The skills tracker feature helped me identify gaps in my experience and focus on developing the right
                skills for my career path.&quot;
                </p>
                <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                    <p className="font-medium">Amina J.</p>
                    <p className="text-sm text-gray-600">Project Manager</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    )
}
