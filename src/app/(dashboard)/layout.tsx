import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName = "User";
  let userDisplayRole = "Petugas";
  let rawRole = "petugas";
  let initials = "U";

  if (user) {
    const { data: pegawai } = await supabase
      .from('pegawai')
      .select('name, role')
      .eq('id', user.id)
      .single();

    if (pegawai) {
      userName = pegawai.name;
      rawRole = pegawai.role;
      userDisplayRole = pegawai.role === 'admin' ? 'Administrator' : (pegawai.role === 'pimpinan' ? 'Pimpinan' : 'Petugas Humas');
      
      const nameParts = pegawai.name.split(' ');
      initials = nameParts.length > 1 
        ? (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase();
    } else {
      userName = user.email || 'User';
      initials = user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar userRole={rawRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar userName={userName} userRole={userDisplayRole} initials={initials} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
