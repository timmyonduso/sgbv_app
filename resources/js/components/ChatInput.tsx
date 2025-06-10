// components/chat-input.tsx
interface ChatInputProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    disabled?: boolean;
    isSubmitting?: boolean;
}

export function ChatInput({ onSubmit, onKeyDown, inputRef, disabled, isSubmitting }: ChatInputProps) {
    return (
        <div className="bg-background flex-shrink-0 border-t">
            <div className="mx-auto max-w-3xl p-4">
                <form onSubmit={onSubmit}>
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1"
                            disabled={disabled}
                            onKeyDown={onKeyDown}
                        />
                        <Button 
                            type="submit" 
                            disabled={disabled}
                            size="icon"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}