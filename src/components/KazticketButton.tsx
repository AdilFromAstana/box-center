'use client';

import React from 'react';

interface ButtonProps {
    eventId: string;
    eventCode: string;
    locale: any;
}

const KazticketButton = ({ eventId, eventCode, locale }: ButtonProps) => {
    return (
        <button
            data-event-id={eventId}
            data-event-code={eventCode}
            data-client-id={process.env.NEXT_PUBLIC_CLIENT_ID}
            data-client-secret={process.env.NEXT_PUBLIC_CLIENT_SECRET}
            // className="kazticket-buy-button z-0 cursor-pointer bg-[#0490C3] lg:w-56 w-full px-2 py-2 lg:px-6 lg:py-4 rounded-xl text-base lg:text-xl font-bold text-white transition duration-500 hover:shadow-2xl"
            className="kazticket-buy-button z-0 cursor-pointer bg-[#006D56] w-full text-base lg:text-lg font-bold text-white duration-500 hover:shadow-2xl"
        >
            {locale.EventPage.BuyTicket}
        </button>
    );
};

export default KazticketButton;
