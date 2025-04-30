import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Define the Case type based on your existing data structure
type Case = {
  id: number
  incident_id: number
  assigned_to: number | null
  status_id: number
  resolution_notes: string | null
  created_at: string
  updated_at: string
  incident: {
    id: number
    title: string
    description: string
    survivor: {
      id: number
      name: string
    }
  }
  assignedTo: {
    id: number
    name: string
  } | null
  status: {
    id: number
    name: string
  }
}

/**
 * Formats a status name by removing the prefix
 */
const formatStatusName = (statusName: string) => {
  return statusName.replace("Case: ", "")
}

/**
 * Generates a case report PDF document
 * @param cases List of case items
 * @param filters Current filter settings
 * @returns jsPDF document instance
 */
export const generateCaseReport = (
  cases: Case[],
  filters: {
    status?: string | number
    assigned_to?: number
    search?: string
  } = {},
): jsPDF => {
  console.log("Starting case report generation with", cases.length, "cases")

  try {
    // Create a new PDF document
    const doc = new jsPDF()
    console.log("jsPDF instance created")

    // Add title and organization info
    doc.setFontSize(20)
    doc.text("Case Management Report", 105, 15, { align: "center" })
    doc.setFontSize(12)

    // Add date information
    const currentDate = new Date().toLocaleDateString()
    doc.text(`Generated on: ${currentDate}`, 105, 25, { align: "center" })

    // Add filter information if any filters are applied
    let filterText = "All Cases"
    if (filters.status && filters.status !== "all") {
      filterText =
        typeof filters.status === "number"
          ? `Status: ${cases.find((c) => c.status_id === filters.status)?.status.name || filters.status}`
          : `Status: ${filters.status}`
    }
    doc.text(filterText, 105, 35, { align: "center" })
    console.log("Header information added")

    // Add summary
    doc.text("Summary", 14, 45)

    // Count cases by status
    const statusCounts: Record<string, number> = {}
    cases.forEach((caseItem) => {
      const statusName = formatStatusName(caseItem.status.name)
      statusCounts[statusName] = (statusCounts[statusName] || 0) + 1
    })

    // Display status counts
    let yPos = 55
    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`, 20, yPos)
      yPos += 10
    })

    // Total cases
    doc.text(`Total Cases: ${cases.length}`, 20, yPos)
    yPos += 20
    console.log("Summary information added")

    // Add cases table
    const tableData = cases.map((caseItem) => [
      `#${caseItem.id}`,
      caseItem.incident.title,
      caseItem.incident.survivor.name,
      caseItem.assignedTo ? caseItem.assignedTo.name : "Unassigned",
      formatStatusName(caseItem.status.name),
      new Date(caseItem.created_at).toLocaleDateString(),
    ])

    console.log("Attempting to add cases table")
    try {
      autoTable(doc, {
        startY: yPos,
        head: [["Case ID", "Incident", "Survivor", "Assigned To", "Status", "Created"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [41, 65, 148] }, // A blue color that matches your UI
        styles: { overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
        },
      })
      console.log("Cases table added successfully")
    } catch (error) {
      console.error("Error creating cases table:", error)
      throw new Error("Failed to create cases table")
    }

    // Get the Y position after the first table
    // @ts-ignore - Necessary because we're accessing a property added by the plugin
    const finalY = doc.lastAutoTable?.finalY || yPos

    // Add assignment breakdown
    const assignmentBreakdown: Record<string, number> = {
      Unassigned: 0,
    }

    cases.forEach((caseItem) => {
      const assigneeName = caseItem.assignedTo ? caseItem.assignedTo.name : "Unassigned"
      assignmentBreakdown[assigneeName] = (assignmentBreakdown[assigneeName] || 0) + 1
    })

    const assignmentTableData = Object.entries(assignmentBreakdown).map(([assignee, count]) => [
      assignee,
      count.toString(),
    ])

    console.log("Assignment data prepared, finalY position:", finalY)

    // Add the assignment breakdown table
    try {
      autoTable(doc, {
        startY: finalY + 20,
        head: [["Caseworker", "Number of Cases"]],
        body: assignmentTableData,
        theme: "grid",
        headStyles: { fillColor: [30, 50, 100] },
      })
      console.log("Assignment table added successfully")
    } catch (error) {
      console.error("Error creating assignment table:", error)
      throw new Error("Failed to create assignment table")
    }

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" })
    }

    console.log("PDF generation completed successfully")
    return doc
  } catch (error) {
    console.error("Error in generateCaseReport:", error)
    throw error
  }
}

/**
 * Downloads a case report as a PDF
 * @param cases List of case items
 * @param filters Current filter settings
 * @returns true if successful, false if there was an error
 */
export const downloadCaseReport = (
  cases: Case[],
  filters: {
    status?: string | number
    assigned_to?: number
    search?: string
  } = {},
): boolean => {
  console.log("Starting PDF download process")

  try {
    if (!cases || cases.length === 0) {
      console.error("No cases provided")
      alert("No cases to download!")
      return false
    }

    console.log("Generating PDF")
    const doc = generateCaseReport(cases, filters)

    console.log("Attempting to save PDF")
    try {
      // Primary download method
      doc.save("case-report.pdf")
      console.log("PDF saved successfully")
      return true
    } catch (saveError) {
      console.error("Error saving PDF:", saveError)

      // Try an alternative approach if the first one fails
      try {
        const blob = doc.output("blob")
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "case-report.pdf"
        link.target = "_blank" // Open in new tab to bypass some security restrictions
        document.body.appendChild(link)
        link.click()

        // Small delay before cleanup to ensure download triggers
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)

        console.log("PDF saved using alternative method")
        return true
      } catch (altError) {
        console.error("Alternative save method also failed:", altError)
        alert("Failed to download PDF. Please check console for errors.")
        return false
      }
    }
  } catch (error) {
    console.error("Error in downloadCaseReport:", error)
    alert("Failed to generate PDF. Please check console for errors.")
    return false
  }
}
