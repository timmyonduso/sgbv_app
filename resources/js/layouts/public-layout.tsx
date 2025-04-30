import React from "react"
import { Head } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"

interface PublicLayoutProps {
    children: React.ReactNode
    title?: string
    breadcrumbs?: BreadcrumbItem[]
}

export default function PublicLayout({ children, title, breadcrumbs }: PublicLayoutProps) {
    return (
        <>
            <Head title={title || "GBV Monitoring Tool"} />

            <div className="min-h-screen bg-gray-950">
                <header className="bg-gray-900 border-b border-gray-800 shadow-md shadow-gray-950/50">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-semibold text-gray-100">{title || "GBV Monitoring Tool"}</h1>
                        </div>

                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="flex mt-2" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm text-gray-400">
                                    <li>
                                        <a href="/" className="hover:text-gray-200">
                                            Home
                                        </a>
                                    </li>
                                    {breadcrumbs.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <li className="flex items-center">
                                                <span className="mx-1">/</span>
                                                {index === breadcrumbs.length - 1 ? (
                                                    <span className="font-medium text-gray-200">{item.title}</span>
                                                ) : (
                                                    <a href={item.href} className="hover:text-gray-200">
                                                        {item.title}
                                                    </a>
                                                )}
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </ol>
                            </nav>
                        )}
                    </div>
                </header>

                <main>{children}</main>

                <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-400">
                            © {new Date().getFullYear()} GBV Monitoring Tool. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    )
}
