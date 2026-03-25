import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, QrCode, Users, CalendarClock, Settings } from 'lucide-react';
import AppLogo from './app-logo';
import { ModeToggle } from '@/components/mode-toggle';

export function AppSidebar() {
    const { props } = usePage();
    const user = (props.auth as { user: { role: string } }).user;
    
    const dashboardUrl = user.role === 'admin' 
        ? '/admin/dashboard' 
        : (user.role === 'forestry_officer' ? '/forestry/dashboard' : dashboard());

    const mainNavItems = [
        {
            title: 'Dashboard',
            href: dashboardUrl, 
            icon: LayoutGrid,
        },
    ];

    if (user.role === 'admin') {
        mainNavItems.push({
            title: 'Manage Checkpoints',
            href: '/admin/checkpoints',
            icon: Package,
        });
        
        mainNavItems.push({
            title: 'Manage Officers',
            href: '/admin/forestry-officers',
            icon: Users,
        });

        mainNavItems.push({
            title: 'Manage Alert System',
            href: '/admin/alert-settings',
            icon: Settings,
        });
    } 

    else if (user.role === 'forestry_officer') {
        mainNavItems.push({
            title: 'Special Booking',
            href: '/forestry/extended-booking',
            icon: CalendarClock,
        });
    } 

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between w-full pr-2">
                            <SidebarMenuButton size="lg" asChild className="flex-1">
                                <Link href={dashboardUrl} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                            <ModeToggle />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}