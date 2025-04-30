import * as React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CasesExportDropdown({ filters }) {
    // Function to generate export URL with current filters
    const getExportUrl = (format) => {
        const url = new URL(route('cases.export', format));

        // Add current filters as query parameters
        if (filters.status && filters.status !== 'all') {
            url.searchParams.append('status', filters.status);
        }

        if (filters.assigned_to && filters.assigned_to !== 'all') {
            url.searchParams.append('assigned_to', filters.assigned_to);
        }

        if (filters.search) {
            url.searchParams.append('search', filters.search);
        }

        return url.toString();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <a href={getExportUrl('xlsx')} download>Excel (.xlsx)</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={getExportUrl('csv')} download>CSV (.csv)</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={getExportUrl('pdf')} download>PDF (.pdf)</a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
