import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, ShieldCheck, User } from "lucide-react";

// Mock Data
const mockPegawaiList = [
  {
    id: "PEG-001",
    name: "Budi Santoso",
    username: "budisantoso",
    email: "budi.santoso@bps.go.id",
    gender: "L",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
  },
  {
    id: "PEG-002",
    name: "Siti Aminah",
    username: "sitiaminah",
    email: "siti.aminah@bps.go.id",
    gender: "P",
    role: "Petugas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti"
  },
  {
    id: "PEG-003",
    name: "Andi Permana",
    username: "andipermana",
    email: "andi.permana@bps.go.id",
    gender: "L",
    role: "Petugas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi"
  },
  {
    id: "PEG-004",
    name: "Rina Kartika",
    username: "rinakartika",
    email: "rina.kartika@bps.go.id",
    gender: "P",
    role: "Petugas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina"
  },
  {
    id: "PEG-005",
    name: "Dewi Lestari",
    username: "dewilestari",
    email: "dewi.lestari@bps.go.id",
    gender: "P",
    role: "Petugas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi"
  }
];

export default function PegawaiPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Data Pegawai</h1>
          <p className="text-muted-foreground text-lg">Manajemen data pegawai humas dan hak akses sistem.</p>
        </div>
        <Button className="w-full sm:w-auto shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Tambah Pegawai
        </Button>
      </div>
      
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama, username, atau email..." className="pl-9 bg-background" />
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Total: {mockPegawaiList.length} Pegawai
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[300px] py-4">Informasi Pegawai</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPegawaiList.map((pegawai) => (
                <TableRow key={pegawai.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={pegawai.avatar} alt={pegawai.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {pegawai.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{pegawai.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-sm font-medium">
                            {pegawai.id}
                          </Badge>
                          {pegawai.gender === 'L' ? (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 rounded-sm">L</span>
                          ) : (
                            <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-1.5 rounded-sm">P</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">@{pegawai.username}</span>
                  </TableCell>
                  <TableCell>{pegawai.email}</TableCell>
                  <TableCell>
                    {pegawai.role === "Admin" ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 flex w-fit items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex w-fit items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" /> Petugas
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
