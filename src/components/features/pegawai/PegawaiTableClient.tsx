'use client'

import { DataTable } from './data-table'
import { getColumns } from './columns'
import { Pegawai } from '@/lib/types/database'

interface PegawaiTableClientProps {
  data: Pegawai[]
  isAdmin: boolean
  currentPegawaiId?: string
}

export default function PegawaiTableClient({ data, isAdmin, currentPegawaiId }: PegawaiTableClientProps) {
  return <DataTable columns={getColumns(isAdmin, currentPegawaiId)} data={data} />
}
