import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Pagination = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <nav
        ref={ref}
        data-slot="pagination"
        aria-label="Pagination"
        className={cn("flex flex-wrap items-center justify-center gap-1", className)}
        {...props}
    />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        data-slot="pagination-content"
        className={cn("flex flex-wrap items-center gap-1", className)}
        {...props}
    />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        data-slot="pagination-item"
        className={cn("", className)}
        {...props}
    />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
    isActive?: boolean
    size?: "default" | "sm" | "lg"
} & Omit<React.ComponentProps<"a">, "ref">

const PaginationLink = ({
                            className,
                            isActive,
                            size = "sm",
                            ...props
                        }: PaginationLinkProps) => (
    <a
        data-slot="pagination-link"
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "default" : "outline",
                size,
            }),
            "min-w-9 data-[current=page]:pointer-events-none",
            className
        )}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
                                className,
                                ...props
                            }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        data-slot="pagination-previous"
        aria-label="Go to previous page"
        size="sm"
        className={cn("gap-1", className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
    </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
                            className,
                            ...props
                        }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        data-slot="pagination-next"
        aria-label="Go to next page"
        size="sm"
        className={cn("gap-1", className)}
        {...props}
    >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
                                className,
                                ...props
                            }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="pagination-ellipsis"
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </div>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
}
