import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="bg-background bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to build your future?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Start crafting your professional profile today and take the next step in your career journey.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" asChild>
                <Link href={"/builder"}>Try for Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary bg-primary text-gray-100 hover:bg-primary/10" asChild>
                    <Link href={'/login'}>Log In</Link>
                </Button>
            </div>
            </div>
        </div>
        </section>
    )
}
