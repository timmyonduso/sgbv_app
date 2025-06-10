"use client"
import { Head, Link, useForm } from "@inertiajs/react"
import { Plus, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import HeadingSmall from "@/components/heading-small"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import CaseReportButton from "@/components/case-report-button"
import CaseReportDialog from "./case-report-dialog"

import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"

// Types
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

type CasesIndexProps = {
    cases: {
        data: Case[]
        links: Array<{
            url: string | null
            label: string
            active: boolean
        }>
        current_page: number
        last_page: number
    }
    caseworkers: Array<{
        id: number
        name: string
    }>
    statuses: Array<{
        id: number
        name: string
    }>
    filters: {
        status?: string | number
        assigned_to?: number
        search?: string
    }
    can: {
        create_case: boolean
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Cases",
        href: "/cases",
    },
]

export default function CasesIndex({ cases, caseworkers, statuses, filters, can }: CasesIndexProps) {
    const { data, setData, get, processing } = useForm({
        status: filters.status || "all",
        assigned_to: filters.assigned_to || "all", // Use assigned_to (snake_case) to match backend
        search: filters.search || "",
    })

    // Function to format status name by removing the prefix
    const formatStatusName = (statusName: string) => {
        return statusName.replace("Case: ", "")
    }

    // Function to get status badge variant based on status name
    const getStatusBadgeVariant = (statusName: string) => {
        const name = statusName.toLowerCase()
        if (name.includes("open")) return "default"
        if (name.includes("in progress")) return "secondary"
        if (name.includes("pending")) return "warning"
        if (name.includes("resolved")) return "success"
        if (name.includes("closed")) return "outline"
        return "default"
    }

    // Handle filter changes
    const handleFilterChange = () => {
        get(route("cases.index"), {
            preserveState: true,
            preserveScroll: true,
        })
    }

    // Reset filters
    const resetFilters = () => {
        setData({
            status: "all",
            assigned_to: "all",
            search: "",
        })
        get(route("cases.index"), {
            preserveState: true,
            preserveScroll: true,
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cases" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <HeadingSmall title="Cases" description="Manage and track support cases" />

                    <div className="flex gap-2">
                        {/* Add the report generation buttons */}
                        <CaseReportButton cases={cases.data} filters={filters} />
                        <CaseReportDialog cases={cases.data} filters={filters} />

                        {/*{can.create_case && (*/}
                        {/*    <Link href={route("cases.create")}>*/}
                        {/*        <Button>*/}
                        {/*            <Plus className="h-4 w-4 mr-2" />*/}
                        {/*            New Case*/}
                        {/*        </Button>*/}
                        {/*    </Link>*/}
                        {/*)}*/}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Cases</CardTitle>
                        <CardDescription>Find cases by status, assignment, or keyword search</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Select
                                    value={typeof data.status === "number" ? data.status.toString() : data.status || "all"}
                                    onValueChange={(value) => {
                                        // Handle numeric conversion properly
                                        const statusValue =
                                            value === "all" || value === "open" || value === "closed" ? value : Number.parseInt(value, 10)
                                        setData("status", statusValue)
                                        handleFilterChange()
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="open">Open Cases</SelectItem>
                                        <SelectItem value="closed">Closed Cases</SelectItem>
                                        <Separator className="my-2" />
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id.toString()}>
                                                {formatStatusName(status.name)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Select
                                    value={data.assigned_to ? data.assigned_to.toString() : "all"} // Provide a fallback value
                                    onValueChange={(value) => {
                                        setData("assigned_to", value)
                                        handleFilterChange()
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by caseworker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Caseworkers</SelectItem>
                                        {caseworkers.map((caseworker) => (
                                            <SelectItem key={caseworker.id} value={caseworker.id.toString()}>
                                                {caseworker.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex space-x-2">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search cases..."
                                        value={data.search}
                                        onChange={(e) => setData("search", e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleFilterChange()
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline" onClick={resetFilters}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="px-6 py-4 text-left font-medium text-sm">Case ID</th>
                                    <th className="px-6 py-4 text-left font-medium text-sm">Incident</th>
                                    <th className="px-6 py-4 text-left font-medium text-sm">Survivor</th>
                                    <th className="px-6 py-4 text-left font-medium text-sm">Assigned To</th>
                                    <th className="px-6 py-4 text-left font-medium text-sm">Status</th>
                                    <th className="px-6 py-4 text-left font-medium text-sm">Created</th>
                                    <th className="px-6 py-4 text-right font-medium text-sm">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cases.data.length > 0 ? (
                                    cases.data.map((caseItem) => (
                                        <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                                            <td className="px-6 py-4 whitespace-nowrap">#{caseItem.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{caseItem.incident.title}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                    {caseItem.incident.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{caseItem.incident.survivor.name}</td>
                                            <td className="px-6 py-4">{caseItem.assignedTo ? caseItem.assignedTo.name : "Unassigned"}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusBadgeVariant(caseItem.status.name)}>
                                                    {formatStatusName(caseItem.status.name)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(caseItem.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route("cases.show", caseItem.id)}>
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                            No cases found. Try changing your filters or create a new case.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Showing {cases.data.length} of {cases.data.length} cases
                        </div>

                        {cases.last_page > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    {cases.current_page > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious href={cases.links[0].url || "#"} />
                                        </PaginationItem>
                                    )}

                                    {cases.links.slice(1, -1).map((link, i) => {
                                        // Skip some page numbers if there are too many
                                        if (
                                            cases.last_page > 7 &&
                                            !link.active &&
                                            i !== 0 &&
                                            i !== cases.links.length - 3 &&
                                            (i < cases.current_page - 2 || i > cases.current_page)
                                        ) {
                                            return null
                                        }

                                        // Show ellipsis
                                        if (
                                            cases.last_page > 7 &&
                                            ((cases.current_page > 3 && i === 1) ||
                                                (cases.current_page < cases.last_page - 2 && i === cases.links.length - 3))
                                        ) {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )
                                        }

                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationLink isActive={link.active} href={link.url || "#"}>
                                                    {link.label.replace("&laquo; Previous", "").replace("Next &raquo;", "")}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })}

                                    {cases.current_page < cases.last_page && (
                                        <PaginationItem>
                                            <PaginationNext href={cases.links[cases.links.length - 1].url || "#"} />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    )
}
