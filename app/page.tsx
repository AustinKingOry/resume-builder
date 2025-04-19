import React from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import Navbar from "@/components/ui/layout/navbar";
import { FileText, Award, Download, Layout, ArrowRight } from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: "Professional Templates",
      description: "Choose from a variety of professionally designed templates that stand out.",
      icon: Layout
    },
    {
      title: "ATS-Friendly",
      description: "Our resumes are optimized to pass through Applicant Tracking Systems.",
      icon: Award
    },
    {
      title: "Easy Export",
      description: "Download your resume as a professional PDF with just one click.",
      icon: Download
    }
  ];

  const steps = [
    {
      title: "Choose a Template",
      description: "Select from our collection of professional, ATS-friendly resume templates."
    },
    {
      title: "Fill in Your Details",
      description: "Enter your information using our intuitive form interface."
    },
    {
      title: "Preview & Customize",
      description: "See your resume take shape in real-time and make adjustments as needed."
    },
    {
      title: "Download & Share",
      description: "Export your resume as a PDF and start applying for jobs."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Create Professional Resumes in Minutes</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build beautiful, ATS-friendly resumes with our easy-to-use resume builder. 
              Choose from professional templates and download as PDF.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/builder">
                <Button size="lg" className="w-full sm:w-auto">
                  <FileText className="mr-2 h-5 w-5" />
                  Create Your Resume
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Layout className="mr-2 h-5 w-5" />
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-card rounded-lg p-6">
                    <div className="text-4xl font-bold text-primary mb-4">{index + 1}</div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 text-muted-foreground transform -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/builder">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Your Resume?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of job seekers who have successfully created professional 
              resumes and landed their dream jobs.
            </p>
            <Link href="/builder">
              <Button size="lg" variant="secondary">
                Build Your Resume Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;