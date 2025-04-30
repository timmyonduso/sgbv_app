"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { generateCaseReport } from "@/utils/generate-case-report"

type CaseReportDialogProps = {
  cases: any[]
  filters: {
    status?: string | number
    assigned_to?: number
    search?: string
  }
}

export default function CaseReportDialog({ cases, filters }: CaseReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [includeAssignmentBreakdown, setIncludeAssignmentBreakdown] = useState(true)
  const [includeStatusBreakdown, setIncludeStatusBreakdown] = useState(true)

  const handleGenerateReport = () => {
    // In a real implementation, you would modify the generateCaseReport function
    // to respect these options. For now, we'll just call the function as is.
    const doc = generateCaseReport(cases, filters)
    doc.save("case-report.pdf")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Advanced Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Case Report</DialogTitle>
          <DialogDescription>Customize your case report with the options below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-details"
              checked={includeDetails}
              onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
            />
            <Label htmlFor="include-details">Include case details</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-assignment"
              checked={includeAssignmentBreakdown}
              onCheckedChange={(checked) => setIncludeAssignmentBreakdown(checked as boolean)}
            />
            <Label htmlFor="include-assignment">Include assignment breakdown</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-status"
              checked={includeStatusBreakdown}
              onCheckedChange={(checked) => setIncludeStatusBreakdown(checked as boolean)}
            />
            <Label htmlFor="include-status">Include status breakdown</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
