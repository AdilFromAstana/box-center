'use server';

import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';

import EventsList from '@/components/EventsList';
import PageLayout from '@/components/PageLayout';
import PhotoGallery from '@/components/PhotoReport';
import SiteGallery from '@/components/SiteGallery';
import { isEmpty } from '@/functions';
import { CheckToken } from '@/functions/AxiosHandlers';
import { EventInList } from '@/types/EventInList';

async function GetEvents(startDate: string, period: string, categoryCode?: string) {
    const { NEXT_PUBLIC_EVENTS_URL = '' } = process.env;
    const token = await CheckToken();

    const UserLang = getCookie('UserLang', { cookies });
    let acceptLanguage = 'ru-RU';
    switch (UserLang?.toLocaleLowerCase()) {
        case 'kk':
            acceptLanguage = 'kz-KZ';
            break;
        case 'en':
            acceptLanguage = 'en-US';
            break;
    }

    const UserCityId = getCookie('UserCityId', { cookies });

    let url =
        NEXT_PUBLIC_EVENTS_URL +
        'commercial/Events' +
        `?Top=100&CityId=${UserCityId ? (parseInt(UserCityId) === 0 ? '' : UserCityId) : ''}`;

    if (categoryCode && !isEmpty(categoryCode) && categoryCode !== 'all') {
        url = url + `&LeisureCategoryCode=${categoryCode}`;
    }
    if (startDate && !isEmpty(startDate)) {
        url = url + `&BeginAt=${dayjs(startDate, 'YYYY-MM-DD').toISOString()}`;
    }
    if (startDate && !isEmpty(startDate) && !isEmpty(period)) {
        url = url + `&EndAt=${dayjs(startDate, 'YYYY-MM-DD').add(parseInt(period), 'd').endOf('D').toISOString()}`;
    }

    const res = await fetch(url, {
        next: {
            revalidate: 120,
        },
        headers: {
            'Accept-Language': acceptLanguage,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        console.log('Error in GetEvents: ', res);
        const empty: EventInList[] = [];
        // This will activate the closest `error.js` Error Boundary
        return empty;
    }

    const data = await res.json();

    if (data.items) {
        const exclusiveEvents = ['alau-massskating', 'oasis-beach-club', 'pecha-kucha'];

        const sortedData: EventInList[] = data.items?.sort((eventA: any, eventB: any) => {
            const dateA = new Date(eventA?.beginDate) as any;
            const dateB = new Date(eventB?.beginDate) as any;
            return dateA - dateB;
        });

        let result = [
            ...sortedData?.filter((x: EventInList) => exclusiveEvents.includes(x.code)),
            ...sortedData?.filter((x: EventInList) => !exclusiveEvents.includes(x.code)),
        ];

        if (categoryCode === 'all') {
            result = result.filter((x: EventInList) => x.leisureCategoryCode !== 'museums');
        }

        return result;
    }
}

export default async function Home() {
    const events = await GetEvents('', '');
    return (
        <PageLayout>
            <EventsList events={events} />
            <PhotoGallery />
            <SiteGallery />
        </PageLayout>
    );
}
