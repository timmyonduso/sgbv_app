import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="currentColor"
                d="M12 2L4 5V11C4 16.52 7.58 21.74 12 23C16.42 21.74 20 16.52 20 11V5L12 2ZM12 13.35L10.55 12.03C9.5 11.05 8 10.29 8 8.99C8 8.22 8.6 7.6 9.33 7.6C9.89 7.6 10.41 7.89 10.71 8.36C10.89 8.64 11.11 8.64 11.29 8.36C11.59 7.89 12.11 7.6 12.67 7.6C13.4 7.6 14 8.22 14 8.99C14 10.29 12.5 11.05 11.45 12.03L12 13.35Z"
            />
        </svg>

    );
}
