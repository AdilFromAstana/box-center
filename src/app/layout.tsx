import { Metadata, Viewport } from 'next';

import './globals.css';
import '../assets/fonts/Gilroy/stylesheet.css';

import { Rubik } from 'next/font/google';
// import Script from 'next/script';
import { Suspense } from 'react';

import { MetaScriptEvents } from '@/components/MetaScriptEvents';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://kazticket.kz'),
    title: `Boxcenter.kz - Билеты на концерты и мероприятия онлайн: Покупайте билеты с уверенностью`,
    description: `Boxcenter.kz - Система онлайн покупки билетов. Купить билеты, концерт, мероприятия`,
    alternates: {
        canonical: '/',
    },
    openGraph: {
        images: '/metadata-image.svg',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html className="h-full dark:bg-black" lang="en">
            <head>
                {/* <Script
                    id="Metrika"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function (m, e, t, r, i, k, a) {
                            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
                            m[i].l = 1 * new Date();
                            for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
                            k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
                        })
                        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                        ym(91698739, "init", {
                            clickmap: true,
                            trackLinks: true,
                            accurateTrackBounce: true,
                            webvisor: true
                        });
                        `,
                    }}
                />
                <noscript>
                    <div>
                        <img
                            src="https://mc.yandex.ru/watch/91698739"
                            style={{ position: 'absolute', left: '-9999px' }}
                            alt=""
                        />
                    </div>
                </noscript> */}
            </head>
            <body className={rubik.className + ' dark:bg-black'}>
                {children}
                <Suspense fallback={null}>
                    <MetaScriptEvents />
                </Suspense>
            </body>
        </html>
    );
}
