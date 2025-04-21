import React from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { LogIn } from 'lucide-react';
import { appData } from "@/lib/data";
import Image from "next/image";
import { ThemeSwitcher } from "../theme-switcher";

const Navbar: React.FC = () => {
	return (
		<header className="border-b">
		<div className="container mx-auto flex h-16 items-center justify-between px-4">
			<Link href="/" className="flex items-center space-x-2">
				<Image src="/logo.png?height=56&width=80" width={100} height={56} alt="KaziKit Logo" />
				<span className="text-xl font-bold sr-only">{appData.name}</span>
			</Link>
			<nav className="hidden md:flex items-center space-x-6">
			<Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
				Home
			</Link>
			<Link href="/builder" className="text-sm font-medium transition-colors hover:text-primary">
				Resume Builder
			</Link>
			<Link href="/templates" className="text-sm font-medium transition-colors hover:text-primary">
				Templates
			</Link>
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
		</header>
	);
};

export default Navbar;
