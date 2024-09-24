'use client';

import { useEffect, useRef, useState } from 'react';

import eventPoster1 from '../assets/events/1.png';
import eventPoster2 from '../assets/events/2.png';
import eventPoster3 from '../assets/events/3.png';
import eventPoster4 from '../assets/events/4.png';

const events = [
    { id: 1, text: 'СЕРГЕЙ ЛАЗАРЕВ', src: eventPoster4, date: '6 октября | 19:00', minAge: 16 },
    { id: 2, text: 'КОНЦЕРТ АЛЕКСАНДРА ПАНАЙОТОВА', src: eventPoster3, date: '12 октября | 19:00', minAge: 6 },
    { id: 3, text: 'EMIN', src: eventPoster2, date: '17 ноября | 19:00', minAge: 6 },
    { id: 4, text: 'КОНЦЕРТ БАЛЕТА АЛЛЫ ДУХОВОЙ TODES', src: eventPoster1, date: '21 ноября | 19:00', minAge: 6 },
];

const EventsList = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const totalItems = events.length;

    // Определяем количество элементов на странице в зависимости от экрана
    const getItemsPerPage = () => {
        if (window.innerWidth >= 1024) return 4; // Десктопы
        if (window.innerWidth >= 768) return 3; // Планшеты и маленькие ноутбуки
        return 1; // Мобильные устройства
    };

    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

    const handleResize = () => {
        setItemsPerPage(getItemsPerPage());
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalItems - itemsPerPage : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === totalItems - itemsPerPage ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${(currentIndex / itemsPerPage) * 100}%)`;
        }

        // Добавляем слушателя для изменения размера экрана
        window.addEventListener('resize', handleResize);

        // Убираем слушателя при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentIndex, itemsPerPage]);

    return (
        <div className="my-20 relative container z-40 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold uppercase text-[#007566]">ПОПУЛЯРНЫЕ МЕРОПРИЯТИЯ</h2>
                <div className="hidden sm:flex gap-2">
                    {' '}
                    {/* Кнопки только для больших экранов */}
                    <button onClick={handlePrev}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="20,0 0,15 20,30" fill="#007566" />
                        </svg>
                    </button>
                    <button onClick={handleNext}>
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="rotate-180"
                        >
                            <polygon points="20,0 0,15 20,30" fill="#007566" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden w-full">
                <div
                    ref={sliderRef}
                    className="flex sm:flex-row flex-col sm:overflow-hidden transition-transform duration-500 ease-in-out"
                >
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full sm:w-[calc(33.33%_-_16px)] flex flex-col gap-6 mx-2 mb-4 h-full"
                        >
                            <div className="relative">
                                <img
                                    alt={event.text}
                                    src={event.src.src}
                                    className="w-full h-[52.5vh] object-cover shadow-lg"
                                />
                                <div className="absolute top-0 right-0 w-8 h-8 bg-gray-600 flex items-center justify-center text-white">
                                    {event.minAge}+
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="text-center text-sm text-[#006D56] mb-auto">{event.text}</div>
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
                                    <span className="font-semibold">{event.date}</span>
                                </div>
                                <div className="mt-auto">
                                    <a href={'/e/' + event.id} className="bg-[#006D56] flex justify-center">
                                        <button className="bg-[#006D56] text-white w-full py-2">Купить</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsList;
