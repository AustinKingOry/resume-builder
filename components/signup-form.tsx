"use client"

import React, { useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader } from "lucide-react"
import { appData } from "@/lib/data";
import { useAuth } from "./auth-provider";
import { toast } from "@/hooks/use-toast";

export default function SignupForm () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { signUp } = useAuth()
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
  
      try {
        if (password !== passwordRepeat) {
          toast({
            title: "Passwords do not match",
            description: "The first password does not match with the second one. Try again.",
            variant: "destructive",
          })
          return;
        }
        const { error } = await signUp(email, password, {full_name: name})
        if (error) {
          toast({
            title: "Error signing in",
            description: error.message,
            variant: "destructive",
          })
        } else {
          resetForm();
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

    const resetForm = () => {
      setEmail("");
      setPassword("");
      setName("");
      setPasswordRepeat("");
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Link href="/" className="flex items-center gap-2 mb-8">
            <FileText className="w-6 h-6" style={{ color: appData.colors.primary }} />
            <span className="text-xl font-semibold">{appData.name}</span>
            </Link>
            <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-sm text-gray-500 mt-2">Sign up to start building your professional profile.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="name@example.com" type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="passwordRepeat">Confirm Password</Label>
                <Input id="passwordRepeat" name="passwordRepeat" type="password"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                required  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Signing Up</>: "Sign Up"}</Button>
            </form>
            <div className="text-center text-sm">
                <p>
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Sign in
                </Link>
                </p>
            </div>
            </div>
        </div>
    )
}