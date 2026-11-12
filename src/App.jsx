import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Header, MobileMenu } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingSocial, MobileBar, OffersTab } from './components/Floating';
import { OffersPanel } from './components/OffersPanel';
import { ServiceDetail } from './components/ServiceDetail';
import { BookingModal } from './components/BookingModal';
import { AskModal } from './components/AskModal';
import { UIProvider, useUI } from './context/UIContext';
import { useReveal } from './hooks/useReveal';
import { usePageMeta } from './hooks/usePageMeta';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Bridal from './pages/Bridal';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  const { closeMenu } = useUI();
  useEffect(() => {
    closeMenu();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
}

// /book: the home page with the booking form open (the link for the Book button on Google Business).
// /book?service=<id> preselects a service. Closing the form leaves the visitor on the home page.
function BookPage() {
  const { booking, openBooking } = useUI();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const asked = useRef(false);
  const [wasOpen, setWasOpen] = useState(false);
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    const svc = params.get('service');
    openBooking(svc ? { ids: [svc] } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (booking) setWasOpen(true);
    else if (wasOpen) navigate('/', { replace: true });
  }, [booking, wasOpen, navigate]);
  return <Home />;
}

function Shell() {
  useReveal();
  usePageMeta();
  const { pathname } = useLocation();
  const firstPath = useRef(pathname); // the page that was loaded (prerendered) has no fade
  const moved = useRef(false);
  if (pathname !== firstPath.current) moved.current = true;
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Header />
      <MobileMenu />
      <main id="main">
        <div key={pathname} className={moved.current ? 'page-enter' : undefined}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Catalogue key="services" mode="services" />} />
          <Route path="/hair" element={<Catalogue key="hair" mode="hair" />} />
          <Route path="/beauty" element={<Catalogue key="beauty" mode="beauty" />} />
          <Route path="/bridal" element={<Bridal />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </main>
      <Footer />
      <FloatingSocial />
      <OffersTab />
      <OffersPanel />
      <MobileBar />
      <ServiceDetail />
      <BookingModal />
      <AskModal />
    </>
  );
}

export default function App() {
  return (
    <UIProvider>
      <Shell />
    </UIProvider>
  );
}
