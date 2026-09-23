import React from 'react';
import { Header } from './Header';
import { HeroSlider } from './HeroSlider';
import { NoticeTicker } from './NoticeTicker';
import { QuickActions } from './QuickActions';
import { NoticeBoard } from './NoticeBoard';
import { LeadershipMessages } from './LeadershipMessages';
import { TeachersSection } from './TeachersSection';
import { AboutSection } from './AboutSection';
import { AcademicPrograms } from './AcademicPrograms';
import { SchoolStats } from './SchoolStats';
import { ResultsTrend } from './ResultsTrend';
import { NewsSection } from './NewsSection';
import { EventsSection } from './EventsSection';
import { AchievementsSection } from './AchievementsSection';
import { GallerySection } from './GallerySection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { AdmissionModal } from './AdmissionModal';

export const FrontendView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-800 flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-900">
      <Header />
      <HeroSlider />
      <NoticeTicker />
      <QuickActions />
      <NoticeBoard />
      <LeadershipMessages />
      <TeachersSection />
      <AboutSection />
      <AcademicPrograms />
      <SchoolStats />
      <ResultsTrend />
      <NewsSection />
      <EventsSection />
      <AchievementsSection />
      <GallerySection />
      <ContactSection />
      <Footer />
      <AdmissionModal />
    </div>
  );
};
