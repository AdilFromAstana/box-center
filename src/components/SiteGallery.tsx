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
    const [itemsPerPage, setItemsPerPage] = useState(4); // Отвечает за количество видимых изображений
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const totalItems = siteGalleryImages.length;

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalItems - itemsPerPage : prevIndex - itemsPerPage));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === totalItems - itemsPerPage ? 0 : prevIndex + itemsPerPage));
    };

    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width <= 640) {
                setItemsPerPage(1); // На мобильных 1 изображение
            } else if (width <= 1024) {
                setItemsPerPage(2); // На экранах до 1024px - 2 изображения
            } else if (width <= 1280) {
                setItemsPerPage(3); // До 1280px - 3 изображения
            } else {
                setItemsPerPage(4); // Больше 1280px - 4 изображения
            }
        };

        updateItemsPerPage(); // Вызов при монтировании компонента
        window.addEventListener('resize', updateItemsPerPage); // Обновление при изменении размера окна

        return () => {
            window.removeEventListener('resize', updateItemsPerPage); // Очистка слушателя при размонтировании
        };
    }, []);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${(currentIndex / totalItems) * 100}%)`;
        }
    }, [currentIndex, itemsPerPage]);

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="my-20 relative container z-40 mx-auto">
            <div className="flex items-center mb-4">
                <div className="w-16 h-1 bg-[#006D56] mr-2"></div>
                <h2 className="text-xl font-semibold text-[#7F7F7F]">Галерея</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-[#006D56]">ГАЛЕРЕЯ ПЛОЩАДКИ</h2>
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
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ width: `${(totalItems / itemsPerPage) * 100}%` }}
                >
                    {siteGalleryImages.map((siteGalleryImage, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-center gap-2 mx-2"
                        >
                            <img
                                alt={siteGalleryImage.text}
                                src={siteGalleryImage.src.src}
                                className="w-full h-[25vh] object-cover rounded-lg shadow-lg cursor-pointer"
                                onClick={() => handleImageClick(siteGalleryImage.src.src)}
                            />
                            <div className="text-center text-[#006D56]">{siteGalleryImage.text}</div>
                        </div>
                    ))}
                </div>
            </div>

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
