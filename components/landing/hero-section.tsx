import Image from "next/image"
import { ArrowRight, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background py-16 md:py-20">
        <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-[#10B981]/10 px-3 py-1 text-sm text-[#10B981] w-fit">
                Your Career Toolkit
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-[#1E3A8A] dark:text-blue-600">
                Craft. <br /><span className="text-primary">Stand Out.</span><br /> Grow.
                </h1>
                <p className="max-w-[600px] text-gray-600 dark:text-muted-foreground md:text-xl">
                KaziKit is your all-in-one toolkit to build a standout professional profile and thrive in your career
                journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" asChild>
                    <Link href={'/builder'}>Start Building <ArrowRight className="ml-2 h-4 w-4" /></Link>                    
                </Button>
                <Button size="lg" variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10" asChild>
                    <Link href={'/builder'}>Explore Features</Link>                    
                </Button>
                </div>
            </div>
            <div className="relative mx-auto lg:ml-auto">
                <div className="hidden md:block relative animate-slideInRight">
                    <div className="relative aspect-square bg-white rounded-2xl border overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300 h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px]">
                    <Image 
                        src="/hero.png?height=450&width=450" 
                        width={450} height={450}
                        alt="Professional building a resume"
                        className="object-cover w-full h-full"
                    />
                    </div>
                    
                    <div className="absolute -bottom-8 -left-8 bg-white dark:bg-background rounded-xl shadow-lg p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                        <p className="text-sm font-medium">Resume Builder</p>
                        <p className="text-xs text-muted-foreground">Create professional resumes</p>
                        </div>
                    </div>
                    </div>
                </div>
                {/* <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px]">
                <Image
                    src="/hero.png?height=450&width=450"
                    alt="Person building a digital resume"
                    fill
                    className="object-contain"
                    priority
                />
                </div> */}
            </div>
            </div>
        </div>
        </section>
    )
}
