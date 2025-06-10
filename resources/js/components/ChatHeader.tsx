// components/chat-header.tsx
interface ChatHeaderProps {
    title: string;
    createdAt?: string;
    isTitleStreaming?: boolean;
}

export function ChatHeader({ title, createdAt, isTitleStreaming }: ChatHeaderProps) {
    return (
        <div className="bg-background flex-shrink-0 border-b px-4 py-3">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
                <h1 className="text-lg font-semibold text-foreground">
                    {title}
                    {isTitleStreaming && (
                        <span className="ml-1 animate-pulse">|</span>
                    )}
                </h1>
                {createdAt && (
                    <span className="text-sm text-muted-foreground">
                        Created: {new Date(createdAt).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
}