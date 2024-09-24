'use server';

import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import { getDictionary } from 'dictionaries';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import EmptyPoster from '@/assets/empty-poster.svg';
import EventDateInfo from '@/components/EventDateInfo';
import EventsList from '@/components/EventsList';
import EventsByCategory from '@/components/EventsPage/EventsByCategory';
import Title from '@/components/EventsPage/Title';
import LeisureCategories from '@/components/LeisureCategories';
import PageLayout from '@/components/PageLayout';
import PhotoGallery from '@/components/PhotoReport';
import Recommendations from '@/components/Recommendations';
import SiteGallery from '@/components/SiteGallery';
// import Posters from '@/components/Posters';
import Tickers from '@/components/Tickers';
import categories from '@/constants/Categories';
import { isEmpty } from '@/functions';
import { CheckToken } from '@/functions/AxiosHandlers';
import { City } from '@/types/City';
import { EventInList } from '@/types/EventInList';
import { LeisureCategory } from '@/types/LeisureCategory';

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

async function GetEventumEvents() {
    const UserCityId = getCookie('UserCityId', { cookies });
    const UserCategoryId = getCookie('UserCategoryId', { cookies });

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const url =
        process.env.NEXT_PUBLIC_SERVICES_TEMP_URL +
        'eventum/forCommerce' +
        `?CityId=${UserCityId ? (parseInt(UserCityId) === 0 ? '' : UserCityId) : ''}` +
        `&LeisureCategoryId=${UserCategoryId ? (parseInt(UserCategoryId) === 0 ? '' : UserCategoryId) : ''}`;

    try {
        const res = await fetch(url, {
            next: {
                revalidate: 300,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            // Вместо вывода в консоль, обработка ошибки
            console.error('Fetch response was not ok:', res);
            // Возврат пустого массива или объекта ошибки
            return [];
        }

        return await res.json();
    } catch (error) {
        // Логирование ошибки
        console.error('GetEventumEvents failed:', error);
        // Возврат пустого массива или объекта ошибки
        return [];
    }
}

async function GetPosters() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const url = process.env.NEXT_PUBLIC_SERVICES_TEMP_URL + 'posters/forCommerce';
    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.log('res: ', res);
            // This will activate the closest `error.js` Error Boundary
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        // Логирование ошибки
        console.error('GetPosters failed:', error);
        // Возврат пустого массива или объекта ошибки
        return [];
    }
}

async function GetRecs() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const url = process.env.NEXT_PUBLIC_SERVICES_TEMP_URL + 'recommendations/forCommerce';
    try {
        const res = await fetch(url, {
            next: {
                revalidate: 300,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.log('res: ', res);
            // This will activate the closest `error.js` Error Boundary
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        // Логирование ошибки
        console.error('GetRecs failed:', error);
        // Возврат пустого массива или объекта ошибки
        return [];
    }
}

async function GetTickers() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const url = process.env.NEXT_PUBLIC_SERVICES_TEMP_URL + 'tickers/forCommerce';

    try {
        const res = await fetch(url, {
            next: {
                revalidate: 300,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.log('res: ', res);
            // This will activate the closest `error.js` Error Boundary
            return [];
        }

        return res.json();
    } catch (error) {
        // Логирование ошибки
        console.error('GetTickers failed:', error);
        // Возврат пустого массива или объекта ошибки
        return [];
    }
}

async function GetLeisureCategories() {
    try {
        const UserLang = getCookie('UserLang', { cookies });
        // const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');
        let acceptLanguage = 'ru-RU';
        switch (UserLang?.toLocaleLowerCase()) {
            case 'kk':
                acceptLanguage = 'kz-KZ';
                break;
            case 'en':
                acceptLanguage = 'en-US';
                break;
        }

        const token = await CheckToken();
        const res = await fetch(process.env.NEXT_PUBLIC_MANAGEMENT_URL + 'commercial/leisureCategories', {
            next: {
                revalidate: 300,
            },
            headers: {
                'Accept-Language': acceptLanguage,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch data. Status: ${res.status}`);
        }

        const leisureCategories: LeisureCategory[] = await res.json();

        return leisureCategories;
    } catch (error) {
        const leisureCategories: LeisureCategory[] = [];
        return leisureCategories;
    }
}

async function GetCities() {
    try {
        const UserLang = getCookie('UserLang', { cookies });
        const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');
        let acceptLanguage = 'ru-RU';
        switch (UserLang?.toLocaleLowerCase()) {
            case 'kk':
                acceptLanguage = 'kz-KZ';
                break;
            case 'en':
                acceptLanguage = 'en-US';
                break;
        }

        const token = await CheckToken();
        const res = await fetch(process.env.NEXT_PUBLIC_MANAGEMENT_URL + 'commercial/cities', {
            headers: {
                'Accept-Language': acceptLanguage,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch data. Status: ${res.status}`);
        }

        const allCities: City = { id: 0, name: locale.Header.AllCities };
        const cities: City[] = await res.json();

        return [allCities, ...cities];
    } catch (error) {
        console.error('Error fetching cities - method "GetCities":', error);
        const cities: City[] = [];
        return cities;
    }
}

const Posters = dynamic(() => import('@/components/Posters'), {
    ssr: false,
    loading() {
        return (
            <div className="container mx-auto md:py-5 flex justify-between">
                <div className="w-screen -mx-4 md:mx-0 min-h-[270px] 3xl:min-h-[382px] 2xl:min-h-[306px] xl:min-h-[251px] lg:min-h-[187px] md:min-h-[187px] md:rounded-2xl md:w-full animate-pulse bg-gray-200"></div>
            </div>
        );
    },
});

const HorizontalCalendar = dynamic(() => import('@/components/EventsPage/HorizontalCalendar'), {
    ssr: false,
    loading() {
        return (
            <div className="container mx-auto py-5 flex justify-between">
                {[...Array(20)].map((_, index) => (
                    <div key={index} className="min-h-[56px] rounded-2xl min-w-[48px] animate-pulse bg-gray-200"></div>
                ))}
            </div>
        );
    },
});

const SubscribeForm = dynamic(() => import('@/components/SubscribeForm'), {
    ssr: false,
    loading() {
        return (
            <div className="container mx-auto md:py-5 flex justify-between">
                <div className="w-screen -mx-4 md:mx-0 min-h-[270px] 3xl:min-h-[382px] 2xl:min-h-[306px] xl:min-h-[251px] lg:min-h-[187px] md:min-h-[187px] md:rounded-2xl md:w-full animate-pulse bg-gray-200"></div>
            </div>
        );
    },
});

type Props = {
    params: { code: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
    const startDate =
        typeof searchParams.startDate === 'string' ? searchParams.startDate : searchParams.startDate?.[0] || '';
    const period = typeof searchParams.period === 'string' ? searchParams.period : searchParams.period?.[0] || '';
    const EventsData = await GetEvents(startDate, period);
    const PostersData = await GetPosters();
    const RecsData = await GetRecs();
    const TickersData = await GetTickers();
    const EventumEventsData = await GetEventumEvents();
    const leisureCategories = await GetLeisureCategories();
    const UserCityId = getCookie('UserCityId', { cookies });
    const AdsIsClosed = getCookie('AdsIsClosed', { cookies });
    const UserLang = getCookie('UserLang', { cookies });
    const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');
    const UserCategoryId = getCookie('UserCategoryId', { cookies });
    const selectedCategory = leisureCategories.find((x: LeisureCategory) => {
        if (UserCategoryId) {
            return x.id === parseInt(UserCategoryId);
        } else {
            return x.id === 0;
        }
    }) ?? { id: 0, name: locale.EventListPage.All, code: 'all' };
    const cities = await GetCities();
    const selectedCity = cities.find((x: City) => {
        if (UserCityId) {
            return x.id === parseInt(UserCityId);
        } else {
            return x.id === 0;
        }
    }) ?? { id: 0, name: locale.Header.AllCities };

    return (
        <PageLayout>
            <EventsList />
            <PhotoGallery />
            <SiteGallery />
        </PageLayout>
    );
}
