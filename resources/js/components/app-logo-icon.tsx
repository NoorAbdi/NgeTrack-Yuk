import { SVGAttributes } from 'react';

export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img 
            src="/images/logo.png"
            alt="Logo"
            className={className}
        />
    );
}
