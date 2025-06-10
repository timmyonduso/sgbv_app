import { useStream } from '@laravel/stream-react';

interface StreamingIndicatorProps {
    id: string;
    className?: string;
}

export default function StreamingIndicator({ id, className }: StreamingIndicatorProps) {
    const { isFetching, isStreaming } = useStream('chat', { id });

    return (
        <div className={className}>
            {isStreaming && (
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            )}
            {!isStreaming && isFetching && (
                <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
            )}
        </div>
    );
}
