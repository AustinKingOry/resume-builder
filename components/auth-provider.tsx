/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AuthContextType, Profile } from "@/lib/types"


const Context = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [supabase] = useState(() => createBrowserClient())
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<Profile | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isProfileLoading, setIsProfileLoading] = useState(false)
	const router = useRouter()
	const { toast } = useToast()
	

	const getCurrentProfile = async () => {
		if (!user) return { profile: null, error: new Error("User not authenticated") }

		setIsProfileLoading(true)
		try {
		const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user?.id).single();
		console.log("profile:",data)

		if (error) { throw error }

		setProfile(data)
		return { profile: data, error: null }
		} catch (error: any) {
		console.error("Error fetching profile:", error)
		return { profile: null, error }
		} finally {
		setIsProfileLoading(false)
		}
	}

	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setSession(session)
			setUser(session?.user || null)

			if (session?.user) {
				await getCurrentProfile()
			}

			setIsLoading(false)
		}

		getSession()

		const {
		data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
		setSession(session)
		setUser(session?.user || null)

		if (session?.user) {
			await getCurrentProfile()
		} else {
			setProfile(null)
		}

		setIsLoading(false)
		router.refresh()
		})

		return () => {
		subscription.unsubscribe()
		}
	}, [router, supabase])

	const signIn = async (email: string, password: string) => {
		try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (!error) {
			const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", data.user?.id).single();
			// Create initial profile record
			if(!profile){
				await supabase.from("profiles").insert({
				user_id: data.user.id,
				full_name: data.user.user_metadata.full_name,
				email: email,
				})
			}

			toast({
			title: "Success!",
			description: "You have been signed in.",
			})
			router.push("/")
		}

		return { error }
		} catch (error: any) {
		toast({
			title: "Error signing in",
			description: error.message,
			variant: "destructive",
		})
		return { error }
		}
	}

	const signUp = async (email: string, password: string, userData: any) => {
		try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
			data: userData,
			emailRedirectTo: 'https://kazikit.vercel.app',
			},
		})

		if (!error && data.user) {
			toast({
			title: "Account created!",
			description: "Please check your email to confirm your account.",
			})
		}

		return { error, user: data.user }
		} catch (error: any) {
		toast({
			title: "Error creating account",
			description: error.message,
			variant: "destructive",
		})
		return { error, user: null }
		}
	}

	const signOut = async () => {
		try {
		await supabase.auth.signOut()
		toast({
			title: "Signed out",
			description: "You have been signed out successfully.",
		})
		router.push("/")
		} catch (error: any) {
		toast({
			title: "Error signing out",
			description: error.message,
			variant: "destructive",
		})
		}
	}

	const resetPassword = async (email: string) => {
		try {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		})

		if (!error) {
			toast({
			title: "Password reset email sent",
			description: "Check your email for a password reset link.",
			})
		}

		return { error }
		} catch (error: any) {
		toast({
			title: "Error resetting password",
			description: error.message,
			variant: "destructive",
		})
		return { error }
		}
	}

	const updatePassword = async (password: string) => {
		try {
		const { error } = await supabase.auth.updateUser({
			password,
		})

		if (!error) {
			toast({
			title: "Password updated",
			description: "Your password has been updated successfully.",
			})
		}

		return { error }
		} catch (error: any) {
		toast({
			title: "Error updating password",
			description: error.message,
			variant: "destructive",
		})
		return { error }
		}
	}

	const updateProfile = async (profile: any) => {
		try {
		const { error } = await supabase.from("profiles").update(profile).eq("id", user?.id)

		if (!error) {
			toast({
			title: "Profile updated",
			description: "Your profile has been updated successfully.",
			})
			router.refresh()
		}

		return { error }
		} catch (error: any) {
		toast({
			title: "Error updating profile",
			description: error.message,
			variant: "destructive",
		})
		return { error }
		}
	}

	const value = {
		user,
		session,
		profile,
		isLoading,
		isProfileLoading,
		signIn,
		signUp,
		signOut,
		resetPassword,
		updatePassword,
		updateProfile,
		getCurrentProfile,
	}

	return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAuth = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
