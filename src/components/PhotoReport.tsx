'use client';

import { useEffect, useRef, useState } from 'react';

import reportPhoto1 from '../assets/photo_report/1.png';
import reportPhoto2 from '../assets/photo_report/2.png';
import reportPhoto3 from '../assets/photo_report/3.png';
import reportPhoto4 from '../assets/photo_report/4.png';

const photoReportImages = [
    { text: 'Ночь пожирателей рекламы 2024', src: reportPhoto1 },
    { text: 'Концерт Зара', src: reportPhoto2 },
    { text: 'Главная ёлка страны «Машина новогоднего времени»', src: reportPhoto3 },
    { text: 'Песня года 2023', src: reportPhoto4 },
    { text: 'Ещё что-то там', src: reportPhoto2 },
    { text: 'Пример', src: reportPhoto1 },
    { text: 'Ещё пример', src: reportPhoto3 },
];

const PhotoGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Для хранения выбранного изображения
    const sliderRef = useRef<HTMLDivElement>(null);

    const totalItems = photoReportImages.length;
    const itemsPerPage = 4;

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
    }, [currentIndex]);

    // Функция для открытия модального окна
    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    // Функция для закрытия модального окна
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="bg-[#001B15] py-6 -mx-4">
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
                        {photoReportImages.map((photoReportImage, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[calc(25%_-_16px)] flex flex-col items-center gap-2 mx-2"
                            >
                                <img
                                    alt={photoReportImage.text}
                                    src={photoReportImage.src.src}
                                    className="w-full h-[25vh] object-cover rounded-lg shadow-lg cursor-pointer"
                                    onClick={() => handleImageClick(photoReportImage.src.src)} // Открытие модального окна при клике
                                />
                                <div className="text-center text-[#006D56]">{photoReportImage.text}</div>
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

export default PhotoGallery;
