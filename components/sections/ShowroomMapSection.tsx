'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SimonaIconPin, SimonaIconClock, SimonaIconPhoneSolid } from '@/components/brand/SimonaIcons';
import { ExternalLink, Navigation } from 'lucide-react';

interface ShowroomPoint {
  id: string;
  name: string;
  badge: string;
  address: string;
  coords: [number, number];
  phone: string;
  phoneRaw: string;
  schedule: string;
  description: string;
  yandexMapsUrl: string;
}

// Exact entrance coordinates along the building on Belinskogo
const SHOWROOMS: ShowroomPoint[] = [
  {
    id: 'belinskogo-15',
    name: 'Флагманский салон «СИМОНА»',
    badge: 'Крупная и малая встройка · Активная кухня',
    address: 'г. Нижний Новгород, ул. Белинского, 15',
    coords: [56.310885, 44.001533],
    phone: '(831) 423 76 00',
    phoneRaw: '+78314237600',
    schedule: 'Ежедневно с 10:00 до 20:00',
    description: 'Бренд-зоны Miele, ASKO, Liebherr, SMEG, VARD. Действующая «Активная кухня».',
    yandexMapsUrl: 'https://yandex.ru/maps/-/CTh94C5D',
  },
  {
    id: 'belinskogo-11',
    name: 'Фирменный салон OMOIKIRI & KÖRTING',
    badge: 'Мойки, смесители · Встраиваемая техника',
    address: 'г. Нижний Новгород, ул. Белинского, 11/66',
    coords: [56.310652, 44.000850],
    phone: '+7 (920) 005 76 82',
    phoneRaw: '+79200057682',
    schedule: 'Ежедневно с 10:00 до 20:00',
    description: 'Японские мойки и смесители OMOIKIRI, измельчители отходов, встройка KÖRTING.',
    yandexMapsUrl: 'https://yandex.ru/maps/?rtext=~56.310652,44.000850',
  },
];

// Center point of the building complex along Belinskogo
const BUILDING_CENTER: [number, number] = [56.310769, 44.001192];

export function ShowroomMapSection() {
  const [activeId, setActiveId] = useState<string>('belinskogo-15');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const singlePlacemarkRef = useRef<any>(null);
  const currentCoordsRef = useRef<[number, number]>(SHOWROOMS[0].coords);
  const animationFrameRef = useRef<number | null>(null);

  const activeShowroom = SHOWROOMS.find((s) => s.id === activeId) || SHOWROOMS[0];

  useEffect(() => {
    let isCancelled = false;

    // Load Yandex Maps API 2.1 script dynamically if not present
    const loadYandexMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if (typeof window === 'undefined') return;
        if ((window as any).ymaps) {
          (window as any).ymaps.ready(() => resolve());
          return;
        }

        const existingScript = document.getElementById('yandex-maps-script');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            (window as any).ymaps.ready(() => resolve());
          });
          return;
        }

        const script = document.createElement('script');
        script.id = 'yandex-maps-script';
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.type = 'text/javascript';
        script.onload = () => {
          (window as any).ymaps.ready(() => resolve());
        };
        script.onerror = () => reject(new Error('Failed to load Yandex Maps'));
        document.head.appendChild(script);
      });
    };

    loadYandexMaps()
      .then(() => {
        if (isCancelled || !mapContainerRef.current || mapInstanceRef.current) return;

        const ymaps = (window as any).ymaps;

        // Balanced framing: building is centered with offset for card placement
        const isMobile = window.innerWidth < 1024;
        const centerCoords: [number, number] = isMobile
          ? [BUILDING_CENTER[0] - 0.0011, BUILDING_CENTER[1] + 0.0002]
          : [BUILDING_CENTER[0], BUILDING_CENTER[1] - 0.0018];

        const map = new ymaps.Map(
          mapContainerRef.current,
          {
            center: centerCoords,
            zoom: isMobile ? 17 : 18,
            controls: ['zoomControl', 'fullscreenControl'],
            behaviors: ['drag', 'multiTouch'],
          },
          {
            suppressMapOpenBlock: true,
          }
        );

        (window as any).__simonaMap = map;

        // Disable mouse scroll zoom to prevent hijacking page scroll
        map.behaviors.disable('scrollZoom');

        mapInstanceRef.current = map;

        // Official Simona Brand Pointer Layout from Figma Node 4356:97 (No text, pure icon)
        const createBrandPointerLayout = () => {
          return ymaps.templateLayoutFactory.createClass(`
            <div style="position: relative; transform: translate(-50%, -97%); cursor: pointer; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
              <!-- Glowing pulse aura at the pin tip -->
              <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 34px; height: 16px; border-radius: 50%; background: rgba(0,151,156,0.45); filter: blur(5px);"></div>
              
              <!-- Official Brand Pointer SVG from Figma node 4356:97 -->
              <svg width="44" height="60" viewBox="0 0 440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 6px 18px rgba(0,0,0,0.85));">
                <!-- Pin Teardrop Shape with dark backing and turquoise outline -->
                <path d="M219.909 17.4688C105.693 17.4688 12.7354 110.463 12.7354 224.678C12.7353 425.648 208.245 578.429 208.245 578.429C215.114 583.899 224.85 583.899 231.719 578.429C231.719 578.429 427.265 425.648 427.265 224.678C427.265 110.463 334.124 17.4688 219.909 17.4688Z" fill="#16191D" stroke="#00979C" stroke-width="14"/>
                <!-- Simona Brand Mark Inner Vector 1 -->
                <path d="M278.215 120.038H277.839C273.544 120.038 270.041 123.544 270.041 127.841V127.879V161.771V161.808C270.041 166.031 273.431 169.424 277.612 169.575V169.612C309.706 170.63 318.446 181.751 318.446 215.228V255.077C318.446 290.288 308.802 301.183 272.377 301.183H218.962H165.548C129.122 301.183 119.479 290.288 119.479 255.077V215.191C119.479 181.751 128.218 170.63 160.311 169.575V169.537C164.493 169.424 167.884 166.031 167.884 161.771V161.733V127.841V127.804C167.884 123.506 164.38 120 160.086 120H159.709C84.2963 120 60 144.316 60 205.125V265.481C60 326.29 84.2963 350.192 159.709 350.192H219H278.29C353.703 350.192 378 326.29 378 265.481V205.125C377.924 144.354 353.628 120.038 278.215 120.038Z" fill="#00979C"/>
                <!-- Simona Brand Mark Inner Vector 2 -->
                <path d="M241.036 120.035H196.813C192.594 120.035 189.166 123.466 189.166 127.688V145.558V232.077V249.947C189.166 254.169 192.594 257.6 196.813 257.6H241.036C245.255 257.6 248.683 254.169 248.683 249.947V232.077V145.52V127.65C248.683 123.466 245.255 120.035 241.036 120.035Z" fill="#00979C"/>
              </svg>
            </div>
          `);
        };

        // Create single Placemark for active showroom
        const initialCoords = SHOWROOMS[0].coords;
        const placemark = new ymaps.Placemark(
          initialCoords,
          {
            hintContent: SHOWROOMS[0].name,
          },
          {
            iconLayout: createBrandPointerLayout(),
            iconOffset: [0, 0],
          }
        );

        map.geoObjects.add(placemark);
        singlePlacemarkRef.current = placemark;
        currentCoordsRef.current = initialCoords;
      })
      .catch((err) => {
        console.warn('Yandex Maps init error:', err);
      });

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Smooth glide animation for the single pointer
  const animatePointerTo = (from: [number, number], to: [number, number], duration = 700) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      // easeInOutCubic curve
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      const lat = from[0] + (to[0] - from[0]) * ease;
      const lng = from[1] + (to[1] - from[1]) * ease;

      if (singlePlacemarkRef.current) {
        singlePlacemarkRef.current.geometry.setCoordinates([lat, lng]);
      }

      if (p < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        currentCoordsRef.current = to;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  // Handle active showroom change: smoothly glide single pointer across the building
  const handleSelectShowroom = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);

    const targetShowroom = SHOWROOMS.find((s) => s.id === id);
    if (!targetShowroom) return;

    // Smoothly glide pointer from current coords to target entrance
    animatePointerTo(currentCoordsRef.current, targetShowroom.coords);

    // Keep building framed in map center
    if (mapInstanceRef.current) {
      const isMobile = window.innerWidth < 1024;
      const targetCenter: [number, number] = isMobile
        ? [BUILDING_CENTER[0] - 0.0011, BUILDING_CENTER[1] + 0.0002]
        : [BUILDING_CENTER[0], BUILDING_CENTER[1] - 0.0018];

      mapInstanceRef.current.panTo(targetCenter, {
        flying: false,
        duration: 700,
      });
    }
  };

  return (
    <section id="map" className="relative w-full bg-[#111315] py-16 lg:py-24 overflow-hidden">
      {/* Header of Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#16191D] border border-[#2B313A] mb-3 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shadow-[0_0_8px_rgba(0,151,156,0.8)]" />
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D7D9DB]">
                Физические пространства в центре
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-white tracking-tight">
              Схема проезда в салоны «СИМОНА»
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#87888A] max-w-md leading-relaxed">
            Флагманские пространства на ул. Белинского с закрытой гостевой парковкой, интерактивными тест-драйвами и консультациями ведущих экспертов.
          </p>
        </div>
      </div>

      {/* Full-width Map Canvas with Floating Card */}
      <div className="relative w-full h-[640px] sm:h-[600px] lg:h-[620px] overflow-hidden bg-[#16191D]">
        {/* Yandex Map Canvas with Quiet Luxury Dark Shader Filter */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full filter invert-[93%] hue-rotate-180 brightness-[88%] contrast-[112%] saturate-[45%]"
          style={{
            backgroundColor: '#16191D',
          }}
        />

        {/* Seamless Edge Blending: Top and Bottom Gradients */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#111315] via-[#111315]/80 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111315] via-[#111315]/80 to-transparent pointer-events-none z-10" />

        {/* Floating Quiet Luxury Contact Card: Bottom on mobile, Center-left on desktop */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end lg:justify-center pb-6 lg:pb-0 pointer-events-none">
          <div className="w-full max-w-md bg-[#16191D]/90 backdrop-blur-xl border border-[#2B313A] rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black/80 pointer-events-auto transition-all duration-300">
            
            {/* Pill Tabs Selector */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#111315]/90 border border-[#2B313A]/80 rounded-xl mb-6">
              {SHOWROOMS.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectShowroom(s.id)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center space-x-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-simona-teal-dark to-simona-teal text-white shadow-md shadow-simona-teal/20'
                        : 'text-[#87888A] hover:text-white hover:bg-[#1E2228]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`} />
                    <span className="truncate">
                      {s.id === 'belinskogo-15' ? 'Белинского, 15' : 'Белинского, 11/66'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Showroom Info */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-simona-teal">
                  {activeShowroom.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-montserrat font-bold text-white tracking-tight mt-0.5">
                  {activeShowroom.name}
                </h3>
                <p className="text-xs text-[#87888A] leading-relaxed mt-1">
                  {activeShowroom.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#2B313A]/70 space-y-2.5">
                {/* Address */}
                <div className="flex items-start space-x-2.5 text-xs text-[#D7D9DB]">
                  <SimonaIconPin className="w-4 h-4 text-simona-teal flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{activeShowroom.address}</span>
                </div>

                {/* Working Hours */}
                <div className="flex items-center space-x-2.5 text-xs text-[#D7D9DB]">
                  <SimonaIconClock className="w-4 h-4 text-simona-teal flex-shrink-0" />
                  <span>{activeShowroom.schedule}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-2.5 text-xs text-[#D7D9DB]">
                  <SimonaIconPhoneSolid className="w-3.5 h-3.5 text-simona-teal flex-shrink-0 ml-0.5 mr-0.5" />
                  <a
                    href={`tel:${activeShowroom.phoneRaw}`}
                    className="font-medium hover:text-simona-teal transition-colors tracking-wide"
                  >
                    {activeShowroom.phone}
                  </a>
                </div>
              </div>

              {/* Action Button: Route via Yandex Maps */}
              <div className="pt-3">
                <a
                  href={activeShowroom.yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-[#1E2228] hover:bg-simona-teal hover:text-white border border-[#2B313A] hover:border-simona-teal text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 group space-x-2 shadow-lg cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-simona-teal group-hover:text-white transition-colors" />
                  <span>Построить маршрут на Яндекс.Картах</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#87888A] group-hover:text-white transition-colors ml-1" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
