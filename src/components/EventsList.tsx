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
    const [itemsPerPage, setItemsPerPage] = useState(1);

    const totalItems = events.length;

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalItems - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === totalItems - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        if (sliderRef.current) {
            const itemWidth = sliderRef.current.clientWidth / itemsPerPage;
            const shift = currentIndex * itemWidth;
            sliderRef.current.style.transform = `translateX(-${shift}px)`;
        }
    }, [currentIndex, itemsPerPage]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setItemsPerPage(1);
            } else if (window.innerWidth <= 720) {
                setItemsPerPage(2);
            } else if (window.innerWidth <= 1024) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(4);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Для начальной установки значения

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="my-20 relative container z-40 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold uppercase text-[#007566]">ПОПУЛЯРНЫЕ МЕРОПРИЯТИЯ</h2>
                <div className="flex gap-2">
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
                <div ref={sliderRef} className="flex transition-transform duration-500 ease-in-out">
                    {events.map((event, index) => (
                        <div key={index} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerPage}%` }}>
                            <div className="flex flex-col justify-between h-full">
                                <div className="relative">
                                    <div className="aspect-[9/16]">
                                        <img
                                            alt={event.text}
                                            src={event.src.src}
                                            className="w-full h-full object-cover shadow-lg cursor-pointer"
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gray-600 flex items-center justify-center text-white">
                                        {event.minAge}+
                                    </div>
                                </div>
                                <div className="text-center text-sm text-[#006D56]">{event.text}</div>
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
                                <a href={'/e/' + event.id} className="bg-[#006D56] flex justify-center">
                                    <button className="text-white">Купить билет</button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsList;
