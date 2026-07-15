'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export const ALL_BRANCHES = { id: 0, name: 'All Branches', logo: 'ALL', branches: [] as string[] }

export type Clinic = {
  id: string | number
  name: string
  logo: string
  branches: string[]
}

type ClinicContextType = {
  selectedClinic: Clinic
  setSelectedClinic: (clinic: Clinic) => void
  isAllBranches: boolean
}

const ClinicContext = createContext<ClinicContextType>({
  selectedClinic: ALL_BRANCHES,
  setSelectedClinic: () => {},
  isAllBranches: true,
})

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [selectedClinic, setSelectedClinic] = useState<Clinic>(ALL_BRANCHES)

  return (
    <ClinicContext.Provider value={{
      selectedClinic,
      setSelectedClinic,
      isAllBranches: selectedClinic.id === 0,
    }}>
      {children}
    </ClinicContext.Provider>
  )
}

export function useClinic() {
  return useContext(ClinicContext)
}
