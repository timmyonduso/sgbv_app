"use client"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadCaseReport } from "@/utils/generate-case-report"

type CaseReportButtonProps = {
  cases: any[]
  filters: {
    status?: string | number
    assigned_to?: number
    search?: string
  }
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function CaseReportButton({
  cases,
  filters,
  variant = "outline",
  size = "default",
}: CaseReportButtonProps) {
  const handleGenerateReport = () => {
    downloadCaseReport(cases, filters)
  }

  return (
    <Button variant={variant} size={size} onClick={handleGenerateReport} disabled={!cases || cases.length === 0}>
      <FileText className="h-4 w-4 mr-2" />
      Generate Report
    </Button>
  )
}
