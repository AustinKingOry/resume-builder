"use client"
import React from 'react';
import Navbar from "@/components/ui/layout/navbar";

export default function PagesLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
        {children}
        </main>

        <footer className="border-t py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
            </div>
        </footer>
        </div>
    );
};
