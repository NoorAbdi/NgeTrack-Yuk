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
import { dashboard } from '@/routes'; // Helper rute User
import { index as adminCheckpointsIndex } from '@/routes/admin/checkpoints/index'; // Helper rute Checkpoint
// Kita tidak import route dashboard admin dari helper karena mungkin belum digenerate, kita pakai string manual saja dulu
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, QrCode } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { props } = usePage();
    // Pastikan casting tipe user benar agar TypeScript tidak error
    const user = (props.auth as { user: { role: string } }).user;

    // --- LOGIKA LINK DASHBOARD ---
    // Jika role admin -> ke '/admin/dashboard'
    // Jika role user -> ke dashboard() / '/dashboard'
    const dashboardUrl = user.role === 'admin' ? '/admin/dashboard' : dashboard();

    const mainNavItems = [
        {
            title: 'Dashboard',
            href: dashboardUrl, // <--- Gunakan URL dinamis ini
            icon: LayoutGrid,
        },
    ];

    // Menu Tambahan untuk Admin
    if (user.role === 'admin') {
        mainNavItems.push({
            title: 'Manage checkpoints',
            href: adminCheckpointsIndex(),
            icon: Package,
        });
    } 
    // Menu Tambahan untuk User Biasa (Hiker)
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
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}