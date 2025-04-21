export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#10B981]/10 px-3 py-1 text-sm text-[#10B981]">
                    Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1E3A8A] dark:text-blue-600">
                    How KaziKit Works
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-muted-foreground md:text-xl">
                    Get started in minutes with our simple four-step process.
                </p>
                </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A] text-white">1</div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Fill Details</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Enter your personal and professional information.</p>
                <div className="absolute -right-2 top-2.5 hidden h-0.5 w-full translate-x-1/2 bg-[#1E3A8A] lg:block"></div>
                </div>
                <div className="relative flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A] text-white">2</div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Choose Template</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Select from our modern, professional templates.</p>
                <div className="absolute -right-2 top-2.5 hidden h-0.5 w-full translate-x-1/2 bg-[#1E3A8A] lg:block"></div>
                </div>
                <div className="relative flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A] text-white">3</div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Preview & Tweak</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Preview your document and make any necessary adjustments.</p>
                <div className="absolute -right-2 top-2.5 hidden h-0.5 w-full translate-x-1/2 bg-[#1E3A8A] lg:block"></div>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A] text-white">4</div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">Save & Download</h3>
                <p className="text-gray-600 dark:text-muted-foreground">Save your progress and download your finished documents.</p>
                </div>
            </div>
            </div>
        </section>
    )
}
  