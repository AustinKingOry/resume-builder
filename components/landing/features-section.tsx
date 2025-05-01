import { appData } from "@/lib/data"
import { CheckCircle, Download, Laptop, FileText, Award, Cloud, User, LayoutTemplate, Linkedin, Twitter, Instagram, Shield, ImageIcon } from 'lucide-react';

export function FeaturesSection() {

  // Map icon names to Lucide components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      FileText: <FileText className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Award: <Award className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Cloud: <Cloud className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Image: <ImageIcon className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Download: <Download className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      User: <User className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      LayoutTemplate: <LayoutTemplate className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Linkedin: <Linkedin className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Twitter: <Twitter className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Instagram: <Instagram className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      CheckCircle: <CheckCircle className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Laptop: <Laptop className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />,
      Shield: <Shield className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />
    };
    
    return iconMap[iconName] || <FileText className="h-6 w-6 text-[#1E3A8A] dark:text-blue-600" />;
  };
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
            {appData.features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                {getIconComponent(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-600">{feature.title}</h3>
                <p className="text-gray-600 dark:text-muted-foreground">{feature.description}</p>
            </div>
            ))}
            </div>
        </div>
        </section>
    )
}
