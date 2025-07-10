"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, FileText, Loader, Lock, Mail } from 'lucide-react';
import { appData } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";
import { Separator } from "./ui/separator";
import GoogleIcon from "./GoogleIconCustom";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    // const [isGithubLoading, setIsGithubLoading] = useState(false);
  
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


    const handleGoogleSignIn = () => {
        try {
            setIsGoogleLoading(true);
            signInWithGoogle()
        } catch (error) {
            console.error(error);
            toast({
                title: "Authentication failed",
                description: "Please check your credentials and try again.",
                variant: "destructive",
            })            
        } finally {
            setIsGoogleLoading(true);
        }
    };

    // const handleGithubSignIn = () => {
    //     setIsGithubLoading(true);
    //     setTimeout(() => {
    //         setIsGithubLoading(false);
    //         toast({
    //         title: "GitHub Sign-In",
    //         description: "GitHub authentication would be handled here in a real app.",
    //         });
    //     }, 1000);
    // };
  
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
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email address
                        </Label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            name="email"
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-11"
                            required
                        />
                        </div>
                    </div>
            
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                        </Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-11"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Forgot password?
                        </a>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>

                <div className="relative">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white px-3 text-sm text-gray-500">or</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                    >
                        {isGoogleLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                        ) : (
                        <GoogleIcon className="w-5 h-5 mr-2" />
                        )}
                        Continue with Google
                    </Button>
                
                {/* <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
                    onClick={handleGithubSignIn}
                    disabled={isGithubLoading}
                >
                    {isGithubLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                    ) : (
                    <Github className="w-5 h-5 mr-2" />
                    )}
                    Continue with GitHub
                </Button> */}
                </div>
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
