import { ChatBubbleLeftRightIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/outline';
import { getCookie } from 'cookies-next';
import { getDictionary } from 'dictionaries';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { CheckToken } from '@/functions/AxiosHandlers';
import { City } from '@/types/City';
import { Dropdown } from '@/types/Dropdown';
import Footer from './Footer';
import Header from './Header';

// import TabBar from './TabBar';

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

const langs = [
    {
        key: 'Kk',
        text: 'Қазақша',
        value: 'Kk',
    },
    {
        key: 'Ru',
        text: 'Русский',
        value: 'Ru',
    },
    {
        key: 'En',
        text: 'English',
        value: 'En',
    },
];
interface PageLayoutProps {
    children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = async ({ children }) => {
    const UserLang = getCookie('UserLang', { cookies });
    const selectedLang = langs.find((x: Dropdown) => x.key === UserLang) ?? langs[0];
    const locale = await getDictionary(UserLang?.toLocaleLowerCase() ?? 'ru');
    const UserCityId = getCookie('UserCityId', { cookies });
    const cities = await GetCities();
    const selectedCity = cities.find((x: City) => {
        if (UserCityId) {
            return x.id === parseInt(UserCityId);
        } else {
            return x.id === 0;
        }
    }) ?? { id: 0, name: locale.Header.AllCities };

    const pages = [
        {
            label: locale.Footer.Contract,
            url: '/offer_contract',
            icon: <DocumentTextIcon className="h-5 w-5" />,
        },
        {
            label: locale.Footer.PaymentSecurity,
            url: '/payment_security',
            icon: <DocumentTextIcon className="h-5 w-5" />,
        },
        {
            label: locale.Footer.PrivacyPolicy,
            url: '/security_policy',
            icon: <DocumentTextIcon className="h-5 w-5" />,
        },
        {
            label: locale.Footer.Contacts,
            url: '/contacts',
            icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
        },
        {
            label: 'Организаторам',
            url: '/offer',
            icon: <UsersIcon className="h-5 w-5" />,
        },
        // {
        //     label: locale.Footer.AboutUs,
        //     url: '/about_us',
        //     icon: <UserGroupIcon className="h-5 w-5" />,
        // },
    ];

    return (
        <div>
            {/* <div className="w-screen py-1 px-2 bg-[#F3F3F3] lg:block hidden">
                <div className="flex gap-8 container mx-auto">
                    <Link className="text-gray-900 dark:text-white" href="tel:+7-708-08-08-999" target="_blank">
                        <span className="text-base leading-5 font-medium">+7-708-08-08-999</span>
                    </Link>
                    <Link className="text-[#2F2F3873] dark:text-white" href="#id" target="_blank">
                        <span className="text-sm leading-5">Где мой билет?</span>
                    </Link>
                    <Link className="text-[#2F2F3873] dark:text-white" href="#id" target="_blank">
                        <span className="text-sm leading-5">Как сделать возврат?</span>
                    </Link>
                    <Link className="text-[#2F2F3873] dark:text-white" href="#id" target="_blank">
                        <span className="text-sm leading-5">У кого я могу спросить?</span>
                    </Link> 
                </div>
            </div> */}
            {/* Blue line under posters */}
            <svg
                className="lg:block hidden absolute -z-10 right-0 -top-[21%] w-screen h-full rotate-12"
                width="1600"
                height="643"
                viewBox="0 0 1600 643"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M-277.5 374.5C-174.093 377.139 73.5003 658.927 -19 633.5C-467.758 510.145 991.3 460.559 673.969 460.559C530.5 460.559 493.037 539.627 732 601C947.303 656.296 830.237 520.86 1042.26 399.323C1254.28 277.786 1455.67 326.003 1525.5 227.5C1622.06 91.297 1503.52 -17.6983 1460.66 13.6204C1377.86 74.1396 1449.44 181.207 1645.05 57.8023"
                    stroke="#0490C3"
                    strokeOpacity="0.4"
                    strokeWidth="15"
                />
            </svg>

            <Header
                langs={langs}
                locale={locale}
                pages={pages}
                cities={cities}
                selectedCity={selectedCity}
                selectedLang={selectedLang}
            />
            <div className="px-4">{children}</div>
            <Footer locale={locale} pages={pages} />
            {/* <TabBar locale={locale} pages={pages} /> */}
        </div>
    );
};

export default PageLayout;
