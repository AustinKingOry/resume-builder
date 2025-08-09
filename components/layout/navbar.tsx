"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { LogIn, MenuIcon } from 'lucide-react';
import { appData } from "@/lib/data";
import Image from "next/image";
import { ThemeSwitcher } from "../theme-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../auth-provider";
import { Badge } from '../ui/badge';

const Navbar: React.FC = () => {
	const {user, signOut, isProfileLoading, profile} = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);
	const links = [
		// {title:"Home",link:"/"},
		{title:"Resume Builder",link:"/builder"},
		{title:"Templates",link:"/templates"},
		{title:"Cover Photos",link:"/coverphotos"},
		{title:"Roast My CV",link:"/roast-my-cv"},
		{title:"Pricing",link:"/#pricing"},
	]
	return (
		<header className="fixed top-0 inset-x-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/70 border-b">
		<div className="container mx-auto flex h-16 items-center justify-between px-4">
			<Button type="button" size={"icon"} variant="outline" className="flex md:hidden w-7 h-7" onClick={()=>{setShowDropdown(!showDropdown)}}>
				<MenuIcon className="w-4 h-4" />
			</Button>
			<Link href="/" className="flex items-center space-x-2">
				<Image src="/logo.png?height=56&width=80" width={100} height={56} alt="KaziKit Logo" />
				<span className="text-xl font-bold sr-only">{appData.name}</span>
				<Badge variant="secondary" className="hidden sm:inline-flex">Beta</Badge>
			</Link>
			<nav className="hidden md:flex items-center gap-6 ml-auto mr-8">
				{links.map((item, index)=>(
				<Link key={index} href={item.link} className="text-sm transition-colors hover:text-primary">
				{item.title}
				</Link>
				))}
			</nav>
			<div className="flex items-center space-x-4">
				<ThemeSwitcher />
				<Link href="/builder">
					<Button>Create Resume</Button>
				</Link>
				{user ? 
				<div>
				<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full dark:bg-gray-800">
					<Avatar className="h-8 w-8">
						<AvatarImage src={!isProfileLoading && profile?.avatar || "/placeholder-user.jpg"} alt="User" />
						<AvatarFallback className="dark:bg-gray-800">{!isProfileLoading && profile?.full_name.charAt(0) || "AD"}</AvatarFallback>
					</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator className="dark:bg-gray-800" />
					<DropdownMenuItem asChild><Link href={'/account'}>Profile</Link></DropdownMenuItem>
					<DropdownMenuItem asChild><Link href={'/settings'}>Settings</Link></DropdownMenuItem>
					<DropdownMenuSeparator className="dark:bg-gray-800" />
					<DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
				</DropdownMenuContent>
				</DropdownMenu>
					
				</div>:
				<Link href="/login">
					<Button variant="outline" className="hidden md:flex">
					<LogIn className="mr-2 h-4 w-4" />
					Sign In
					</Button>
				</Link>
				}
			</div>
		</div>
		<div className={`w-full ${showDropdown ? "block":"hidden"} md:hidden border-t`}>
			<div className="flex flex-col">
				{links.map((item, index)=>(
				<Link key={index} href={item.link} className="text-sm font-medium transition-colors hover:text-primary p-2 w-full">
				{item.title}
				</Link>
				))}
			</div>
		</div>
		</header>
	);
};

export default Navbar;
