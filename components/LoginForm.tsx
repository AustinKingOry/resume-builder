"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, FileText, Loader } from 'lucide-react';
import { appData } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
    
        try {
            const { error } = await signIn(email, password)
            if (error) {
                toast({
                    title: "Error signing in",
                    description: error?.message || "Please check your credentials and try again.",
                    variant: "destructive",
                })
                return;
            }

        } catch (error) {
            console.error("Login error:", error)
            toast({
            title: "Authentication failed",
            description: "Please check your credentials and try again.",
            variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }
  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted dark:bg-gray-950 p-4">
        <Link href="/" className="flex items-center space-x-2 mb-8">
            <FileText className="h-6 w-6" style={{ color: appData.colors.primary }} />
            <span className="text-xl font-bold">{appData.name}</span>
        </Link>
        <form onSubmit={handleSubmit}>
            <Card className="w-full max-w-md">
                <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                    Sign in to access your saved resumes and continue building
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input id="password" 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                    </div>
                </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                    </Link>
                </p>
                </CardFooter>
            </Card>
        </form>
        </div>
    );
};

export default LoginForm;
