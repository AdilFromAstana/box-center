import { getCookie } from 'cookies-next';
import { getDictionary } from 'dictionaries';
// import { getDictionary } from 'dictionaries';
import { cookies } from 'next/headers';
import Link from 'next/link';
import QRCodeLib from 'qrcode';

import OrderDateTimeProperty from '@/components/OrderDateTimeProperty';
import EventSources from '@/constants/EventSources.json';
import SectorTypes from '@/constants/SectorTypes.json';
import { isEmpty } from '@/functions';

import type { Metadata, Viewport } from 'next';

async function GetOrderData(orderNumber: string) {
    const { ORDERS_API_URL = '' } = process.env;

    const UserLang = getCookie('UserLang', { cookies });
    let acceptLanguage = 'ru-RU';
    switch (UserLang?.toLocaleLowerCase()) {
        case 'kk':
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

    const res = await fetch(`${ORDERS_API_URL}${orderNumber}/ticket`, {
        headers: {
            'Accept-Language': acceptLanguage,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        console.log('res: ', res);
        // This will activate the closest `error.js` Error Boundary
        return null;
    }

    const data = await res.json();

    // const groupedServices = groupArray(!isEmpty(data.serviceGroups) ? data.serviceGroups : [], 'serviceGroupName');

    return data;
}

type Props = {
    params: { number: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const orderNumber = params.number;
    const data = await GetOrderData(orderNumber);
    if (isEmpty(data)) {
        return {
            title: `Билет - Boxcenter.kz`,
        };
    }
    return {
        title: `Билеты ${data?.details?.eventName} - Boxcenter.kz`,
    };
}

export const viewport: Viewport = {
    width: 'device-width',
    userScalable: false,
};

const GenerateQRCode = async (orderNumber: number) => {
    if (!isEmpty(orderNumber)) {
        try {
            const url = await QRCodeLib.toDataURL(`${orderNumber}`, {
                color: {
                    dark: '#000000', // Тёмные точки QR-кода
                    light: '#ffffff', // Фон QR-кода
                },
                width: 300,
                margin: 2,
                // Другие опции стилизации...
            });

            return url;
        } catch (err) {
            console.log('Ошибка при генерации QR-кода:', err);
            return '';
        }
    } else {
        return '';
    }
};

export default async function OrderPage({ params }: Props) {
    const data = await GetOrderData(params.number);
    const UserLang = getCookie('UserLang', { cookies });
    const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');
    const QRcodeData = await GenerateQRCode(data?.orderNumber);

    const Property = ({ name, value }: { name: string; value: any }) => {
        if (Array.isArray(value)) {
            return (
                <div className="flex flex-row justify-between gap-2 w-full">
                    <div className="text-[#00000080] dark:text-white lg:text-2xl text-base">{name}</div>
                    <div className="lg:text-2xl text-base flex flex-col text-right dark:text-white">
                        {value.map((x: any) => (
                            <div key={x}>{x}</div>
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-row justify-between gap-2 w-full">
                    <div className="text-[#00000080] dark:text-white lg:text-2xl text-base">{name}</div>
                    <div className="lg:text-2xl text-base text-right dark:text-white">{value}</div>
                </div>
            );
        }
    };

    if (!isEmpty(data)) {
        return (
            <div className="flex flex-col h-min gap-2">
                <div className="text-4xl text-center">{locale.OrderPage.Tickets}</div>
                <div className="lg:max-w-4xl max-w-full mx-auto mb-4 lg:px-10 px-4 py-4 bg-white dark:bg-[#ffffff0d] rounded-lg shadow-2xl">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-full flex flex-col items-center">
                            {QRcodeData && (
                                <img id="QRcodeImage" className="rounded-lg" src={QRcodeData} alt="QR Code" />
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex flex-row gap-2">
                                <div className="font-medium text-[#000000db] dark:text-white">
                                    {locale.OrderPage.ShowQR}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <div className="font-medium text-[#00000080] dark:text-white">
                                    {locale.OrderPage.OrderNumber}
                                </div>
                                <div className="font-medium dark:text-white">{data.orderNumber}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <div className="font-medium text-[#00000080] dark:text-white">
                                    {locale.OrderPage.TotalCost}
                                </div>
                                <div className="font-medium dark:text-white">{data.finalCost} ₸</div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <Property name={locale.OrderPage.Event} value={data.details.eventName} />
                            <OrderDateTimeProperty
                                UserLang={UserLang}
                                cityTimeZone={data?.details?.cityTimeZone ?? 6}
                                fieldName={locale.OrderPage.StartOfSession}
                                date={data.details.sessionBeginDateTime}
                            />
                            {!isEmpty(data.details.sessionEndDateTime) && (
                                <OrderDateTimeProperty
                                    UserLang={UserLang}
                                    cityTimeZone={data?.details?.cityTimeZone ?? 6}
                                    fieldName={locale.OrderPage.EndOfSession}
                                    date={data.details.sessionEndDateTime}
                                />
                            )}
                            <Property name={locale.OrderPage.Address} value={data.details.address} />
                            <Property name={locale.OrderPage.Location} value={data.details.location} />
                            <Property name={locale.OrderPage.Sector} value={data.details.sectorName} />
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <div className="flex flex-row gap-2 justify-center">
                                <div className="font-medium text-[#000000db] dark:text-white">
                                    {locale.OrderPage.Services}
                                </div>
                            </div>
                            {data.details?.items?.map((item: any) => {
                                switch (data.details.eventProvider) {
                                    case EventSources.EventumOne: {
                                        switch (data.details.sectorType) {
                                            case SectorTypes.StandingPlaces: {
                                                return (
                                                    <Property
                                                        key={`${item.sessionServiceGroupId}-${item.id}`}
                                                        name={''}
                                                        value={item.priceCategoryName}
                                                    />
                                                );
                                            }
                                            case SectorTypes.Tribune: {
                                                return (
                                                    <Property
                                                        key={`${item.sessionServiceGroupId}-${item.id}`}
                                                        name={`${item.priceCategoryName}`}
                                                        value={`Ряд ${item.row} Место ${item.number}`}
                                                    />
                                                );
                                            }
                                            default:
                                                return <></>;
                                        }
                                    }
                                    case EventSources.KazticketExclusive: {
                                        return item?.services?.map((service: any, index: number) => {
                                            switch (data.details.sectorType) {
                                                case SectorTypes.StandingPlaces: {
                                                    return (
                                                        <Property
                                                            key={`${item.sessionServiceGroupId}-${index}`}
                                                            name={`${item.serviceGroupName}`}
                                                            value={`${service.sessionServiceTitle}`}
                                                        />
                                                    );
                                                }
                                                case SectorTypes.Tribune: {
                                                    return (
                                                        <Property
                                                            key={`${item.sessionServiceGroupId}-${index}`}
                                                            name={`${item.serviceGroupName} ${service.sessionServiceTitle}`}
                                                            value={`Ряд ${service.trubuneSeatRowNumber} Место ${service.trubuneSeatNumber}`}
                                                        />
                                                    );
                                                }
                                                default:
                                                    return <></>;
                                            }
                                        });
                                    }
                                    default:
                                        break;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <>
                <div className="max-w-4xl mx-auto my-24 px-10 py-4 bg-white rounded-lg shadow-xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <h2 className="text-3xl font-semibold mb-2 text-center">К сожалению Ваш заказ не найден!</h2>
                        <p className="text-gray-600 text-center text-lg leading-relaxed">Пожалуйста свяжитесь с нами</p>
                        <Link href="/contacts" target="_blank">
                            <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
                                Связатся с нами
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}
