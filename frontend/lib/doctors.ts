export type DoctorEmploymentStatus = "CURRENT" | "FORMER"

export interface Doctor {
  id: string
  name: string
  title: string
  specialty: string
  badge: string
  image: string
  details?: string | null
  department?: string | null
  experience?: string | null
  employmentStatus?: DoctorEmploymentStatus
  available: boolean
  featured: boolean
}
