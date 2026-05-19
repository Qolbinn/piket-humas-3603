import Link from 'next/link'
import { Pencil, UserCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Pegawai } from '@/lib/types/database'
import DeletePegawaiButton from './DeletePegawaiButton'

interface PegawaiTableProps {
  pegawaiList: Pegawai[]
  isAdmin: boolean
}

export default function PegawaiTable({ pegawaiList, isAdmin }: PegawaiTableProps) {
  if (pegawaiList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <UserCircle className="h-12 w-12 opacity-30" />
        <p className="text-sm">Belum ada data pegawai.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nama</TableHead>
            <TableHead className="font-semibold">Username</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Telepon</TableHead>
            <TableHead className="font-semibold">Kelamin</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            {isAdmin && <TableHead className="font-semibold text-right">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pegawaiList.map((pegawai) => (
            <TableRow key={pegawai.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{pegawai.name}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {pegawai.username}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{pegawai.email}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {pegawai.phone ?? <span className="opacity-40">—</span>}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={pegawai.gender === 'L' ? 'border-blue-300 text-blue-600 bg-blue-50' : 'border-pink-300 text-pink-600 bg-pink-50'}
                >
                  {pegawai.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={pegawai.role === 'admin' ? 'bg-[#0595d7] hover:bg-[#0595d7]/90' : 'bg-[#8cc640] hover:bg-[#8cc640]/90'}
                >
                  {pegawai.role === 'admin' ? 'Admin' : 'Petugas'}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" id={`edit-pegawai-${pegawai.id}`}>
                      <Link href={`/pegawai/${pegawai.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeletePegawaiButton id={pegawai.id} name={pegawai.name} />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
