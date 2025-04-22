import React from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { LogIn, MenuIcon } from 'lucide-react';
import { appData } from "@/lib/data";
import Image from "next/image";
import { ThemeSwitcher } from "../theme-switcher";

const Navbar: React.FC = () => {
	const links = [
		{title:"Home",link:"/"},
		{title:"Resume Builder",link:"/builder"},
		{title:"Templates",link:"/templates"},
		{title:"Cover Photos",link:"/coverphotos"},
	]
	return (
		<header className="border-b">
		<div className="container mx-auto flex h-16 items-center justify-between px-4">
			<Button type="button" className="flex md:hidden">
				<MenuIcon className="w-4 h-4" />
			</Button>
			<Link href="/" className="flex items-center space-x-2">
				<Image src="/logo.png?height=56&width=80" width={100} height={56} alt="KaziKit Logo" />
				<span className="text-xl font-bold sr-only">{appData.name}</span>
			</Link>
			<nav className="hidden md:flex items-center space-x-6">
				{links.map((item, index)=>(
				<Link key={index} href={item.link} className="text-sm font-medium transition-colors hover:text-primary">
				{item.title}
				</Link>
				))}
			</nav>
			<div className="flex items-center space-x-4">
			<Link href="/login">
				<Button variant="outline" className="hidden md:flex">
				<LogIn className="mr-2 h-4 w-4" />
				Sign In
				</Button>
			</Link>
			<Link href="/builder">
				<Button>Create Resume</Button>
			</Link>
			<ThemeSwitcher />
			</div>
		</div>
		<div className="w-full">
			<div className="flex flex-col">
				{links.map((item, index)=>(
				<Link key={index} href={item.link} className="text-sm font-medium transition-colors hover:text-primary">
				{item.title}
				</Link>
				))}
			</div>
		</div>
		</header>
	);
};

export default Navbar;
