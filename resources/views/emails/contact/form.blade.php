<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>New Contact Form Submission</title>

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f7fafc;
            color: #2d3748;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        .heading {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
            color: #1a202c;
        }
        .text-lg {
            font-size: 18px;
            margin-bottom: 16px;
        }
        .font-semibold {
            font-weight: 600;
        }
        .mb-4 {
            margin-bottom: 16px;
        }
        .emergency-banner {
            background-color: #fee2e2;
            color: #b91c1c;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        .contact-details {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .detail-item {
            margin-bottom: 12px;
        }
        .detail-label {
            font-weight: 600;
            color: #334155;
            display: block;
            margin-bottom: 4px;
        }
        .detail-value {
            color: #475569;
        }
        .message-content {
            background-color: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            white-space: pre-wrap;
            line-height: 1.6;
        }
        .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
        }
        .btn {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 16px;
        }
    </style>
</head>
<body>
<div class="container">
    <h1 class="heading">
        @if($contact_type === 'emergency')
            ⚠️ Emergency Contact Request
        @else
            New Contact Form Submission
        @endif
    </h1>

    @if($contact_type === 'emergency')
        <div class="emergency-banner">
            <strong>URGENT ACTION REQUIRED:</strong> This is an emergency contact request that requires immediate attention.
        </div>
    @endif

    <div class="contact-details">
        <div class="detail-item">
            <span class="detail-label">From:</span>
            <span class="detail-value">{{ $name }} ({{ $email }})</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Contact Type:</span>
            <span class="detail-value">{{ ucfirst($contact_type) }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Subject:</span>
            <span class="detail-value">{{ $subject }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Submitted At:</span>
            <span class="detail-value">{{ $submitted_at->format('F j, Y \a\t g:i A T') }}</span>
        </div>
    </div>

    <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 12px;">Message:</h2>
    <div class="message-content">
        {!! nl2br(e($user_message)) !!}
    </div>

    <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:{{ $email }}" class="btn">Reply to {{ $name }}</a>
    </div>

    <div class="footer">
        <p>This message was sent via the contact form on {{ config('app.name') }}</p>
        <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</div>
</body>
</html>
