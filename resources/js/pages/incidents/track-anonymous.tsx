"use client"

import type React from "react"

import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"

// Import PublicLayout instead of AppLayout
import PublicLayout from "@/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import HeadingSmall from "@/components/heading-small"
import InputError from "@/components/input-error"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Search, Shield } from "lucide-react"
import type { BreadcrumbItem } from "@/types"
import { Input } from "@/components/ui/input"

interface Props {
    error?: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Track Anonymous Report",
        href: "/track-incident",
    },
]

export default function TrackAnonymous({ error }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        tracking_code: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        post(route("incidents.track-anonymous"), {
            onSuccess: () => {
                setIsSubmitting(false)
            },
            onError: () => {
                setIsSubmitting(false)
            },
        })
    }

    return (
        <PublicLayout breadcrumbs={breadcrumbs} title="Track Anonymous Report">
            <Head title="Track Anonymous Report" />

            <div className="max-w-3xl mx-auto py-6">
                <HeadingSmall
                    title="Track Anonymous Report"
                    description="Enter the tracking code you received when submitting your anonymous report to check its status."
                />

                <Card className="mt-6 bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center text-gray-100">
                            <Shield className="h-5 w-5 mr-2 text-blue-400" />
                            Anonymous Report Tracking
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-6 bg-red-900/30 border border-red-800 rounded-md p-4 flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="text-sm text-red-300">
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="tracking_code" className="text-gray-300">
                                    Tracking Code <span className="text-red-400">*</span>
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={18} />
                                    </div>
                                    <Input
                                        id="tracking_code"
                                        type="text"
                                        value={data.tracking_code}
                                        onChange={(e) => setData("tracking_code", e.target.value)}
                                        placeholder="Enter your tracking code (e.g., ANO-ABCD1234)"
                                        className="pl-10 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                {errors.tracking_code && <InputError message={errors.tracking_code} />}
                            </div>

                            <div className="bg-blue-900/30 border border-blue-800 rounded-md p-4 flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="text-sm text-blue-300">
                                    <p>
                                        Your tracking code was provided to you when you submitted your anonymous report. If you lost your
                                        code, unfortunately we cannot recover it due to the anonymous nature of the report.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing || isSubmitting}
                                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? "Checking..." : "Check Status"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Need to submit a new report?{" "}
                        <a href={route("incidents.create")} className="text-blue-400 hover:text-blue-300">
                            Report an incident
                        </a>
                    </p>
                </div>
            </div>
        </PublicLayout>
    )
}
