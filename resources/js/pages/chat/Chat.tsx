import { useEffect, useState, useRef } from 'react';
import { useStream } from '@laravel/stream-react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageSquare, Bot, User } from 'lucide-react';
import StreamingIndicator from '@/components/StreamingIndicator';

// Types
type Message = {
    type: 'response' | 'error' | 'prompt';
    content: string;
};

interface Props {
    // Add any props that might be passed from your Laravel controller
    // For example:
    // chatHistory?: Message[];
    // userId?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat',
        href: '/chat',
    },
];

export default function Chat({}: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const { data, send, cancel, isStreaming, id } = useStream('chat');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            cancel();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    useEffect(() => {
        if (isStreaming) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [isStreaming, data]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, data]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        const query = input?.value;
        const toAdd: Message[] = [];

        if (data) {
            toAdd.push({
                type: 'response',
                content: data,
            });
        }

        if (query) {
            toAdd.push({
                type: 'prompt',
                content: query,
            });
        }

        setMessages(prev => [...prev, ...toAdd]);
        send({ messages: [...messages, ...toAdd] });
        input.value = '';
    };

    const formatContent = (content: string) => {
        return content.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Chat Header Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            AI Assistant Chat
                        </CardTitle>
                    </CardHeader>
                </Card>

                {/* Chat Messages Card */}
                <Card className="flex-1 flex flex-col">
                    <CardContent className="flex-1 flex flex-col p-0">
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {messages.length === 0 && (
                                    <div className="py-12 text-center">
                                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <div className="text-lg text-muted-foreground">How can I help you today?</div>
                                    </div>
                                )}

                                {messages.map((message, index) => (
                                    <div key={index} className="space-y-4">
                                        {message.type === 'prompt' && (
                                            <div className="flex justify-end">
                                                <div className="flex items-start gap-3 max-w-[70%]">
                                                    <div className="flex-1">
                                                        <div className="rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
                                                            {formatContent(message.content)}
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                            <User className="h-4 w-4 text-primary-foreground" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {message.type === 'response' && (
                                            <div className="flex justify-start">
                                                <div className="flex items-start gap-3 max-w-[70%]">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                            <Bot className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="rounded-2xl bg-muted px-4 py-3 text-foreground">
                                                            {formatContent(message.content)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {message.type === 'error' && (
                                            <div className="flex justify-start">
                                                <div className="flex items-start gap-3 max-w-[70%]">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                                                            <Bot className="h-4 w-4 text-destructive-foreground" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-destructive">
                                                            {formatContent(message.content)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Streaming Response */}
                                {data && (
                                    <div className="flex justify-start">
                                        <div className="flex items-start gap-3 max-w-[70%]">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                    <Bot className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="relative rounded-2xl bg-muted px-4 py-3 text-foreground">
                                                    {formatContent(data)}
                                                    <StreamingIndicator id={id} className="ml-2 inline-block" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Form */}
                        <div className="border-t bg-background p-4">
                            <form className="flex gap-3" onSubmit={submit}>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                        disabled={isStreaming}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isStreaming}
                                    className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Send
                                </button>
                            </form>
                            {isStreaming && (
                                <div className="mt-2 text-xs text-muted-foreground text-center">
                                    Press Escape to cancel streaming
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
