import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-[#10B981]/10 px-3 py-1 text-sm text-[#10B981] w-fit">
                Your Career Toolkit
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-[#1E3A8A]">
                Craft. Stand Out. Grow.
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
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
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px]">
                <Image
                    src="/hero.png?height=450&width=450"
                    alt="Person building a digital resume"
                    fill
                    className="object-contain"
                    priority
                />
                </div>
            </div>
            </div>
        </div>
        </section>
    )
}
