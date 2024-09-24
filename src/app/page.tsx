'use server';

import EventsList from '@/components/EventsList';
import PageLayout from '@/components/PageLayout';
import PhotoGallery from '@/components/PhotoReport';
import SiteGallery from '@/components/SiteGallery';
// import Posters from '@/components/Posters';

type Props = {
    params: { code: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
    return (
        <PageLayout>
            <EventsList />
            <PhotoGallery />
            <SiteGallery />
        </PageLayout>
    );
}
