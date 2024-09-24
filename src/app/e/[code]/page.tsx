import { getCookie } from 'cookies-next';
import { getDictionary } from 'dictionaries';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Script from 'next/script';

import eventPoster1 from '../../../assets/events/1.png';
import eventPoster2 from '../../../assets/events/2.png';
import eventPoster3 from '../../../assets/events/3.png';
import eventPoster4 from '../../../assets/events/4.png';

import type { Metadata, Viewport } from 'next';

const events = [
    {
        id: 1,
        description: `
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN продолжает гастролировать по городам России и СНГ. В 2024 году певец и музыкант представляет обновленную программу с последними хитами, а также известные композиции.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">«Отпусти и лети», «Благодарю, мама», «Я лучше всех живу», «Нежная», «МММ», Still, Boomerang, Good Love – эти и многие другие известные композиции, а также премьеры новых песен ждут зрителей. Вместе с насыщенной музыкальной программой полной романтических баллад и зажигательных хитов, зрителей   окутает самая дружественная атмосфера.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN неоднократно становился лауреатом премии «Золотой Граммофон», также в коллекции у музыканта престижные награды: World Music Awards, премии телеканалов «МУЗ-ТВ» и RU.TV, журналов GQ, HELLO и многие другие.</span></p>
        <p id="isPasted"><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Только живой звук, искренние эмоции и неподдельная страсть — всё это ждет вас на концерте 12 октября в “Центр бокса им. Сапиева”</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Начало концерта в 19.00.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">6+</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Стоимость билетов от 64 рублей до 255 рублей.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Билеты можно приобрести в кассах “Центр бокса им. Сапиева”  – тел. +7 775 844 8448, факс 777 777 и на сайтах: www.kazticket.kz, www.ticketon.kz.
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Инфолиния – + 7 (7212) 50-77-22
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
            Живой звук!
        </span></p>
        `,
        text: 'СЕРГЕЙ ЛАЗАРЕВ',
        src: eventPoster4,
        date: '6 октября | 19:00',
        minAge: 16,
    },
    {
        id: 2,
        description: `
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN продолжает гастролировать по городам России и СНГ. В 2024 году певец и музыкант представляет обновленную программу с последними хитами, а также известные композиции.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">«Отпусти и лети», «Благодарю, мама», «Я лучше всех живу», «Нежная», «МММ», Still, Boomerang, Good Love – эти и многие другие известные композиции, а также премьеры новых песен ждут зрителей. Вместе с насыщенной музыкальной программой полной романтических баллад и зажигательных хитов, зрителей   окутает самая дружественная атмосфера.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN неоднократно становился лауреатом премии «Золотой Граммофон», также в коллекции у музыканта престижные награды: World Music Awards, премии телеканалов «МУЗ-ТВ» и RU.TV, журналов GQ, HELLO и многие другие.</span></p>
        <p id="isPasted"><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Только живой звук, искренние эмоции и неподдельная страсть — всё это ждет вас на концерте 12 октября в “Центр бокса им. Сапиева”</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Начало концерта в 19.00.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">6+</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Стоимость билетов от 64 рублей до 255 рублей.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Билеты можно приобрести в кассах “Центр бокса им. Сапиева”  – тел. +7 775 844 8448, факс 777 777 и на сайтах: www.kazticket.kz, www.ticketon.kz.
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Инфолиния – + 7 (7212) 50-77-22
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
            Живой звук!
        </span></p>
        `,
        text: 'КОНЦЕРТ АЛЕКСАНДРА ПАНАЙОТОВА',
        src: eventPoster3,
        date: '12 октября | 19:00',
        minAge: 6,
    },
    {
        id: 3,
        description: `
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN продолжает гастролировать по городам России и СНГ. В 2024 году певец и музыкант представляет обновленную программу с последними хитами, а также известные композиции.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">«Отпусти и лети», «Благодарю, мама», «Я лучше всех живу», «Нежная», «МММ», Still, Boomerang, Good Love – эти и многие другие известные композиции, а также премьеры новых песен ждут зрителей. Вместе с насыщенной музыкальной программой полной романтических баллад и зажигательных хитов, зрителей   окутает самая дружественная атмосфера.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN неоднократно становился лауреатом премии «Золотой Граммофон», также в коллекции у музыканта престижные награды: World Music Awards, премии телеканалов «МУЗ-ТВ» и RU.TV, журналов GQ, HELLO и многие другие.</span></p>
        <p id="isPasted"><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Только живой звук, искренние эмоции и неподдельная страсть — всё это ждет вас на концерте 12 октября в “Центр бокса им. Сапиева”</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Начало концерта в 19.00.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">6+</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Стоимость билетов от 64 рублей до 255 рублей.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Билеты можно приобрести в кассах “Центр бокса им. Сапиева”  – тел. +7 775 844 8448, факс 777 777 и на сайтах: www.kazticket.kz, www.ticketon.kz.
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Инфолиния – + 7 (7212) 50-77-22
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
            Живой звук!
        </span></p>
        `,
        text: 'EMIN',
        src: eventPoster2,
        date: '17 ноября | 19:00',
        minAge: 6,
    },
    {
        id: 4,
        description: `
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN продолжает гастролировать по городам России и СНГ. В 2024 году певец и музыкант представляет обновленную программу с последними хитами, а также известные композиции.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">«Отпусти и лети», «Благодарю, мама», «Я лучше всех живу», «Нежная», «МММ», Still, Boomerang, Good Love – эти и многие другие известные композиции, а также премьеры новых песен ждут зрителей. Вместе с насыщенной музыкальной программой полной романтических баллад и зажигательных хитов, зрителей   окутает самая дружественная атмосфера.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">EMIN неоднократно становился лауреатом премии «Золотой Граммофон», также в коллекции у музыканта престижные награды: World Music Awards, премии телеканалов «МУЗ-ТВ» и RU.TV, журналов GQ, HELLO и многие другие.</span></p>
        <p id="isPasted"><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Только живой звук, искренние эмоции и неподдельная страсть — всё это ждет вас на концерте 12 октября в “Центр бокса им. Сапиева”</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Начало концерта в 19.00.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">6+</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">Стоимость билетов от 64 рублей до 255 рублей.</span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Билеты можно приобрести в кассах “Центр бокса им. Сапиева”  – тел. +7 775 844 8448, факс 777 777 и на сайтах: www.kazticket.kz, www.ticketon.kz.
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
        Инфолиния – + 7 (7212) 50-77-22
        </span></p>
        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
            Живой звук!
        </span></p>
        `,
        text: 'КОНЦЕРТ БАЛЕТА АЛЛЫ ДУХОВОЙ TODES',
        src: eventPoster1,
        date: '21 ноября | 19:00',
        minAge: 6,
    },
];

async function GetEventData(code: string) {
    const needEvent = events.find((i: any) => i.id == code);
    return needEvent;
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
            title: `Boxcenter.kz`,
        };
    } else {
        return {
            title: `${data.text} - Купить билеты на boxcenter.kz`,
            openGraph: {
                images: data.src.src,
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
    const data = await GetEventData(params.code);
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
        return (
            <div className='mb-20'>
                <div className="container mx-auto">
                    <h1 className="text-[#006D56]">{data.text}</h1>
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
                    <div className="relative flex flex-col w-1/4 gap-4">
                        <img alt={data.text} src={data.src.src} className="w-full h-[52.5vh] object-cover shadow-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gray-600 flex items-center justify-center">
                            {data.minAge}+
                        </div>
                        <div className="flex items-center flex-row gap-4">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect x="0.5" y="0.219727" width="24" height="24" fill="url(#pattern0_29_290)" />
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
                            <span className="font-semibold">{data.date}</span>
                        </div>
                        <button className="bg-[#006D56] text-white w-full">Купить</button>
                    </div>
                </div>
                <Script src={process.env.NEXT_PUBLIC_EVENTUM_WIDGET_URL} />
            </div>
        );
    }
}
