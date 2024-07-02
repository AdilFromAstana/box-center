import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getDictionary } from 'dictionaries';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Event, WithContext } from 'schema-dts';

import EmptyPoster from '@/assets/empty-poster.svg';
// import SoldOut from '@/assets/soldout.svg';
import KazticketButton from '@/components/KazticketButton';
import LeisureCategories from '@/components/LeisureCategories';
import SubscribeForm from '@/components/SubscribeForm';
import EventStatuses from '@/constants/EventStatuses.json';
import { isEmpty } from '@/functions';
// import { isEmpty } from '@/functions';
import { CheckToken } from '@/functions/AxiosHandlers';
import { Event as EventDto } from '@/types/Event';
import { LeisureCategory } from '@/types/LeisureCategory';

import type { Metadata, Viewport } from 'next';

dayjs.extend(utc);

async function GetLeisureCategories() {
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
        const res = await fetch(process.env.NEXT_PUBLIC_MANAGEMENT_URL + 'commercial/leisureCategories', {
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
        const defaultCategory: LeisureCategory = { id: 0, name: locale.EventListPage.All, code: 'all' };

        return [defaultCategory, ...leisureCategories];
    } catch (error) {
        const leisureCategories: LeisureCategory[] = [];
        return leisureCategories;
    }
}

async function GetEventData(code: string) {
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

    const res = await fetch(NEXT_PUBLIC_EVENTS_URL + 'commercial/Events/' + code, {
        headers: {
            'Accept-Language': acceptLanguage,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        console.log('GetEventData Error: ', res);
        return null;
    }

    return res.json();
}

type Props = {
    params: { code: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const code = params.code;
    const data = await GetEventData(code);
    if (!data) {
        return {
            title: `Kazticket.kz`,
        };
    } else {
        return {
            title: `${data.name} - Купить билеты на Kazticket.kz`,
            openGraph: {
                images: data.posterFileUrl,
                type: 'website',
                url: `${process.env.NEXT_PUBLIC_APP_URL}/event/${data.code}`,
            },
            description: data.description
                ?.replace(/<[^>]*>?/gm, ' ')
                ?.replace(/&nbsp;/gi, ' ')
                ?.replace(/\s+/g, ' '),
        };
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    userScalable: false,
};

export default async function EventPage({ params }: Props) {
    const data: EventDto = await GetEventData(params.code);
    const leisureCategories = await GetLeisureCategories();
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

    if (!data) {
        return (
            <main className="h-96 w-full flex flex-col justify-center items-center">
                <h1 className="text-9xl font-extrabold dark:text-white text-black tracking-widest">404</h1>
                <div className="bg-[#28aad1] text-white px-2 text-sm rounded rotate-12 absolute">
                    {locale.Errors.PageNotFound}
                </div>
                <button className="mt-5">
                    <div className="relative inline-block text-sm font-medium text-[#28aad1] group active:text-orange-500 focus:outline-none focus:ring">
                        <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#28aad1] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                        <span className="relative block px-8 py-3 bg-[#28aad1] text-white border border-current">
                            <Link href="/">{locale.Errors.ToMain}</Link>
                        </span>
                    </div>
                </button>
            </main>
        );
    } else {
        // JSON-LD микроразметка для страницы мероприятия
        const jsonLdScript: WithContext<Event> = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: `${data.name} - Kazticket.kz`,
            image: data.posterFileUrl ?? '',
            description: data.description
                ?.replace(/<[^>]*>?/gm, ' ')
                ?.replace(/&nbsp;/gi, ' ')
                ?.replace(/\s+/g, ' '),
            startDate: dayjs(data.beginDate).utc().add(data.cityTimeZone, 'h').format(), // Дата и время начала мероприятия
            offers: {
                '@type': 'Offer',
                priceCurrency: 'KZT',
                price: data.minCost, // Минимальная цена
                availability: 'https://schema.org/InStock', // Наличие билетов (замените на соответствующий статус)
            },
            location: {
                '@type': 'Place',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: data.cityName, // Город
                },
            },
        };

        return (
            <div className="px-2">
                <Script
                    id="json-ld-microdata"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }}
                />
                <Script src={`${process.env.NEXT_PUBLIC_WIDGET_URL}?time=${new Date().getMilliseconds()}`} />
                {data.code === 'almaty-profiling-and-selling' && (
                    <>
                        <Script
                            id="metrikForProfilingEvent"
                            dangerouslySetInnerHTML={{
                                __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1007202987644044');
                fbq('track', 'PageView');
            `,
                            }}
                        />
                        <noscript id="imgForMetrikForProfilingEvent">
                            <img
                                height="1"
                                width="1"
                                style={{ display: 'none' }}
                                src="https://www.facebook.com/tr?id=1007202987644044&ev=PageView&noscript=1"
                            />
                        </noscript>
                    </>
                )}
                <LeisureCategories leisureCategories={leisureCategories} selectedCategory={selectedCategory} />
                <div className="-mx-6 py-2">
                    <div className="w-full h-full relative transition duration-200">
                        <div className="bg-[#22182666] absolute w-full h-full top-0 left-0 z-20">
                            <div className="container mx-auto">
                                <div className="absolute lg:bottom-10 bottom-5 lg:left-auto left-4 flex flex-col gap-3">
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="lg:text-3xl text-base font-semibold text-white">
                                            {data.name}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-center gap-8">
                                        <div className="flex flex-row gap-2 items-center">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7.5 6.66577V16.6658M12.5 3.33244V13.3324M3.86682 3.63812L6.43303 5.77663C7.0511 6.29169 7.9489 6.29169 8.56697 5.77663L11.433 3.38825C12.0511 2.87319 12.9489 2.87319 13.567 3.38825L16.9003 6.16603C17.2803 6.48269 17.5 6.95176 17.5 7.4464V15.7199C17.5 16.4264 16.676 16.8124 16.1332 16.3601L13.567 14.2216C12.9489 13.7065 12.0511 13.7065 11.433 14.2216L8.56697 16.61C7.9489 17.125 7.0511 17.125 6.43303 16.61L3.09969 13.8322C2.7197 13.5155 2.5 13.0464 2.5 12.5518V4.27831C2.5 3.57178 3.32405 3.18581 3.86682 3.63812Z"
                                                    stroke="#DBDBDB"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="relative text-white lg:text-base text-sm">
                                                {data.cityName}
                                            </span>
                                        </div>
                                        {!isEmpty(data.beginDate) && (
                                            <div className="flex flex-row gap-2 items-center">
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M2.5 8.33268H17.5M6.66667 4.99935V1.66602M13.3333 4.99935V1.66602M7.83333 18.3327H12.1667C14.0335 18.3327 14.9669 18.3327 15.68 17.9694C16.3072 17.6498 16.8171 17.1399 17.1367 16.5127C17.5 15.7996 17.5 14.8662 17.5 12.9993V8.66602C17.5 6.79917 17.5 5.86575 17.1367 5.15271C16.8171 4.52551 16.3072 4.01557 15.68 3.69599C14.9669 3.33268 14.0335 3.33268 12.1667 3.33268H7.83333C5.96649 3.33268 5.03307 3.33268 4.32003 3.69599C3.69282 4.01557 3.18289 4.52551 2.86331 5.15271C2.5 5.86575 2.5 6.79917 2.5 8.66602V12.9993C2.5 14.8662 2.5 15.7996 2.86331 16.5127C3.18289 17.1399 3.69282 17.6498 4.32003 17.9694C5.03307 18.3327 5.96649 18.3327 7.83333 18.3327Z"
                                                        stroke="#DBDBDB"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <span className="relative text-white lg:text-base text-sm">
                                                    {dayjs(data.beginDate)
                                                        .utc()
                                                        .add(data.cityTimeZone, 'h')
                                                        .format('DD.MM.YYYY HH:mm')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Image
                            alt={data.name}
                            src={data.previewFileUrl ?? EmptyPoster}
                            height={600}
                            width={400}
                            className="lg:hidden w-full object-contain transition duration-200"
                        />
                        <Image
                            alt={data.name}
                            src={data.posterFileUrl ?? EmptyPoster}
                            height={500}
                            width={1900}
                            className="lg:block hidden w-full object-contain max-h-[600px] transition duration-200"
                        />
                    </div>
                </div>
                <div className="container mx-auto">
                    <nav className="flex lg:my-8 my-4 mx-auto" aria-label="Breadcrumb">
                        <ol className="flex flex-row items-center lg:gap-2 gap-1 text-[#00000040]  dark:text-[#FFFFFF40] ">
                            <li>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/"
                                        className="hover:text-black dark:hover:text-white lg:text-base text-sm"
                                    >
                                        {data.cityName}
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2">
                                    <span>/</span>
                                    <Link
                                        href="/"
                                        className="hover:text-black dark:hover:text-white lg:text-base text-sm"
                                    >
                                        Мероприятия
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center gap-2">
                                    <span>/</span>
                                    <h1 className="text-black dark:text-gray-400 lg:text-base text-sm line-clamp-2">
                                        {data.name}
                                    </h1>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    {data.statusId !== EventStatuses.SoldOut &&
                        data.statusId !== EventStatuses.SalesFrozen &&
                        !isEmpty(data.beginDate) && (
                            <KazticketButton locale={locale} eventCode={data.code} eventId={data.id} />
                        )}
                </div>

                <div className="container mx-auto flex flex-col gap-4 my-8">
                    <div className="w-full text-4xl text-black dark:text-white font-semibold">
                        {locale.EventPage.AboutDesc}
                    </div>
                    <div className="flex lg:flex-row flex-col lg:gap-8 gap-5">
                        <div className="flex flex-col">
                            <span className="text-[#00000040] dark:text-white">Событие</span>
                            <span className="dark:text-white">{data.name}</span>
                        </div>
                        {!isEmpty(data.beginDate) && (
                            <div className="flex flex-col">
                                <span className="text-[#00000040] dark:text-white">Дата и время</span>
                                <span className="dark:text-white">
                                    {dayjs(data.beginDate)
                                        .utc()
                                        .add(data.cityTimeZone, 'h')
                                        .format('DD.MM.YYYY - HH:mm')}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-[#00000040] dark:text-white">Возраст</span>
                            <span className="dark:text-white">{data.ageLimit}+</span>
                        </div>
                    </div>
                    <div className="EventDescription my-6 w-full invert-0 dark:invert z-0">
                        <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                    </div>
                </div>
                <div className="my-20">
                    <SubscribeForm />
                </div>
            </div>
        );
    }
}
