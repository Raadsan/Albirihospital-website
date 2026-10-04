import { AboutBanner } from "@/components/About/AboutBanner"
import { DoctorsDirectory } from "@/components/Doctors/DoctorsDirectory"

export default function DoctorsPage() {
  return (
    <>
      <AboutBanner title="Specialist Doctors" breadcrumbPage="Doctors" />
      <DoctorsDirectory />
    </>
  )
}
