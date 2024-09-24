import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import fb from '../assets/footer/fb.png';
import inst from '../assets/footer/inst.png';
import vk from '../assets/footer/vk.png';
import logo from '../assets/logo.png';

interface FooterProps {
    locale: any;
    pages: any[];
}

const Footer = ({ pages, locale }: FooterProps) => {
    return (
        <footer id="footer" className="bg-[#001B15] shadow-footer mt-2 text-white py-20">
            <div className="mx-auto w-3/4 flex flex-col gap-6">
                <div className="grid grid-cols-4">
                    <div className="flex flex-col gap-6">
                        <img className="pr-12" src={logo.src} alt="logo" />
                        <div className="flex flex-row gap-6">
                            <a href="https://www.vk.com" target="_blank">
                                <img src={vk.src} alt="vk" />
                            </a>
                            <a href="https://www.instagram.com/" target="_blank">
                                <img src={inst.src} alt="inst" />
                            </a>
                            <a href="https://www.facebook.com" target="_blank">
                                <img src={fb.src} alt="fb" />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <a className="w-fit" href="">
                            О центре бокса
                        </a>
                        <a className="w-fit" href="">
                            Схема залов
                        </a>
                        <a className="w-fit" href="">
                            Руководства
                        </a>
                        <a className="w-fit" href="">
                            Правила посещения
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <a className="w-fit" href="">
                            Афиша
                        </a>
                        <a className="w-fit" href="">
                            Как вернуть билет
                        </a>
                        <a className="w-fit" href="">
                            Контакты
                        </a>
                        <a className="w-fit" href="">
                            Галерея
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <a className="w-fit" href="">
                            Усулги
                        </a>
                        <a className="w-fit" href="">
                            Гардероб
                        </a>
                        <a className="w-fit" href="">
                            Кафе "Что-то там"
                        </a>
                    </div>
                </div>
                <div className="bg-[#006D56] h-0.5" />
                <div className="grid grid-cols-[75%_25%]">
                    <div className="text-base text-white flex flex-col">
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
                        <a className="text-white" href="email:example@gmail.com">
                            example@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
