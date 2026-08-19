'use client'

import { DataTable } from './data-table'
import { getColumns } from './columns'
import { Pegawai } from '@/lib/types/database'

interface PegawaiTableClientProps {
  data: Pegawai[]
  isAdmin: boolean
}

export default function PegawaiTableClient({ data, isAdmin }: PegawaiTableClientProps) {
  return <DataTable columns={getColumns(isAdmin)} data={data} />
}
