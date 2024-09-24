'use server';

import EventsList from '@/components/EventsList';
import PageLayout from '@/components/PageLayout';
import PhotoGallery from '@/components/PhotoReport';
import SiteGallery from '@/components/SiteGallery';

export default async function Home() {
    return (
        <PageLayout>
            <EventsList />
            <PhotoGallery />
            <SiteGallery />
        </PageLayout>
    );
}
