<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\ValueObjects\Messages\AssistantMessage;
use Prism\Prism\ValueObjects\Messages\UserMessage;

class ChatController extends Controller
{
    public function index()
    {
        return Inertia::render('chat/Chat');
    }

    public function send(Request $request)
    {
        return response()->stream(function () use ($request): void {
            if (!$request->has('messages')) {
                return;
            }

            $userMessages = collect($request->input('messages'))
                ->map(fn($message) => $message['type'] === 'prompt'
                    ? new UserMessage($message['content'])
                    : new AssistantMessage($message['content']));

            // Prepend system message to restrict LLM domain
            $systemInstruction = new AssistantMessage("You are an expert assistant that only answers questions related to Gender-Based Violence (GBV). If a user asks about unrelated topics, politely decline and redirect them to ask GBV-related questions.");

            $messages = collect([$systemInstruction])
                ->merge($userMessages)
                ->toArray();

            $response = Prism::text()
                ->using(Provider::OpenAI, 'gpt-4.1-nano')
                ->withMessages($messages)
                ->asStream();

            foreach ($response as $chunk) {
                echo $chunk->text;

                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
                usleep(10000); // 10ms
            }
        }, 200, [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
