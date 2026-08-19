'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Pegawai } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditPegawaiDialog from './EditPegawaiDialog'
import DeletePegawaiButton from './DeletePegawaiButton'

export const getColumns = (isAdmin: boolean): ColumnDef<Pegawai>[] => {
  const columns: ColumnDef<Pegawai>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => (
        <div className="text-muted-foreground font-mono text-sm">
          {row.getValue('username')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telepon',
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {row.getValue('phone') || <span className="opacity-40">—</span>}
        </div>
      ),
    },
    {
      accessorKey: 'lid_wa',
      header: 'LID WA',
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm font-mono">
          {row.getValue('lid_wa') || <span className="opacity-40">—</span>}
        </div>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'JK',
      cell: ({ row }) => {
        const gender = row.getValue('gender') as string
        return (
          <Badge
            variant="outline"
            className={
              gender === 'L'
                ? 'border-blue-300 text-blue-600 bg-blue-50'
                : 'border-pink-300 text-pink-600 bg-pink-50'
            }
          >
            {gender === 'L' ? 'Laki-laki' : 'Perempuan'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        return (
          <Badge
            className={
              role === 'admin'
                ? 'bg-[#0595d7] hover:bg-[#0595d7]/90'
                : role === 'pimpinan' 
                ? 'bg-[#f59e0b] hover:bg-[#f59e0b]/90'
                : 'bg-[#8cc640] hover:bg-[#8cc640]/90'
            }
          >
            {role === 'admin' ? 'Admin' : role === 'pimpinan' ? 'Pimpinan' : 'Petugas'}
          </Badge>
        )
      },
    },
  ]

  if (isAdmin) {
    columns.push({
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const pegawai = row.original
        return (
          <div className="flex items-center justify-end gap-1">
            <EditPegawaiDialog pegawai={pegawai} />
            <DeletePegawaiButton id={pegawai.id} name={pegawai.name} />
          </div>
        )
      },
    })
  }

  return columns
}
