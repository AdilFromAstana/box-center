import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getDictionary } from 'dictionaries';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Script from 'next/script';
import { Event, WithContext } from 'schema-dts';

import KazticketButton from '@/components/KazticketButton';
import EventStatuses from '@/constants/EventStatuses.json';
import { isEmpty } from '@/functions';
import { CheckToken } from '@/functions/AxiosHandlers';

import type { Metadata, Viewport } from 'next';

dayjs.extend(utc);

async function GetEventData(code: unknown) {
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
    console.log('params: ', params);
    const code = params.code;
    const data: any = await GetEventData(code);
    console.log('data: ', data);
    if (!data) {
        return {
            title: `Box-center.kz`,
        };
    } else {
        return {
            title: `${data.name} - Купить билеты на Box-center.kz`,
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
    const data: any = await GetEventData(params.code);
    const UserLang = getCookie('UserLang', { cookies });
    const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');

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
            <div className="mb-20">
                <Script
                    id="json-ld-microdata"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }}
                />
                <Script src={`${process.env.NEXT_PUBLIC_WIDGET_URL}?time=${new Date().getMilliseconds()}`} />
                <div className="container mx-auto">
                    <h1 className="text-[#006D56]">{data.name}</h1>
                </div>
                <div className="container mx-auto">
                    <div className="EventDescription my-6 w-full invert-0 dark:invert z-0">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data.description,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="container mx-auto">
                    <div className="relative flex flex-col lg:w-1/4 sm:w-1/3 w-full gap-4">
                        <div className="flex flex-col justify-between h-full">
                            <div className="relative flex flex-col justify-between">
                                <div className="aspect-[9/16]">
                                    <img
                                        alt={data.name}
                                        src={data.previewFileUrl}
                                        className="w-full h-full object-cover shadow-lg cursor-pointer"
                                    />
                                </div>
                                <div className="absolute top-0 right-0 w-8 h-8 bg-gray-600 flex items-center justify-center text-white">
                                    {data.ageLimit}+
                                </div>
                            </div>
                            <div className="py-2 h-full flex flex-col items-center justify-between">
                                <div className="text-center text-sm text-[#006D56]">{data.name}</div>
                                <div className="flex items-center flex-row gap-4">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            x="0.5"
                                            y="0.219727"
                                            width="24"
                                            height="24"
                                            fill="url(#pattern0_29_290)"
                                        />
                                        <defs>
                                            <pattern
                                                id="pattern0_29_290"
                                                patternContentUnits="objectBoundingBox"
                                                width="1"
                                                height="1"
                                            >
                                                <use xlinkHref="#image0_29_290" transform="scale(0.0416667)" />
                                            </pattern>
                                            <image
                                                id="image0_29_290"
                                                width="24"
                                                height="24"
                                                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIFSURBVHgBzVS/a1NRFP7OzRMxo0l0LE5C3XRxsSCK4NLB5r03FNGhiNi+gP9AB0cdlBhDkIIV6ZCkOnQRoi66i4sBJ8moSTqmlCbv9OS+l/SlL31pS1L6weWed+53z3fPDx5hCChjVcCYYkIR2dIyopCxnhHDBqHG2dKd/cdq6CXGBe6wrWTHCCifiwO45L3CfKSYru7FR1ou3aYYrQnhR5SAcG8Id164X4W73vO7xD+RLb81tArTE7fDD/uqMbrpm1XxF6IEhJvwzWaQK/5VEfcENPLlX/1Dx64ghlUmzgf9QzPImF+6wQhU4Xxpj+tYgVc4VmSQ46AXs5+BcqwCxgj2977AqFofFVK26wMCo2p9ZPg9MEYSn5rnqE3fGLwgX2nfuy5NXWGDb9GOWmHl6vEkV6U5V5wPxZhkkxUmjFCJaMleG0j5jLtwqksUbvKSeQnx7Ya2W2eTyJX/YnHuCpLNP6inktqfqjfQSFzGm4+/h/IDCPeAcB+t+DW9urZMkVLGY2xenIJSd/USW/vkLMSPSmecOLhEjn0P3K56LGMa5/9toJl6IK/bEM+0z6rKv2AWifp7yWZ2gP+6+CkYbuJj6gmfbInMZXDsu8fqzAjjhWqr5y7wSsoyo/254jscEmEBxgfEW72xq+FlectdnCvImNZkTD/jOJh8iQj/xy4iMbvbLtAk3o8mVbmqAAAAAElFTkSuQmCC"
                                            />
                                        </defs>
                                    </svg>
                                    <span className="font-semibold text-sm">
                                        {dayjs(data.beginDate).format('DD.MM.YYYY')}
                                    </span>
                                </div>
                            </div>
                            {data.statusId !== EventStatuses.SoldOut &&
                                data.statusId !== EventStatuses.SalesFrozen &&
                                !isEmpty(data.beginDate) && (
                                    <KazticketButton locale={locale} eventCode={data.code} eventId={data.id} />
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
