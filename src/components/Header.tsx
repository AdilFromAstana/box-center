'use client';

import { Dialog, Popover, Transition } from '@headlessui/react';
import {
    // Bars3Icon,
    // BuildingOffice2Icon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    MoonIcon,
    // PhoneIcon,
    SunIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { getCookie, setCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import WhiteMonoLogo from '@/assets/kazticket-logo-white-mono.svg';
import Logo from '@/assets/kazticket-logo.svg';
import { isEmpty } from '@/functions';
import { City } from '@/types/City';
import { Dropdown } from '@/types/Dropdown';
// import PushNotificationRequest from './PushNotificationRequest';
import SearchBox from './SearchBox';

interface HeaderProps {
    cities: City[];
    langs: Dropdown[];
    selectedCity: City;
    selectedLang: Dropdown;
    locale: any;
    pages: any[];
}

const Header = ({ locale, selectedCity, cities, langs, selectedLang, pages }: HeaderProps) => {
    const [isSupportMenuOpen, setSupportMenuOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [isSearchMenuOpen, setSearchMenuOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const UserLang = getCookie('UserLang');
        if (isEmpty(UserLang)) {
            setCookie('UserLang', 'Ru', {
                maxAge: 60 * 60 * 24 * 365,
            });
        }
    }, []);

    useEffect(() => {
        if (
            getCookie('theme') === 'dark' ||
            (isEmpty(getCookie('theme')) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, [!isDarkMode]);

    const handleSelectCity = (city: City) => {
        if (selectedCity?.id !== city.id) {
            setCookie('UserCityId', city.id, {
                maxAge: 60 * 60 * 24 * 365,
            });
            location.reload();
        }
    };

    const handleSelectLang = (lang: Dropdown) => {
        if (selectedLang?.key !== lang.key) {
            setCookie('UserLang', lang.value, {
                maxAge: 60 * 60 * 24 * 365,
            });
            location.reload();
        }
    };

    return (
        <header className="container mx-auto lg:px-2 px-4 lg:py-0 py-2">
            <nav
                className="flex items-center justify-between rounded-2xl shadow-header-mobile lg:shadow-header dark:shadow-none py-3 lg:my-4 lg:px-8 px-4 lg:py-4"
                aria-label="Global"
            >
                <div className="flex z-50">
                    <Image
                        onClick={() => {
                            router.push('/');
                        }}
                        src={isDarkMode ? WhiteMonoLogo : Logo}
                        alt="Kazticket.kz Logo"
                        className="lg:h-8 h-6 w-auto cursor-pointer"
                        priority
                    />
                </div>
                <div className="flex z-50">
                    <div className="hidden lg:flex flex-col pb-6 border-b-2 mr-10 gap-4">
                        <div className="flex justify-between">
                            <div className="flex z-50 gap-10">
                                <a href="tel:+7-708-08-08-999" className="uppercase font-thin flex flex-row gap-2">
                                    <span>кассы</span>
                                    <span>+7-708-08-08-999</span>
                                </a>
                                <a href="tel:+7-708-08-08-999" className="uppercase font-thin flex flex-row gap-2">
                                    <span>астана</span>
                                    <span>+7-708-08-08-999</span>
                                </a>
                                <a href="tel:+7-708-08-08-999" className="uppercase font-thin flex flex-row gap-2">
                                    ОБРАТНАЯ СВЯЗЬ
                                </a>
                            </div>
                            <div className="flex gap-2">
                                {langs.map((lang, i) => {
                                    return (
                                        <>
                                            {i !== 0 && '|'}{' '}
                                            <button
                                                key={lang.key}
                                                onClick={() => handleSelectLang(lang)}
                                                className={`${
                                                    selectedLang?.key === lang.key && 'text-[#006D56]'
                                                } uppercase`}
                                            >
                                                {lang.text}
                                            </button>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                О Дворце
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Афиша
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Услуги
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Билеты
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Президентский оркестр
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Галерея
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Новости
                            </a>
                            <a
                                href="https://www.vk.com"
                                className="uppercase font-thin transition-colors duration-300 hover:text-[#006D56]"
                            >
                                Контакты
                            </a>
                        </div>
                    </div>
                    {/* Для мобилки */}
                    <div className="flex gap-3 lg:hidden z-50">
                        <div className="flex flex-row justify-center ml-2">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                onClick={() => {
                                    window.scrollTo({ top: 0 });
                                    setSearchMenuOpen(true);
                                }}
                            >
                                <span className="sr-only">Open search</span>
                                <MagnifyingGlassIcon
                                    className="h-6 w-6 text-[#2F2F38] dark:text-white"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => {
                                window.scrollTo({ top: 0 });
                                setMobileMenuOpen(true);
                            }}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-4 w-6 text-[#2F2F38] dark:text-white"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_721_30841)">
                                    <path
                                        d="M0 1H16M0 8H8M0 15H16"
                                        stroke="currentColor"
                                        strokeOpacity="0.85"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_721_30841">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>

                            {/* <Bars3Icon className="h-6 w-6" aria-hidden="true" /> */}
                        </button>
                    </div>
                </div>
            </nav>
            <Transition show={isMobileMenuOpen} appear as={Fragment}>
                <Dialog as="div" className="lg:hidden" onClose={() => setMobileMenuOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="top-0 fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex flex-row w-full">
                                <button
                                    type="button"
                                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13.9998 6L8.70696 11.2929C8.31643 11.6834 8.31643 12.3166 8.70696 12.7071L13.9998 18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                                <div className="flex w-full -ml-2.5">
                                    <span className="text-center w-full font-medium dark:text-white">Меню</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-8 py-4">
                                <div className="flex flex-col">
                                    <div className="flex flex-row w-full justify-center">
                                        {langs.map((lang: Dropdown) => (
                                            <div
                                                key={lang.key}
                                                onClick={() => handleSelectLang(lang)}
                                                className={`group cursor-pointer relative flex items-center gap-x-6 rounded-lg p-3 text-sm leading-6 hover:bg-gray-50 dark:text-white ${
                                                    lang.key === selectedLang?.key
                                                        ? 'bg-[#F5F5F5] text-[#0490C3] dark:bg-[#F5F5F5] dark:text-black'
                                                        : ''
                                                }`}
                                            >
                                                <div className="flex-auto">
                                                    <div className="block">
                                                        {lang.text}
                                                        <span className="absolute z-50 inset-0" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-lg font-medium dark:text-white">BOXCENTER.KZ</span>
                                    <nav className="flex flex-col justify-start gap-3">
                                        {pages.map((x) => {
                                            return (
                                                <Link
                                                    href={x.url}
                                                    key={x.url}
                                                    className="text-base leading-6 text-gray-500 hover:text-gray-900 gap-2 dark:text-white flex flex-row items-center"
                                                >
                                                    {x.label}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-lg font-medium dark:text-white">Партнерам/организаторам</span>
                                    <nav className="flex flex-col justify-start gap-3">
                                        <Link
                                            href={'/offer'}
                                            className="text-base leading-6 text-gray-500 hover:text-gray-900 gap-2 dark:text-white flex flex-row items-center"
                                        >
                                            Организаторам
                                        </Link>
                                    </nav>
                                </div>
                                <div className="flex gap-5">
                                    <Link
                                        className="text-black hover:text-gray-500 dark:text-white"
                                        href="https://t.me/kazticketkz"
                                        target="_blank"
                                    >
                                        <span className="sr-only">Telegram</span>
                                        <svg
                                            className="w-6 h-6 text-[#2F2F38] dark:text-white"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clipPath="url(#clip0_213_1734)">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2628 9.3444 8.93014 10.3492 5.43189 11.8733C4.86383 12.0992 4.56626 12.3202 4.53917 12.5363C4.49339 12.9015 4.95071 13.0453 5.57347 13.2411C5.65818 13.2678 5.74595 13.2954 5.83594 13.3246C6.44864 13.5238 7.27283 13.7568 7.70129 13.766C8.08994 13.7744 8.52373 13.6142 9.00264 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.139 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.376 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5033 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78391 14.6448 10.8036 15.3168C11.2936 15.6397 11.6858 15.9067 12.077 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2077 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8307 18.0694 15.3826 18.0186C15.7032 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6631 17.3816 10.0585 17.5622 8.16097C17.578 7.99473 17.5581 7.78197 17.5422 7.68857C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0056 7.22234 16.9064 7.22408C16.455 7.23203 15.7626 7.47282 12.43 8.85893Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_213_1734">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </Link>
                                    <Link
                                        className="text-black hover:text-gray-500 dark:text-white"
                                        href="https://www.instagram.com/kazticket.kz"
                                        target="_blank"
                                    >
                                        <span className="sr-only">Instagram</span>
                                        <svg
                                            className="w-6 h-6 text-[#2F2F38] dark:text-white"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </Link>
                                    <Link
                                        className="text-black hover:text-gray-500 dark:text-white"
                                        href="https://www.tiktok.com/@kazticket.kz"
                                        target="_blank"
                                    >
                                        <span className="sr-only">TikTok</span>
                                        <svg
                                            className="w-6 h-6 text-[#2F2F38] dark:text-white"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
                                            />
                                        </svg>
                                    </Link>
                                    <Link
                                        className="text-black hover:text-gray-500 dark:text-white"
                                        href="https://www.linkedin.com/company/kazticket-kz"
                                        target="_blank"
                                    >
                                        <span className="sr-only">LinkedIn</span>
                                        <svg
                                            className="w-6 h-6 text-[#2F2F38] dark:text-white"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </Link>
                                    <Link
                                        className="text-black hover:text-gray-500 dark:text-white"
                                        href="https://vk.com/kazticketkzz"
                                        target="_blank"
                                    >
                                        <span className="sr-only">ВКонтакте</span>
                                        <svg
                                            className="w-6 h-6 text-[#2F2F38] dark:text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm.25 16.996h-2.134c-1.205 0-1.409-.687-2.401-1.679-.897-.897-1.395-.209-1.374 1.068.006.339-.161.611-.566.611-1.264 0-3.08.178-4.918-1.806-1.883-2.033-3.857-6.111-3.857-6.513 0-.237.196-.344.524-.344h2.17c.574 0 .623.284.783.649.667 1.521 2.265 4.574 2.69 2.87.244-.978.344-3.245-.703-3.44-.594-.11.452-.746 1.968-.746.377 0 .786.041 1.205.137.769.179.771.523.761 1.026-.039 1.903-.269 3.184.233 3.507.479.31 1.739-1.717 2.403-3.281.183-.433.219-.722.734-.722h2.654c1.39 0-.182 1.997-1.383 3.557-.968 1.255-.916 1.28.209 2.324.803.744 1.75 1.76 1.75 2.336.002.272-.21.446-.748.446z" />
                                        </svg>
                                    </Link>
                                </div>
                                <button className="rounded-xl flex items-center justify-center w-full bg-[#0490C3] py-3">
                                    <span className="text-white text-lg">Войти</span>
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            <Transition show={isSearchMenuOpen} appear as={Fragment}>
                <Dialog as="div" className="lg:hidden" onClose={() => setMobileMenuOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="top-0 fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-black px-4 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex flex-row w-full">
                                <SearchBox locale={locale} cities={cities} />
                                <button
                                    type="button"
                                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                    onClick={() => setSearchMenuOpen(false)}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* <PushNotificationRequest /> */}
        </header>
    );
};

export default Header;
