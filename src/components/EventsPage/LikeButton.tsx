'use client';

// import { Popover, Transition } from '@headlessui/react';
// import { getCookie, setCookie } from 'cookies-next';
// import { useEffect, useState } from 'react';

// import { isEmpty } from '@/functions';
// import { City } from '@/types/City';

interface LikeButtonProps {
    eventId: string;
}

const LikeButton = ({}: LikeButtonProps) => {
    const handle = (event: any) => {
        event.preventDefault();
        alert('sasdasd');
    };
    return (
        <svg
            onClick={handle}
            className="absolute right-3 top-3 w-6 h-6 z-50"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.41594 13.8731C8.18927 13.9531 7.81594 13.9531 7.58927 13.8731C5.65594 13.2131 1.33594 10.4597 1.33594 5.79307C1.33594 3.73307 2.99594 2.06641 5.0426 2.06641C6.25594 2.06641 7.32927 2.65307 8.0026 3.55974C8.67594 2.65307 9.75594 2.06641 10.9626 2.06641C13.0093 2.06641 14.6693 3.73307 14.6693 5.79307C14.6693 10.4597 10.3493 13.2131 8.41594 13.8731Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
export default LikeButton;
