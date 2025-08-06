import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Icon Components (unchanged) ---
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const InstagramIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4.1C5.6 4.1 4.1 5.6 4.1 7.6V16.4C4.1 18.4 5.6 19.9 7.6 19.9H16.4C18.4 19.9 19.9 18.4 19.9 16.4V7.6C19.9 5.6 18.4 4.1 16.4 4.1H7.6ZM12 7.3C14.6 7.3 16.7 9.4 16.7 12C16.7 14.6 14.6 16.7 12 16.7C9.4 16.7 7.3 14.6 7.3 12C7.3 9.4 9.4 7.3 12 7.3ZM12 9.1C10.4 9.1 9.1 10.4 9.1 12C9.1 13.6 10.4 14.9 12 14.9C13.6 14.9 14.9 13.6 14.9 12C14.9 10.4 13.6 9.1 12 9.1ZM16.9 6.1C17.4 6.1 17.9 6.5 17.9 7C17.9 7.5 17.4 7.9 16.9 7.9C16.4 7.9 16 7.5 16 7C16 6.5 16.4 6.1 16.9 6.1Z" fill="currentColor"/></svg>;
const TwitterIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.46,6.52c-0.74,0.33-1.54,0.55-2.38,0.65c0.85-0.51,1.5-1.32,1.81-2.3c-0.8,0.47-1.68,0.82-2.61,1 c-0.75-0.8-1.82-1.3-3-1.3c-2.28,0-4.12,1.85-4.12,4.12c0,0.32,0.04,0.64,0.11,0.94C8.72,9.41,5.66,7.74,3.6,5.26 C3.25,5.88,3.06,6.6,3.06,7.38c0,1.43,0.73,2.69,1.82,3.43c-0.68-0.02-1.32-0.21-1.88-0.52v0.05c0,2,1.42,3.66,3.3,4.04 c-0.34,0.09-0.71,0.14-1.08,0.14c-0.26,0-0.52-0.03-0.77-0.07c0.52,1.64,2.04,2.83,3.83,2.86c-1.41,1.1-3.19,1.76-5.12,1.76 c-0.33,0-0.66-0.02-0.98-0.06C3.49,20.94,5.59,21.5,7.84,21.5c7.79,0,12.05-6.46,12.05-12.05c0-0.18,0-0.37-0.01-0.55 C21.25,8.08,21.92,7.36,22.46,6.52z" fill="currentColor"/></svg>;
const DribbbleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M17.45,15.43c-0.12,0.07-0.25,0.11-0.39,0.11 c-0.39,0-0.75-0.23-0.91-0.59c-0.31-0.7-0.77-1.32-1.37-1.85c-0.6-0.53-1.3-0.95-2.1-1.25c-1.82-0.68-3.84-0.4-5.43,0.76 c-0.01,0.01-0.02,0.01-0.03,0.02c-0.29,0.22-0.68,0.28-1.03,0.15c-0.35-0.13-0.6-0.45-0.65-0.81c-0.07-0.49,0.18-0.96,0.61-1.19 c2.2-1.19,4.73-1.5,7.09-0.82c1.04,0.3,1.98,0.82,2.79,1.52c0.7,0.61,1.25,1.38,1.62,2.25C18.1,14.71,17.91,15.22,17.45,15.43z M19.93,11.23c-0.23-0.05-0.47,0.03-0.63,0.2c-0.16,0.17-0.23,0.4-0.19,0.63c0.19,1.15,0.03,2.33-0.47,3.4 c-0.5,1.07-1.29,1.98-2.3,2.62c-0.27,0.17-0.4,0.5-0.34,0.81c0.06,0.31,0.29,0.57,0.6,0.67c0.09,0.03,0.18,0.04,0.27,0.04 c0.24,0,0.48-0.1,0.66-0.29c1.23-0.78,2.2-1.88,2.83-3.18C20.57,14.28,20.76,12.73,19.93,11.23z M8.3,6.58 c1.28-0.28,2.59-0.1,3.77,0.52c0.33,0.17,0.73,0.11,1-0.14s0.4-0.67,0.23-1c-1.48-0.76-3.14-1-4.78-0.62 c-0.37,0.09-0.65,0.39-0.72,0.76C7.72,6.46,8,6.67,8.3,6.58z" fill="currentColor"/></svg>;

// --- Components ---

const Header = ({ navigate }: { navigate: (path: string) => void }) => (
  <header className="w-full flex justify-center px-4">
    <div 
      className="bg-[#ECECEC] rounded-[30px] flex items-center justify-between w-full max-w-6xl"
      style={{
        minHeight: '60px',
        marginTop: '20px',
        padding: '16px 20px',
        gap: '10px'
      }}
    >
      <div className="font-bold text-xl md:text-2xl font-manrope">Cudliy.</div>
      <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-gray-800 font-semibold font-manrope">
        <a href="#" className="hover:text-black">Home</a>
        <div className="flex items-center gap-2 cursor-pointer hover:text-black">
          <span>Resources</span>
          <ChevronDownIcon />
        </div>
        <a href="#" className="hover:text-black">Contact</a>
      </nav>
      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={() => navigate('/signin')} className="font-semibold text-gray-800 hover:text-black font-manrope text-sm md:text-base">
          Login
        </button>
        <button onClick={() => navigate('/signup')} className="bg-black text-white px-3 md:px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors font-manrope text-sm md:text-base">
          Sign up
        </button>
      </div>
    </div>
  </header>
);

const HeroSection = ({ navigate }: { navigate: (path: string) => void }) => (
  <section className="w-full max-w-7xl mx-auto py-10 md:py-20 px-4 md:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
    <div className="flex-1 text-center lg:text-left">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight font-nohemi max-w-2xl mx-auto lg:mx-0">
        Create Your Own Toy <br /> with Just a Prompt
      </h1>
      <p className="mt-4 md:mt-6 text-lg md:text-xl text-[#000000] max-w-md mx-auto lg:mx-0 font-nohemi">
        Cudily turns your words into custom 3D toy designs using AI magic. Preview it. Print it. Play with it.
      </p>
      <button
        onClick={() => navigate('/signup')}
        className="mt-8 md:mt-14 w-full md:w-auto px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors font-manrope"
      >
        Start Creating Your Toy
      </button>
    </div>
    <div className="flex-1 w-full max-w-md lg:max-w-none">
      <div className="w-full h-64 md:h-96 lg:h-[583px] bg-gray-100 rounded-3xl">
        {/* Placeholder for 3D model/image */}
      </div>
    </div>
  </section>
);

// --- MODIFIED SECTION ---
const PossibilitiesSection = () => {

      const categories = [
  
          { icon: '/ic1.png', name: 'Superhero' },
           { icon: '/ic2.png', name: 'Colored Race Car' },
           { icon: '/ic3.png', name: 'Fantasy Friends' },
           { icon: '/ic4.png', name: 'Teddy Bear' },
           { icon: '/ic5.png', name: 'Techy Toys' },
           { icon: '/ic6.png', name: 'Birthday Cake' },
           { icon: '/ic7.png', name: 'Skateboarding Panda' },
  
      ];
    // Duplicate the array for a seamless, infinite scroll effect
    const scrollingCategories = [...categories, ...categories];

    return (
        <section className="w-full max-w-7xl mx-auto py-10 md:py-20 px-4 md:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            <div className="flex items-center justify-center order-2 lg:order-1">
                {/* This container creates the viewport for the scrolling animation and the fade effect */}
                <div 
                    className="relative overflow-hidden"
                    style={{
                        width: '280px',
                        height: '250px',
                        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                    }}
                >
                    {/* This div contains the duplicated list and has the animation applied */}
                    <div className="flex flex-col animate-scroll-y" style={{ gap: '15px' }}>
                        {scrollingCategories.map((cat, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <img 
                                    src={cat.icon} 
                                    alt={cat.name} 
                                    className="object-contain" 
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        transform: 'translateZ(0)',
                                        backfaceVisibility: 'hidden',
                                        imageRendering: 'crisp-edges'
                                    }}
                                />
                                <span 
                                    className="whitespace-nowrap category-text"
                                    style={{
                                        fontFamily: 'Helvetica Neue',
                                        fontStyle: 'normal',
                                        fontSize: '24px',
                                        lineHeight: '100%',
                                        letterSpacing: '0%',
                                        textAlign: 'center'
                                    }}
                                >
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col items-center justify-center text-center lg:ml-16">
                <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-black leading-tight font-nohemi">
                    Endless Possibilities. <br /> One Imagination. Yours.
                </h2>
                <p className="mt-4 text-lg md:text-xl text-[#898989] max-w-sm font-nohemi">
                    Don't know where to start? Get inspired by our most-loved creations!
                </p>
            </div>
        </section>
    );
};
// --- END OF MODIFIED SECTION ---


const HowItWorksSection = () => {
    const cards = [
        { title: 'Limitless Creativity', description: 'No more one-size-fits-all toys.' },
        { title: 'AI-Powered Creativity', description: 'Turn imagination into tangible play.' },
        { title: 'Kid-Friendly', description: 'Designed for parents, educators, and kids.' },
    ];

    return (
        <section className="w-full bg-[#F9F9F9] py-10 md:py-20">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-8 md:mb-12 font-nohemi">How it works</h2>
                <div className="relative flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-sm md:w-96">
                            <h3 className="text-xl md:text-2xl font-bold text-black font-nohemi">{card.title}</h3>
                            <p className="mt-2 text-gray-600 font-manrope">{card.description}</p>
                            <div className="mt-6 w-full h-40 md:h-56 bg-gray-100 rounded-2xl">
                                {/* Placeholder */}
                            </div>
                        </div>
                    ))}
                     <button className="hidden md:flex absolute right-[-50px] bg-white rounded-full w-14 h-14 items-center justify-center shadow-md text-gray-600 hover:text-black">
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </section>
    );
};

const FAQSection = () => {
    const faqs = [
        'What exactly is Cudily?',
        'Do I need any design skills to use Cudily?',
        'What kind of toys can I create?',
        'How does the printing and delivery work?',
        'Is Cudily safe for kids?',
        'Can I save or share my toy designs?',
    ];

    return (
        <section className="w-full max-w-3xl mx-auto py-10 md:py-20 px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-8 md:mb-12 font-nohemi">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-center cursor-pointer">
                            <p className="text-base md:text-lg font-medium text-gray-800 font-manrope pr-4">{faq}</p>
                            <PlusIcon />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="w-full bg-white pt-10 md:pt-20 pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-8 gap-4 md:gap-0">
                 <div className="font-bold text-xl md:text-2xl font-manrope">Cudliy.</div>
                 <div className="flex items-center gap-4 md:gap-6 text-gray-500">
                    <a href="#" className="hover:text-black"><InstagramIcon /></a>
                    <a href="#" className="hover:text-black"><TwitterIcon /></a>
                    <a href="#" className="hover:text-black"><DribbbleIcon /></a>
                 </div>
                 <a href="mailto:Hello@CudilyCom" className="font-semibold text-gray-800 hover:text-black font-manrope text-sm md:text-base">
                    Hello@Cudily.Com
                 </a>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-gray-500 font-manrope gap-4 md:gap-0">
                <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} Cudily. All rights reserved.</p>
                <div className="flex gap-4 md:gap-6">
                    <a href="#" className="hover:text-black text-sm md:text-base">Privacy Policy</a>
                    <a href="#" className="hover:text-black text-sm md:text-base">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);


// --- Main Landing Page Component ---

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
          /* Assuming Nohemi is a custom font, fallback to sans-serif */
          @font-face {
            font-family: 'Nohemi';
            src: url('/fonts/Nohemi-VF.ttf') format('truetype');
            font-weight: 100 900;
            font-style: normal;
          }
          .font-nohemi { font-family: 'Nohemi', sans-serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }

          /* Animation for the scrolling possibilities section */
          @keyframes scroll-y {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .animate-scroll-y {
            animation: scroll-y 30s linear infinite;
            will-change: transform;
          }
          
          .animate-scroll-y:hover {
            animation-play-state: paused;
          }
          
          /* Dynamic font weight and opacity for category text based on position */
          .category-text {
            font-weight: 500;
            opacity: 1;
            transition: all 0.3s ease;
          }
          
          /* Text in the center/focus area gets bold and full opacity */
          .animate-scroll-y > div:nth-child(4) .category-text,
          .animate-scroll-y > div:nth-child(11) .category-text {
            font-weight: 500;
            opacity: 1;
          }
          
          /* Text entering from below (fading in) */
          .animate-scroll-y > div:nth-child(5) .category-text,
          .animate-scroll-y > div:nth-child(6) .category-text,
          .animate-scroll-y > div:nth-child(7) .category-text,
          .animate-scroll-y > div:nth-child(12) .category-text,
          .animate-scroll-y > div:nth-child(13) .category-text,
          .animate-scroll-y > div:nth-child(14) .category-text {
            font-weight: 300;
            opacity: 0.3;
          }
          
          /* Text leaving from above (fading out) */
          .animate-scroll-y > div:nth-child(1) .category-text,
          .animate-scroll-y > div:nth-child(2) .category-text,
          .animate-scroll-y > div:nth-child(3) .category-text,
          .animate-scroll-y > div:nth-child(8) .category-text,
          .animate-scroll-y > div:nth-child(9) .category-text,
          .animate-scroll-y > div:nth-child(10) .category-text {
            font-weight: 300;
            opacity: 0.3;
          }
          
          /* Reflection effect for icons */
          .icon-reflection {
            position: relative;
            overflow: visible;
          }
          
          .icon-reflection::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            height: 100%;
            background: inherit;
            transform: scaleY(-1);
            opacity: 0.3;
            filter: blur(1px) brightness(0.8);
            pointer-events: none;
            z-index: 1;
          }
        `}
      </style>
      
      <Header navigate={navigate} />
      <main>
        <HeroSection navigate={navigate} />
        <PossibilitiesSection />
        <HowItWorksSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};
export default LandingPage;