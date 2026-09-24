import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconCheckCircle,
  SimonaIconPackage,
} from '@/components/brand/SimonaIcons';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrismaProduct } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { ProductItem } from '@/types';

interface BrandDetails {
  name: string;
  slug: string;
  country: string;
  category: string;
  showroom: string;
  heroText: string;
  advantages: string[];
}

const BRAND_DETAILS_MAP: Record<string, BrandDetails> = {
  miele: {
    name: 'Miele',
    slug: 'miele',
    country: 'Германия (Гютерсло)',
    category: 'Встраиваемая кухонная техника, стиральные и сушильные машины',
    showroom: 'Флагманский салон: ул. Белинского, 15 (Активная кухня)',
    heroText: '«Immer Besser» — неизменно лучше. С 1899 года семейная компания Miele создает эталонную технику с ресурсом бесперебойной работы 20 лет. Непревзойденная точность температурных режимов пара, сотовые барабаны и продуманная эргономика сенсорных интерфейсов.',
    advantages: [
      '20 лет расчетного ресурса надежности',
      'Паровые духовые шкафы CombiSteam с точностью до 1°C',
      'Запатентованные сотовые барабаны с бережным уходом за шелком и кашемиром',
      'Автоматическое дозирование моющих средств TwinDos',
    ],
  },
  asko: {
    name: 'ASKO',
    slug: 'asko',
    country: 'Швеция (Вара)',
    category: 'Премиальная скандинавская встройка, сушильные шкафы, посудомоечные машины',
    showroom: 'Флагманский салон: ул. Белинского, 15',
    heroText: 'Скандинавский функционализм и бережное отношение к природе. Техника ASKO собирается с применением максимального количества нержавеющей стали Steel Pro и оснащается уникальной конструкцией Quattro Construction.',
    advantages: [
      'Барабаны стиральных машин без резиновой манжеты SmartSeal (100% гигиена)',
      'Сушильные шкафы для верхней одежды, обуви и перчаток',
      'Посудомоечные машины со стальными коромыслами и 11 зонами распыления',
      'Минималистичный дизайн в оттенках Black Steel и Stainless Steel',
    ],
  },
  smeg: {
    name: 'SMEG',
    slug: 'smeg',
    country: 'Италия (Гвасталла)',
    category: 'Дизайнерская техника Dolce Stil Novo, Linea, Victoria, 50s Style',
    showroom: 'Флагманский салон: ул. Белинского, 15',
    heroText: '«Технологии и стиль». SMEG сотрудничает с величайшими мировыми архитекторами (Ренцо Пиано, Гуидо Канали, Марио Беллини). Каждая серия — это законченное произведение интерьерного искусства.',
    advantages: [
      'Премиальные коллекции Dolce Stil Novo с медной и стальной инкрустацией',
      'Культовые холодильники и малая техника в ретро-стиле 50-х',
      'Многозонные индукционные панели с адаптивным определением посуды',
      'Экологичное стекло Eclipse со скрытыми индикаторами',
    ],
  },
  omoikiri: {
    name: 'OMOIKIRI',
    slug: 'omoikiri',
    country: 'Япония',
    category: 'Мойки из гранита Tetogranit/Artgranit, смесители 2-в-1, измельчители отходов',
    showroom: 'Фирменный салон OMOIKIRI: ул. Белинского, 11/66',
    heroText: 'Японское искусство чистоты и гармонии на кухне. Мойки и смесители OMOIKIRI превращают рабочую зону в центр притяжения кулинарного пространства благодаря инновационным композитным материалам и японскому контролю качества.',
    advantages: [
      'Натуральный гранит Tetogranit с антибактериальными ионами серебра',
      'Смесители 2-в-1 с отдельным каналом для питьевой фильтрованной воды',
      'Измельчители пищевых отходов NAGARE с ультратихими двигателями',
      'Широкая палитра благородных оттенков: Вороненная сталь, Золото, Медь, Шампань',
    ],
  },
  liebherr: {
    name: 'Liebherr',
    slug: 'liebherr',
    country: 'Германия / Австрия',
    category: 'Встраиваемые холодильники, морозильники, винные шкафы',
    showroom: 'Флагманский салон: ул. Белинского, 15',
    heroText: 'Специализированный лидер в сфере профессионального и домашнего холода. Технологии сохранения свежести BioFresh и BioFresh Professional поддерживают температуру чуть выше 0°C и идеальную влажность.',
    advantages: [
      'Зоны свежести BioFresh сохраняют витамины продуктов в 3 раза дольше',
      'Винные климатические шкафы с раздельными температурными зонами',
      'Энергоэффективные инверторные компрессоры с минимальным уровнем шума',
      'Скрытые доводчики SoftSystem для плавного закрытия тяжелых фасадов',
    ],
  },
  korting: {
    name: 'KÖRTING',
    slug: 'korting',
    country: 'Германия',
    category: 'Встраиваемая техника, духовые шкафы, варочные панели, вытяжки',
    showroom: 'Фирменный салон: ул. Белинского, 11/66',
    heroText: 'Немецкие инженерные традиции с 1889 года. Надежная встраиваемая техника с лаконичным европейским дизайном, интуитивным управлением и расширенным сроком службы.',
    advantages: [
      'Духовые шкафы с каталитической и пиролитической самоочисткой',
      'Индукционные панели с функцией объединения конфорок Bridge',
      'Мощные малошумные вытяжки с периметральным всасыванием',
      'Официальная сервисная поддержка в Нижнем Новгороде',
    ],
  },
  vard: {
    name: 'VARD',
    slug: 'vard',
    country: 'Россия / Европа',
    category: 'Премиальная встраиваемая техника, холодильники, посудомоечные машины',
    showroom: 'Флагманский салон: ул. Белинского, 15',
    heroText: 'Инженерная премиальная встройка нового поколения, разработанная ведущими специалистами отрасли. Выверенные габариты под стандарты российских кухонь, современные технологии инверторного управления и официальная гарантия 3 года.',
    advantages: [
      'Полная заводская гарантия 3 года на все приборы',
      'Идеальная совместимость с мебельными фасадами отечественных фабрик',
      'Инверторные моторы и низкое энергопотребление',
      'Строгий контроль качества на европейских заводах-партнерах',
    ],
  },
  falmec: {
    name: 'Falmec',
    slug: 'falmec',
    country: 'Италия (Витторио-Венето)',
    category: 'Дизайнерские вытяжки, ионизаторы Circle.Tech, шумоподавление NRS',
    showroom: 'Флагманский салон: ул. Белинского, 15',
    heroText: 'Итальянский мировой лидер в области очистки воздуха на кухне. Запатентованная технология NRS (Noise Reduction System) снижает уровень шума на 86%, делая работу вытяжки практически неслышной.',
    advantages: [
      'Технология NRS — снижение шума работающей вытяжки до 86%',
      'Ионизация воздуха Circle.Tech и фильтры Carbon.Zeo с цеолитом',
      'Сталь марки AISI 304 премиальной шлифовки',
      'Интеграция с индукционными панелями и управление жестами',
    ],
  },
};

interface BrandPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const info = BRAND_DETAILS_MAP[slug];
  const brandTitle = info ? info.name : slug.toUpperCase();

  return {
    title: `Бытовая техника ${brandTitle} в Нижнем Новгороде | Бутик СИМОНА`,
    description: `Официальный дилер ${brandTitle}. Каталог встраиваемой техники, наличие на складе и экспозиция в салонах на ул. Белинского 15 и 11/66. Консультация экспертов и шеф-монтаж.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const slug = params.slug.toLowerCase();
  const brandInfo =
    BRAND_DETAILS_MAP[slug] || {
      name: slug.toUpperCase(),
      slug,
      country: 'Европа',
      category: 'Премиальная бытовая техника',
      showroom: 'Флагманский салон: ул. Белинского, 15',
      heroText: `Официальная продукция ${slug.toUpperCase()} в Нижнем Новгороде. Полный ассортимент сертифицированной техники с гарантией производителя.`,
      advantages: [
        'Официальная гарантия производителя',
        'Быстрая доставка с Центрального склада (ул. Коминтерна, 27)',
        'Бесплатное хранение до 6 месяцев',
        'Профессиональный монтаж и подключение',
      ],
    };

  // Fetch products for this brand
  let products: ProductItem[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: {
        brand: {
          equals: brandInfo.name,
        },
      },
      take: 36,
      orderBy: { isFeatured: 'desc' },
    });

    products = rawProducts.map(formatPrismaProduct);
  } catch (err) {
    console.error('Error loading brand products:', err);
  }

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Back Link */}
        <div>
          <Link
            href="/brands"
            className="inline-flex items-center space-x-1.5 text-xs text-[#87888A] hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ко всем брендам</span>
          </Link>
        </div>

        {/* Brand Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <SectionBadge variant="teal" text={`Бренд • ${brandInfo.country}`} />
              <span className="px-3 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-xs font-semibold text-simona-teal">
                {brandInfo.showroom}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-montserrat font-bold text-white tracking-tight">
              {brandInfo.name}
            </h1>
            <p className="text-base text-zinc-300 font-medium">
              {brandInfo.category}
            </p>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              {brandInfo.heroText}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/showrooms"
                className="px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                Оценить вживую в шоуруме
              </Link>
              <Link
                href="/designers"
                className="px-6 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] text-xs font-semibold uppercase tracking-wider transition"
              >
                Запросить B2B спецификацию
              </Link>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#2B313A]">
            {brandInfo.advantages.map((adv, idx) => (
              <div key={idx} className="bg-[#1E2228]/50 p-4 rounded-xl border border-[#2B313A]/50">
                <SimonaIconCheckCircle className="w-5 h-5 text-simona-teal mb-2" />
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">{adv}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Products Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2B313A] pb-4">
            <div className="text-left space-y-1">
              <SectionBadge variant="teal" text="Модельный ряд" />
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                Коллекции {brandInfo.name} ({products.length})
              </h2>
            </div>

            <Link
              href={`/catalog?brand=${encodeURIComponent(brandInfo.name)}`}
              className="text-xs font-semibold text-simona-teal hover:underline flex items-center space-x-1"
            >
              <span>Смотреть с расширенными фильтрами</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-12 text-center">
              <SimonaIconPackage className="w-12 h-12 text-[#87888A] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">
                Приборы {brandInfo.name} доступны под заказ со склада
              </h3>
              <p className="text-xs text-[#87888A] max-w-md mx-auto mb-6">
                Свяжитесь с консультантом для получения актуального прайс-листа и сроков фабричной поставки.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-simona-teal text-white text-xs font-semibold uppercase tracking-wider"
              >
                <span>Перейти в общий каталог</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-4 flex flex-col justify-between group hover:border-simona-teal/50 transition duration-300 shadow-md"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square w-full rounded-xl bg-[#1E2228] overflow-hidden mb-3">
                      <img
                        src={item.images?.[0] || '/images/products/placeholder.webp'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {/* Availability Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-semibold text-zinc-200 border border-white/10">
                        {item.inStock ? 'На складе' : 'Под заказ'}
                      </span>
                    </div>

                    <div className="text-[10px] font-semibold uppercase tracking-wider text-simona-teal mb-1">
                      {item.brand}
                    </div>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-xs font-semibold text-white group-hover:text-simona-teal transition line-clamp-2 leading-snug mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="text-[11px] text-[#87888A] mb-3">
                      Арт: {item.sku}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2B313A] flex items-center justify-between">
                    <div className="text-sm font-montserrat font-bold text-white">
                      {formatPrice(item.price)}
                    </div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="px-3 py-1.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-[11px] font-semibold uppercase tracking-wider transition"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
