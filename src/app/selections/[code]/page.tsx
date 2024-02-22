import { getCookie } from 'cookies-next';
import { getDictionary } from 'dictionaries';
// import { getDictionary } from 'dictionaries';
import { cookies } from 'next/headers';
import Link from 'next/link';

import EmptyPoster from '@/assets/empty-poster.svg';
import EventDateInfo from '@/components/EventDateInfo';
import { isEmpty } from '@/functions';
import { CheckToken } from '@/functions/AxiosHandlers';
import { EventInList } from '@/types/EventInList';

import type { Metadata, Viewport } from 'next';

async function GetSelectionData(selectionCode: string) {
    const { NEXT_PUBLIC_EVENTS_URL = '' } = process.env;

    const UserLang = getCookie('UserLang', { cookies });
    let acceptLanguage = 'ru-RU';
    switch (UserLang?.toLocaleLowerCase()) {
        case 'kz':
            acceptLanguage = 'kz-KZ';
            break;
        case 'en':
            acceptLanguage = 'en-US';
            break;
        case 'ru':
        default:
            acceptLanguage = 'ru-RU';
            break;
    }
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const res = await fetch(NEXT_PUBLIC_EVENTS_URL + 'commercial/EventSelections', {
        headers: {
            'Accept-Language': acceptLanguage,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        console.log('res: ', res);
        // This will activate the closest `error.js` Error Boundary
        return [];
    }

    const data = await res.json();
    const TargetSelection = data?.eventSelections?.find((x: any) => x.code === selectionCode);

    if (isEmpty(TargetSelection)) {
        return {};
    }
    return TargetSelection;
}

async function GetEvents(selectionId: string) {
    const { NEXT_PUBLIC_EVENTS_URL = '' } = process.env;

    if (!isEmpty(selectionId)) {
        const UserLang = getCookie('UserLang', { cookies });
        const token = await CheckToken();
        let acceptLanguage = 'ru-RU';
        switch (UserLang?.toLocaleLowerCase()) {
            case 'kz':
                acceptLanguage = 'kz-KZ';
                break;
            case 'en':
                acceptLanguage = 'en-US';
                break;
            case 'ru':
            default:
                acceptLanguage = 'ru-RU';
                break;
        }
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const res = await fetch(`${NEXT_PUBLIC_EVENTS_URL}/commercial/events?Top=100&SelectionId=${selectionId}`, {
            headers: {
                'Accept-Language': acceptLanguage,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.log('res: ', res);
            // This will activate the closest `error.js` Error Boundary
            return null;
        }

        const data = await res.json();

        return data;
    }
    return [];
}

type Props = {
    params: { code: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const data = await GetSelectionData(params.code);
    if (isEmpty(data)) {
        return {
            title: `Подборка мероприятий - Kazticket.kz`,
        };
    }
    return {
        title: `${data?.nameRu} - Kazticket.kz`,
    };
}

export const viewport: Viewport = {
    width: 'device-width',
    userScalable: false,
};

export default async function EventSelectionPage({ params }: Props) {
    const TargetSelection = await GetSelectionData(params.code);
    const EventsData = await GetEvents(TargetSelection?.id);
    const UserLang = getCookie('UserLang', { cookies });
    const UserCityId = getCookie('UserCityId', { cookies });
    const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');

    const GetSelectionName = () => {
        switch (UserLang?.toLocaleLowerCase()) {
            case 'kz':
                return TargetSelection?.nameKz;
            case 'en':
                return TargetSelection?.nameEn;
            case 'ru':
            default:
                return TargetSelection?.nameRu;
        }
    };

    if (!isEmpty(EventsData)) {
        return (
            <div>
                <nav className="flex my-2" aria-label="Breadcrumb">
                    <ol className="flex lg:flex-row lg:items-center flex-col items-start lg:space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-lg font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                            >
                                <svg
                                    className="w-3 h-3 me-2.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                                {locale.SelectionsPage.MainPage}
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ms-1 text-lg font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                    {locale.SelectionsPage.SelectionOfEvents}
                                </span>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg
                                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ms-1 text-lg font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    {GetSelectionName()}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <div className="flex flex-wrap -mx-4">
                    {EventsData?.items?.map((x: EventInList) => {
                        return (
                            <div key={x.id} className="w-full md:w-1/2 lg:w-1/3 p-2 transition duration-200 relative">
                                <Link href={'/event/' + x.code}>
                                    <div className="cursor-pointer w-full h-auto md:hover:shadow-xl md:hover:scale-105 transition duration-300 rounded-md">
                                        <div className="w-full relative rounded-md -z-10">
                                            {isEmpty(x.posterFileUrl) ? (
                                                <>
                                                    <img
                                                        className="w-full h-64 object-cover -z-10 rounded-md"
                                                        src={EmptyPoster.src}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div
                                                        className="w-full h-full rounded-md -z-10 relative bg-cover bg-no-repeat bg-center"
                                                        style={{
                                                            backgroundImage: `url("${x.posterFileUrl ?? ''}")`,
                                                            filter: 'blur(2px)',
                                                            height: '100%',
                                                        }}
                                                    >
                                                        <img
                                                            className="h-64 object-contain rounded-md"
                                                            src={x.posterFileUrl}
                                                        />
                                                    </div>
                                                    <img
                                                        className="p-1 absolute -z-10 top-0 w-full h-64 object-contain rounded-md"
                                                        src={x.posterFileUrl}
                                                    />
                                                </>
                                            )}
                                            <div className="bg-white px-2 font-medium absolute left-3 bottom-3 rounded-md text-black dark:bg-black dark:text-white">
                                                от {x.minCost} тг.
                                            </div>
                                            <div className="bg-white px-2 font-medium absolute right-3 bottom-3 rounded-md text-black dark:bg-black dark:text-white">
                                                {x.ageLimit}+
                                            </div>
                                        </div>
                                        <span className="mb-4 md:text-2xl px-2 leading-tight font-bold text-black dark:text-white">
                                            {x.name}
                                        </span>
                                        <p className="text-coolGray-500 font-medium px-2 dark:text-white">
                                            <EventDateInfo date={x.beginDate} />
                                            {isEmpty(UserCityId) || parseInt(UserCityId ?? '0') === 0 ? (
                                                <b> - {x.cityName}</b>
                                            ) : (
                                                ''
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        return (
            <>
                <div className="max-w-4xl mx-auto my-24 px-10 py-4 bg-white rounded-lg shadow-xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <h2 className="text-3xl font-semibold mb-2 text-center">К сожалению подборка не найдена!</h2>
                        <Link href="/" target="_blank">
                            <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
                                На главную
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}