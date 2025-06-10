import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Grid, FileText, MapPin, Users, Shield } from 'lucide-react';
import AppLogo from './app-logo';

// Main navigation items for the GBV application
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Grid, // Using Grid icon for Dashboard
    },
    {
        title: 'Incidents',
        href: '/incidents',
        icon: FileText, // Using FileText for reporting
    },
    {
        title: 'Case Progress',
        href: '/cases',
        icon: MapPin, // Using MapPin to indicate location/tracking
    },
    {
        title: 'Find Support',
        href: '/chat',
        icon: Users, // Using Users for support services
    },
    {
        title: 'Admin Panel',
        href: '/admin',
        icon: Shield, //Using Shield for Admin panel
    },

];

// Footer navigation items for the GBV application
const footerNavItems: NavItem[] = [
    {
        title: 'About Us',
        href: '/about',
        icon: null,
    },
    // {
    //     title: 'Terms of Service',
    //     href: '/terms',
    //     icon: null,
    // },
    // {
    //     title: 'Privacy Policy',
    //     href: '/privacy',
    //     icon: null,
    // },
    {
        title: 'Contact',
        href: '/contact',
        icon: null,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
