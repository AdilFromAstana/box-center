'use client';

import { useEffect, useRef, useState } from 'react';

import siteGalleryPhoto1 from '../assets/site_gallery/1.png';
import siteGalleryPhoto2 from '../assets/site_gallery/2.png';
import siteGalleryPhoto3 from '../assets/site_gallery/3.png';
import siteGalleryPhoto4 from '../assets/site_gallery/4.png';

const siteGalleryImages = [
    { text: 'Зал приемов', src: siteGalleryPhoto3 },
    { text: 'Конференц-зал', src: siteGalleryPhoto1 },
    { text: 'Пресс-центр', src: siteGalleryPhoto2 },
    { text: 'Зал приемов', src: siteGalleryPhoto3 },
    { text: 'Фойе Малого зала', src: siteGalleryPhoto4 },
    { text: 'Зал приемов', src: siteGalleryPhoto3 },
];

const SiteGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const sliderRef = useRef<HTMLDivElement>(null);

    const totalItems = siteGalleryImages.length;

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
            } else if (window.innerWidth <= 1024) {
                setItemsPerPage(2);
            } else if (window.innerWidth <= 1280) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(4);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="lg:py-6 py-2 -mx-4 px-4">
            <div className="my-20 relative container z-40 mx-auto">
                <div className="flex items-center mb-4">
                    <div className="w-16 h-1 bg-[#006D56] mr-2"></div>
                    <h2 className="text-xl font-semibold text-[#7F7F7F]">Галерея</h2>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-[#006D56]">ФОТООТЧЕТ</h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrev}>
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
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
                        {siteGalleryImages.map((photoReportImage, index) => (
                            <div key={index} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerPage}%` }}>
                                <div className="relative w-full" style={{ paddingBottom: '65.25%' }}>
                                    <img
                                        alt={photoReportImage.text}
                                        src={photoReportImage.src.src}
                                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
                                        onClick={() => handleImageClick(photoReportImage.src.src)}
                                    />
                                </div>
                                <div className="text-center text-[#006D56] mt-2">{photoReportImage.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Модальное окно для просмотра изображения */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={handleCloseModal}
                >
                    <div className="relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-white text-3xl font-bold"
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Просмотр изображения"
                            className="max-w-full max-h-full rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteGallery;
