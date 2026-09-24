import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { SimonaIconPin } from '@/components/brand/SimonaIcons';
import { ArrowRight, Globe2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Мировые бренды премиальной бытовой техники | Бутик СИМОНА',
  description:
    'Официальный дилер европейских производителей в Нижнем Новгороде: Miele, ASKO, Liebherr, SMEG, OMOIKIRI, Bertazzoni, Falmec, VARD, Körting. Флагманские экспозиции в салонах на ул. Белинского 15 и 11/66.',
};

export const dynamic = 'force-dynamic';

interface BrandMeta {
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  category: string;
  showroom: 'BELINSKOGO_15' | 'BELINSKOGO_11' | 'BOTH' | 'CATALOG_ONLY';
  showroomNote: string;
  description: string;
  isFeatured?: boolean;
}

const BRANDS_DIRECTORY: BrandMeta[] = [
  {
    name: 'Miele',
    slug: 'miele',
    country: 'Германия',
    countryCode: 'DE',
    category: 'Встраиваемая техника, стирка, кофемашины',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Флагманская бренд-зона • Активная кухня (Белинского, 15)',
    description: 'Легендарное немецкое качество «Immer Besser». Ресурс испытаний 20 лет, запатентованный сотовый барабан, идеальный пар и точность температуры.',
    isFeatured: true,
  },
  {
    name: 'ASKO',
    slug: 'asko',
    country: 'Швеция',
    countryCode: 'SE',
    category: 'Скандинавская встройка, сушильные шкафы, посудомойки',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Экспозиция в салоне на Белинского, 15',
    description: 'Минимализм, экологичность и стальная надежность Steel Pro. Уникальные барабаны Quattro Construction без резиновой манжеты.',
    isFeatured: true,
  },
  {
    name: 'SMEG',
    slug: 'smeg',
    country: 'Италия',
    countryCode: 'IT',
    category: 'Дизайнерская крупная и малая встройка, винтаж',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Бренд-зона: Dolce Stil Novo, Linea, 50s Retro (Белинского, 15)',
    description: 'Итальянская страсть к кулинарии и коллаборации с мировыми архитекторами. Культовые холодильники FAB и технологичная серия Dolce Stil Novo.',
    isFeatured: true,
  },
  {
    name: 'Liebherr',
    slug: 'liebherr',
    country: 'Германия',
    countryCode: 'DE',
    category: 'Холодильники, морозильные лари, винные шкафы',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Флагманская экспозиция холода (Белинского, 15)',
    description: 'Мировой эксперт в технологиях охлаждения и сохранения свежести BioFresh. Непревзойденная надежность компрессоров и тишина работы.',
    isFeatured: true,
  },
  {
    name: 'OMOIKIRI',
    slug: 'omoikiri',
    country: 'Япония',
    countryCode: 'JP',
    category: 'Кухонные мойки, смесители 2-в-1, измельчители отходов',
    showroom: 'BELINSKOGO_11',
    showroomNote: 'Монобрендовый салон OMOIKIRI (Белинского, 11/66)',
    description: 'Японское искусство чистоты и эргономики мокрой зоны. Уникальный гранит Tetogranit, мойки с PVD-покрытием и смесители со встроенной фильтрацией.',
    isFeatured: true,
  },
  {
    name: 'Bertazzoni',
    slug: 'bertazzoni',
    country: 'Италия',
    countryCode: 'IT',
    category: 'Кухонные блоки, варочные центры, духовые шкафы',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Экспозиция в салоне на Белинского, 15',
    description: 'Старейшая семейная мануфактура из Гвасталлы (с 1882 года). Премиальная эмаль автомобильного уровня и инженерное совершенство пламени.',
    isFeatured: true,
  },
  {
    name: 'Körting',
    slug: 'korting',
    country: 'Германия',
    countryCode: 'DE',
    category: 'Встраиваемая техника, вытяжки, микроволновые печи',
    showroom: 'BELINSKOGO_11',
    showroomNote: 'Экспозиция в фирменном салоне (Белинского, 11/66)',
    description: 'Более 130 лет инноваций для комфорта дома. Продуманный функционал, стильный дизайн и высочайшая энергоэффективность.',
    isFeatured: true,
  },
  {
    name: 'VARD',
    slug: 'vard',
    country: 'Россия / Европа',
    countryCode: 'RU',
    category: 'Премиальная встраиваемая техника, холодильники',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Бренд-зона в салоне на Белинского, 15',
    description: 'Современный премиальный бренд бытовой техники, созданный с учетом требований российских кухонных проектов и европейских стандартов качества.',
    isFeatured: true,
  },
  {
    name: 'Falmec',
    slug: 'falmec',
    country: 'Италия',
    countryCode: 'IT',
    category: 'Дизайнерские бесшумные вытяжки и очистители воздуха',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Экспозиция вытяжек NRS (Белинского, 15)',
    description: 'Лидер в области шумоподавления (технология NRS — снижение шума на 86%) и ионизации воздуха Circle.Tech.',
    isFeatured: false,
  },
  {
    name: 'Dunavox',
    slug: 'dunavox',
    country: 'Венгрия',
    countryCode: 'HU',
    category: 'Компрессорные винные шкафы для встройки',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Зона сомелье на Белинского, 15',
    description: 'Профессиональное сохранение винных коллекций. Точный контроль влажности, защита от УФ-лучей и антивибрационная система.',
    isFeatured: false,
  },
  {
    name: 'Elica',
    slug: 'elica',
    country: 'Италия',
    countryCode: 'IT',
    category: 'Индукционные варочные панели со встроенной вытяжкой',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Экспозиция варочных панелей NikolaTesla (Белинского, 15)',
    description: 'Итальянская эстетика и революционная серия NikolaTesla — индукция, вытягивающая испарения прямо на уровне посуды.',
    isFeatured: false,
  },
  {
    name: 'Bone Crusher',
    slug: 'bone crusher',
    country: 'США',
    countryCode: 'US',
    category: 'Измельчители пищевых отходов постоянного магнита',
    showroom: 'BELINSKOGO_11',
    showroomNote: 'Демонстрационная мойка на Белинского, 11/66',
    description: 'Американский эталон гигиены кухни. Высокоскоростные двигатели с постоянными магнитами, лазерная балансировка и пожизненная защита от коррозии.',
    isFeatured: false,
  },
  {
    name: 'Laurastar',
    slug: 'laurastar',
    country: 'Швейцария',
    countryCode: 'CH',
    category: 'Гладильные системы и парогенераторы сухим паром',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Экспозиция ухода за гардеробом (Белинского, 15)',
    description: 'Швейцарское совершенство глажения. Ультратонкий сухой пар DMS очищает волокна тканей и уничтожает 99.9% бактерий.',
    isFeatured: false,
  },
  {
    name: 'Caso',
    slug: 'caso',
    country: 'Германия',
    countryCode: 'DE',
    category: 'Вакууматоры, су-вид, СВЧ, винные шкафы',
    showroom: 'BELINSKOGO_15',
    showroomNote: 'Активная кухня на Белинского, 15',
    description: 'Немецкие инновации для молекулярной гастрономии, бережного вакуумирования и профессионального хранения продуктов.',
    isFeatured: false,
  },
];

export default async function BrandsPage() {
  // Count products per brand from DB
  const brandCounts: Record<string, number> = {};
  try {
    const rawCounts = await prisma.product.groupBy({
      by: ['brand'],
      _count: { id: true },
    });
    for (const item of rawCounts) {
      if (item.brand) {
        brandCounts[item.brand.toUpperCase()] = item._count.id;
      }
    }
  } catch (err) {
    console.error('Error fetching brand counts:', err);
  }

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal" text="Селекция мировых производителей" />
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Атлас брендов премиальной техники
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              «СИМОНА» представляет ведущие европейские фабрики с вековой историей мастерства. Мы гарантируем оригинальное происхождение каждого прибора, официальную заводскую гарантию и наличие физической экспозиции в шоурумах Нижнего Новгорода.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-[#87888A]">Физические экспозиции:</span>
              <span className="px-3 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-xs text-white">
                Белинского, 15 (Флагман)
              </span>
              <span className="px-3 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-xs text-white">
                Белинского, 11/66 (OMOIKIRI & Körting)
              </span>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Официальные коллекции" />
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Производители европейской и мировой техники
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANDS_DIRECTORY.map((b) => {
              const count = brandCounts[b.name.toUpperCase()] || brandCounts[b.slug.toUpperCase()] || 0;

              return (
                <div
                  key={b.slug}
                  className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition duration-300 shadow-md group"
                >
                  <div>
                    {/* Header with Country & Showroom Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-xs text-[#87888A]">
                        <Globe2 className="w-3.5 h-3.5 text-simona-teal" />
                        <span>{b.country}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-zinc-300">
                        {count > 0 ? `${count} моделей` : 'В наличии'}
                      </span>
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-2xl font-montserrat font-bold text-white group-hover:text-simona-teal transition mb-1">
                      {b.name}
                    </h3>
                    <div className="text-xs text-simona-teal font-medium mb-3">
                      {b.category}
                    </div>

                    <p className="text-xs text-[#87888A] leading-relaxed mb-4">
                      {b.description}
                    </p>

                    {/* Showroom presence status */}
                    <div className="bg-[#1E2228] p-2.5 rounded-xl border border-[#2B313A] text-[11px] text-zinc-300 flex items-center space-x-2 mb-4">
                      <SimonaIconPin className="w-3.5 h-3.5 text-simona-teal shrink-0" />
                      <span className="truncate">{b.showroomNote}</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="pt-4 border-t border-[#2B313A] flex items-center justify-between">
                    <Link
                      href={`/brands/${b.slug}`}
                      className="text-xs font-semibold text-white group-hover:text-simona-teal transition flex items-center space-x-1"
                    >
                      <span>О бренде и серии</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/catalog?brand=${encodeURIComponent(b.name)}`}
                      className="text-[11px] text-[#87888A] hover:text-white transition"
                    >
                      В каталог →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Guarantee Bar */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h3 className="text-lg font-montserrat font-bold text-white">
              Официальные прямые контракты с производителями
            </h3>
            <p className="text-xs text-[#87888A]">
              «СИМОНА» является авторизованным партнером. Все приборы имеют белую сертификацию ЕАС и официальную гарантию в РФ.
            </p>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider transition shrink-0"
          >
            Условия гарантии и сервиса
          </Link>
        </div>
      </div>
    </main>
  );
}
