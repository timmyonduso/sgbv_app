<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Mail\Contact\ContactFormMail;
use App\Mail\Contact\EmergencyContactMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display the contact page
     */
    public function index()
    {
        // Optional: You can fetch FAQs from database if you have a FAQ model
        // $faqs = FAQ::where('is_active', true)->orderBy('order')->get();

        return Inertia::render('contact/Index', [
            // 'faqs' => $faqs ?? null,
        ]);
    }

    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'contact_type' => 'required|in:general,support,partnership,emergency',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $contactData = $validator->validated();

        try {
            // Store contact message in database (optional)
            // Contact::create($contactData);

            // Send email notification
            Mail::to(config('mail.admin_email', 'timmyonduso85@gmail.com'))
                ->send(new ContactFormMail($contactData));

            // For emergency contacts, you might want to send additional notifications
            if ($contactData['contact_type'] === 'emergency') {
                // Send SMS, urgent email, etc.
                $this->handleEmergencyContact($contactData);
            }

            return back()->with('success', 'Thank you for your message. We will get back to you soon.');

        } catch (\Exception $e) {
            \Log::error('Contact form error: ' . $e->getMessage());

            return back()->with('error', 'There was an error sending your message. Please try again or contact us directly.');
        }
    }

    /**
     * Handle emergency contact submissions
     */
    private function handleEmergencyContact(array $contactData)
    {
        // Send urgent notifications for emergency contacts
        // This could include:
        // - SMS to on-call staff
        // - High-priority email alerts
        // - Integration with crisis management systems

        try {
            // Example: Send urgent email
            Mail::to(config('mail.emergency_email', 'timmyonduso85@gmail.com'))
                ->send(new EmergencyContactMail($contactData));

            // Example: Log for immediate attention
            \Log::channel('emergency')->critical('Emergency contact received', $contactData);

        } catch (\Exception $e) {
            \Log::error('Emergency contact handling error: ' . $e->getMessage());
        }
    }
}
