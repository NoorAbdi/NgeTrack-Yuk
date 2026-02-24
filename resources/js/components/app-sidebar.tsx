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
import { index as adminCheckpointsIndex } from '@/routes/admin/checkpoints/index';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, QrCode } from 'lucide-react';
import AppLogo from './app-logo';
import { ModeToggle } from '@/components/mode-toggle';

export function AppSidebar() {
    const { props } = usePage();
    const user = (props.auth as { user: { role: string } }).user;
    const dashboardUrl = user.role === 'admin' ? '/admin/dashboard' : dashboard();

    const mainNavItems = [
        {
            title: 'Dashboard',
            href: dashboardUrl, 
            icon: LayoutGrid,
        },
    ];

    if (user.role === 'admin') {
        mainNavItems.push({
            title: 'Manage checkpoints',
            href: '/admin/checkpoints',
            icon: Package,
        });
    } 

    else {
        mainNavItems.push({
            title: 'Scan QR (Demo)',
            href: '/checkpoint/papandayan-pos-1-main-gate',
            icon: QrCode,
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