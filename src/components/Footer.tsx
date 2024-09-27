import dayjs from 'dayjs';
import React from 'react';

import fb from '../assets/footer/fb.png';
import inst from '../assets/footer/inst.png';
import vk from '../assets/footer/vk.png';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer id="footer" className="bg-[#001B15] shadow-footer mt-2 text-white py-10 md:py-20">
            <div className="mx-auto w-11/12 md:w-3/4 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
                    <div className="flex flex-col gap-6">
                        <img className="pr-0 md:pr-12 max-w-[120px] md:max-w-full" src={logo.src} alt="logo" />
                        <div className="flex flex-row gap-4 md:gap-6">
                            <a href="https://www.vk.com" target="_blank">
                                <img src={vk.src} alt="vk" className="w-6 h-6 md:w-auto md:h-auto" />
                            </a>
                            <a href="https://www.instagram.com/" target="_blank">
                                <img src={inst.src} alt="inst" className="w-6 h-6 md:w-auto md:h-auto" />
                            </a>
                            <a href="https://www.facebook.com" target="_blank">
                                <img src={fb.src} alt="fb" className="w-6 h-6 md:w-auto md:h-auto" />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <a className="w-fit" href="https://www.instagram.com/">
                            О центре бокса
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Схема залов
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Руководства
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Правила посещения
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <a className="w-fit" href="https://www.instagram.com/">
                            Афиша
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Как вернуть билет
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Контакты
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Галерея
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <a className="w-fit" href="https://www.instagram.com/">
                            Усулги
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Гардероб
                        </a>
                        <a className="w-fit" href="https://www.instagram.com/">
                            Кафе "Что-то там"
                        </a>
                    </div>
                </div>
                <div className="bg-[#006D56] h-0.5" />
                <div className="grid grid-cols-1 md:grid-cols-[75%_25%] gap-4 md:gap-0">
                    <div className="text-sm md:text-base text-white flex flex-col">
                        <span>© {dayjs().format('YYYY')} Государственное учреждение "ЦЕНТР БОКСА им.С.Сапиева"</span>
                        <span>Стадион, арена или спортивный комплекс</span>
                        <span>Концертная и спортивная площадка</span>
                        <span>📍г.Караганда». Все права защищены.</span>
                    </div>
                    <div className="flex flex-col">
                        <a className="text-white" href="tel:+7-776-777-76-76">
                            +7-776-777-76-76
                        </a>
                        <a className="text-white" href="tel:+7-776-777-76-76">
                            +7-776-777-76-76
                        </a>
                        <a className="text-white" href="mailto:example@gmail.com">
                            example@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
