@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ config('app.name') }} - EMERGENCY ALERT
        @endcomponent
    @endslot

    # EMERGENCY CONTACT RECEIVED

    **Name:** {{ $name }}
    **Email:** {{ $email }}
    **Received At:** {{ $receivedAt }}

    ## Urgent Message:
    {{ $messageContent }}

    @component('mail::button', ['url' => 'mailto:' . $email, 'color' => 'red'])
        Respond Immediately
    @endcomponent

    @slot('footer')
        @component('mail::footer')
            <span style="color: red">URGENT: This requires immediate attention</span><br>
            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        @endcomponent
    @endslot
@endcomponent
