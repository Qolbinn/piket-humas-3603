'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Pegawai } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditPegawaiDialog from './EditPegawaiDialog'
import DeletePegawaiButton from './DeletePegawaiButton'

export const getColumns = (isAdmin: boolean, currentPegawaiId?: string): ColumnDef<Pegawai>[] => {
  const columns: ColumnDef<Pegawai>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 font-extrabold text-xs uppercase tracking-wider text-muted-foreground"
          >
            Nama Pegawai
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const name = row.getValue('name') as string
        const gender = row.original.gender
        const isSelf = row.original.id === currentPegawaiId

        return (
          <div className="flex items-center gap-3 py-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-extrabold shrink-0 border ${gender === 'L'
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200'
                : 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-200'
              }`}>
              {name ? name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <div className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <span>{name}</span>
                {isSelf && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Anda
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'username',
      header: () => <span className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Username</span>,
      cell: ({ row }) => (
        <div className="text-muted-foreground font-mono text-xs font-bold">
          @{row.getValue('username')}
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
            className="-ml-4 font-extrabold text-xs uppercase tracking-wider text-muted-foreground"
          >
            Email
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground text-xs font-medium">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: () => <span className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Telepon</span>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-xs font-mono">
          {row.getValue('phone') || <span className="opacity-40">—</span>}
        </div>
      ),
    },
    {
      accessorKey: 'lid_wa',
      header: () => <span className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">LID WA</span>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-xs font-mono">
          {row.getValue('lid_wa') || <span className="opacity-40">—</span>}
        </div>
      ),
    },
    {
      accessorKey: 'gender',
      header: () => <span className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground text-center block">JK</span>,
      cell: ({ row }) => {
        const gender = row.getValue('gender') as string
        const isMale = gender === 'L'

        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${isMale
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
                : 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20'
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isMale ? 'bg-blue-500' : 'bg-pink-500'}`} />
              {isMale ? 'L' : 'P'}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: () => <span className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Role</span>,
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        const isAdminRole = role === 'admin'
        const isPimpinan = role === 'pimpinan'

        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${isAdminRole
              ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
              : isPimpinan
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAdminRole ? 'bg-sky-500' : isPimpinan ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            {isAdminRole ? 'Admin' : isPimpinan ? 'Pimpinan' : 'Petugas'}
          </span>
        )
      },
    },
  ]

  if (isAdmin) {
    columns.push({
      id: 'actions',
      header: () => <div className="text-right font-extrabold text-xs uppercase tracking-wider text-muted-foreground pr-2">Aksi</div>,
      cell: ({ row }) => {
        const pegawai = row.original
        const isSelf = pegawai.id === currentPegawaiId

        return (
          <div className="flex items-center justify-end gap-1">
            <EditPegawaiDialog pegawai={pegawai} />
            {!isSelf && <DeletePegawaiButton id={pegawai.id} name={pegawai.name} />}
          </div>
        )
      },
    })
  }

  return columns
}
