import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface GoogleMapsAutocompleteProps {
    id: string;
    value: string;
    onChange: (value: string, placeData?: {
        address: string;
        latitude: number;
        longitude: number;
    }) => void;
    apiKey: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

declare global {
    interface Window {
        google: any;
        initGoogleMapsAutocomplete: () => void;
    }
}

export default function GoogleMapsAutocomplete({
                                                   id,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   apiKey,
                                                   className,
                                                   required
                                               }: GoogleMapsAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loaded, setLoaded] = useState(false);

    // Initialize Google Maps script
    useEffect(() => {
        if (window.google?.maps?.places) {
            initAutocomplete();
            return;
        }

        // Define the callback function for when the script loads
        window.initGoogleMapsAutocomplete = () => {
            setLoaded(true);
        };

        // Add the script tag if it doesn't exist
        if (!document.querySelector('script#google-maps-api')) {
            const script = document.createElement('script');
            script.id = 'google-maps-api';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAutocomplete`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    // Initialize autocomplete when Google Maps is loaded
    useEffect(() => {
        if (loaded && inputRef.current) {
            initAutocomplete();
        }
    }, [loaded]);

    const initAutocomplete = () => {
        if (!inputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['geocode', 'establishment']
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) {
                // User entered the name of a place that was not suggested
                onChange(inputRef.current?.value || '');
                return;
            }

            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const address = place.formatted_address || '';

            onChange(address, {
                address,
                latitude,
                longitude
            });
        });
    };

    return (
        <Input
            ref={inputRef}
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className}
            required={required}
        />
    );
}
