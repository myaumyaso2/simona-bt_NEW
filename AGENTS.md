# AGENTS.md — Инженерная конституция и операционный регламент AI-разработчиков SIMONA-BT

## 1. Парадигма разработки: AI-Driven Maintenance (No Human CMS)
- **Продукт**: Премиальный интернет-бутик и digital-витрина салонов бытовой техники «СИМОНА» (г. Нижний Новгород, домен `simona-bt.ru`).
- **Модель управления**: **AI-Driven Maintenance**.
  - В проекте нет классической человеческой админ-панели и штата контент-менеджеров.
  - Вся архитектура, кодовая база, схемы данных, интерфейсы и интеграционные пайплайны создаются, поддерживаются и эволюционируют автономными AI-агентами.
  - Любые изменения вносятся через строго типизированный код на TypeScript, декларативные схемы данных и автоматизированные скрипты.

---

## 2. Обязательные источники истины (Source of Truth)
Перед выполнением любой задачи (написание кода, рефакторинг, создание компонентов, настройка роутинга или интеграций) AI-агент **обязан сверяться с двумя основополагающими манифестами проекта**:

1. **[PRODUCT.md](file:///c:/Users/trash/Documents/antigravity/simona-bt_NEW/PRODUCT.md)** — **Продуктовая и бизнес-истина**:
   - Миссия, O2O-модель (Online-to-Offline) и комплексная лидогенерация для дизайнеров/архитекторов;
   - Физические локации (Флагман на ул. Белинского 15, салон Omoikiri & Körting на ул. Белинского 11/66, центральный склад на ул. Коминтерна 27);
   - Роль «Активной кухни» (шеф-демонстрации как сервис, а не доминирующий локомотив);
   - Каталог (~8000 SKU), 5 табов физического присутствия (`[ Все ]`, `[ На витрине ]`, `[ На складе ]`, `[ На удаленном складе ]`, `[ Под заказ ]`);
   - Интеграционный контур: 1С (склад и заказы), Asana (лиды), ЮKassa (эквайринг 54-ФЗ), корпоративный мессенджер MAX (`max.ru`) + Telegram (`@SimonaExpert`), Яндекс Метрика (счетчик `1351807`);
   - Реестр уроков аудита старого сайта (UMI.CMS): Zero Dead Ends, мгновенный отклик кнопок покупки, персистентность `localStorage`, лимит сравнения в 4 прибора, пре-валидация телефонов РФ.

2. **[DESIGN.md](file:///c:/Users/trash/Documents/antigravity/simona-bt_NEW/DESIGN.md)** — **Визуальный манифест Quiet Luxury и дизайн-система**:
   - Официальная палитра Pantone Brandbook: бирюзовый `#00979C`, винный `#8A151A` (сквозной промо-маркер), темные поверхности `#111315`, `#16191D`, `#1E2228`, границы `#2B313A`, золото `#FDBF3E`;
   - Строгая геометрия: кнопки и селекторы — **`rounded-xl` (12px)** (круглые `rounded-full` для действий категорически запрещены); ярлыки, бейджи и теги — **`rounded-md` (6px)**;
   - Стандартизированный бейдж/оверлайн `SectionBadge` с Soft Glow Pulse (`variant="teal"` и `variant="wine"`);
   - Стандарт выравнивания: **Unified Left-Aligned Standard** (все заголовки строго по левому краю `text-left`, асимметричный Split-Header, запрет центрирования `text-center`);
   - Иконографика: строгий запрет стоковых библиотек (Lucide, Heroicons, React-icons), единый векторный модуль `SimonaIcons.tsx` (Figma SVGs), иконка `SimonaIconPercent` — только для B2B;
   - Анимации: GSAP 3, Lenis Smooth Scroll (запрет браузерного `scroll-smooth`), Framer Motion;
   - Методологический словарь 24 дизайн-команд Impeccable (`/distill`, `/quieter`, `/bolder`, `/clarify`, `/harden`, `/polish` и др.) и принцип ограниченной верификации (Bounded Verification).

---

## 3. Архитектура и технологический стек
- **Фреймворк**: Next.js 14 (App Router, React 18, React Server Components, TypeScript в режиме `strict: true`). Полный запрет использования типа `any`.
- **Стилизация**: Tailwind CSS с расширенной конфигурацией темы `simona.*` (`tailwind.config.js`).
- **Анимационный движок**:
  - GSAP 3 (`gsap`, `ScrollTrigger`) для сложных скролл-анимаций, Ken Burns эффекта и параллакса;
  - Lenis Smooth Scroll (`@studio-freight/lenis` / `lenis`) через компонент `SmoothScrollProvider.tsx`;
  - Framer Motion для модальных окон, выпадающих списков и мобильных дроверов.
- **Управление состоянием**:
  - React Context + Custom Hooks (`StoreContext.tsx`): Корзина, Избранное, Сравнение, автоматическая синхронизация с `localStorage`.
- **Иконографика**: Аутентичный векторный модуль [SimonaIcons.tsx](file:///c:/Users/trash/Documents/antigravity/simona-bt_NEW/components/brand/SimonaIcons.tsx).
- **База данных и ORM**: PostgreSQL / SQLite (`prisma/schema.prisma`, Prisma Client 5.22+).
- **Валидация данных**: Схемы Zod для всех форм, API routes и вебхуков.
- **Производительность**: SSR + ISR для страниц каталога и брендов, Next/Image (WebP/AVIF), PageSpeed 90+ Desktop / 80+ Mobile, TTFB < 200 мс.

---

## 4. MCP Figma Protocol: Design-to-Code Pipeline
При разработке, редизайне или создании новых UI-компонентов AI-агенты **обязаны использовать MCP Figma**:

### 4.1. Доступный инструментарий MCP Figma
- `check_api_key` / `set_api_key`: Проверка сессии и готовности API-ключа Figma.
- `get_file` / `get_file_nodes`: Чтение структуры файла, страниц, фреймов, параметров Auto Layout (padding, gap, alignment), геометрии и constraints.
- `get_image` / `get_image_fills`: Экспорт изображений, иконок и графики в SVG / WebP / PNG (с поддержкой 2x/3x Retina).
- `get_team_styles` / `get_file_styles` / `get_style`: Синхронизация палитр, теней и стилей типографики.
- `get_team_components` / `get_file_components` / `get_component`: Исследование мастер-компонентов и вариантов.

### 4.2. Алгоритм переноса дизайна из Figma в код:
1. **Node Inspection**: Получить JSON узла через `get_file_nodes(file_key, ids)`.
2. **Экстракция токенов**:
   - Layout & Spacing -> Tailwind классы (`gap-4`, `p-6`, `grid-cols-12`).
   - Color Fills -> `bg-simona-surface`, `border-simona-border`, `text-simona-teal`, `text-simona-wine`.
   - Typography -> `font-montserrat text-sm tracking-wide font-medium`.
   - Corner Radius -> строго `rounded-xl` для кнопок, `rounded-md` для бейджей.
3. **Экспорт иконок**: Выгрузить SVG через `get_image(format='svg')`, очистить от жестких инлайн-цветов (`fill="currentColor"`) и зарегистрировать в `SimonaIcons.tsx`.
4. **Pixel-Perfect верификация**: Проверка соответствия размеров, отступов и цветовых контрастов на всех брейкпоинтах (Mobile 390px, Tablet 768px, Desktop 1440px, Ultra-wide 1920px).

---

## 5. Структура проекта и организация файлов
Кодовая база структурирована строго по функциональным слоям:

```text
simona-bt_NEW/
├── AGENTS.md               # Настоящий документ: операционный регламент AI-разработчиков
├── PRODUCT.md              # Продуктовая истина, миссия, O2O-сценарии, локации, интеграции
├── DESIGN.md               # Визуальный манифест Quiet Luxury, токены, геометрия, Impeccable
├── app/                    # Next.js 14 App Router (pages, layouts, api routes)
│   ├── page.tsx            # Главная страница (8 сквозных секций)
│   ├── catalog/            # Каталог товаров и категорий
│   ├── product/[slug]/     # Детальная карточка товара
│   ├── promos/             # Раздел акций европейских производителей
│   ├── designers/          # B2B-клуб архитекторов и дизайнеров
│   └── api/                # API-роуты (поиск, аналитика, вебхуки 1С/Asana/ЮKassa)
├── components/
│   ├── brand/              # Брендовые ассеты (SimonaIcons, SimonaLogo, SimonaPattern)
│   ├── layout/             # Шапка и подвал (UmbrellaBar, HeaderContainer, Footer)
│   ├── ui/                 # Атомарные элементы UI (SectionBadge, SliderArrows)
│   ├── sections/           # 8 секций главной страницы (Hero, Promos, BrandAtlas, Showrooms...)
│   ├── catalog/            # Витрина, тулбар, сайдбар фильтров, карточки LuxuryProductCard
│   ├── product/            # Компоненты карточки товара (ProductBuyBox, галерея, вкладки)
│   ├── promos/             # Компоненты промо-хаба (PromosHubView, PromoCard, PromoModal)
│   ├── modals/             # Модальные окна (EquipmentSelectionModal, ShowroomVisitModal...)
│   ├── providers/          # Провайдеры контекста (SmoothScrollProvider, StoreContext)
│   └── backgrounds/        # Декоративные фоны (DeepParallaxBackground, Constellations)
├── data/                   # Данные витрины (catalogData.ts, showroomPhotos.ts, promosData.ts)
├── lib/
│   └── integrations/       # Внешние API коннекторы (one_c.ts, asana.ts, yookassa.ts)
├── types/                  # Строгие интерфейсы TypeScript (каталог, промо, заказы, токены)
└── prisma/                 # Схема базы данных Prisma (schema.prisma)
```

---

## 6. Стандарты качества кода и инженерии интерфейсов
- **Strict TypeScript**: Никаких типов `any` и нетипизированных `props`. Все формы валидируются Zod-схемами.
- **Инварианты сборки**: Перед завершением работы код обязан компилироваться без ошибок:
  - `npx tsc --noEmit` — проверка типов;
  - `npm run build` — успешная производственная сборка Next.js.
- **Запрет мертвого кода**: Неиспользуемые импорты, закомментированные куски устаревшего кода и отладочные `console.log` должны вычищаться.
- **Интерактивная верификация верстки (Visual Feedback Loop)**:
  - Любой новый блок или редизайн проверяется через headless-инструменты или Chrome DevTools в двух обязательных разрешениях: **Desktop (1440px)** и **Mobile (390px)**.
  - Соблюдается принцип Bounded Verification (один пакетный прогон скриншотов $\rightarrow$ устранение дефектов $\rightarrow$ сдача).
- **Git Hygiene**:
  - Атомарные, осмысленные коммиты на английском или русском языке с четким указанием затронутого модуля.
