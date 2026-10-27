import React from 'react';

export function SchemaOrgStore() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.simona-bt.ru/#organization',
        name: 'Сеть салонов бытовой техники «СИМОНА»',
        alternateName: ['СИМОНА', 'SIMONA-BT', 'ООО «Технотрейд-НН»'],
        url: 'https://www.simona-bt.ru',
        logo: 'https://www.simona-bt.ru/images/simona-logo.png',
        telephone: '+78314237600',
        email: 'info@simona-bt.ru',
        foundingDate: '1994',
        taxID: '5260300686',
        description:
          'Сеть салонов и интернет-магазин бытовой техники в Нижнем Новгороде. Более 30 лет на рынке. Официальный партнер и авторизованный дилер ведущих мировых производителей встраиваемой и соло бытовой техники: Miele, ASKO, Liebherr, SMEG, Körting, Omoikiri, Bosch, Siemens, Neff, Bertazzoni.',
        sameAs: [
          'https://yandex.ru/maps/org/simona/1042774312/',
          'https://t.me/SimonaExpert',
          'https://t.me/simona_sale',
          'https://vk.com/simona_bt',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Услуги и сервис сети салонов «СИМОНА»',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Подбор комплекта встраиваемой техники под проект кухни',
                description:
                  'Индивидуальный подбор комплекта бытовой техники по чертежам кухонного гарнитура с проверкой габаритов, зазоров вентиляции и электрических мощностей.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Шеф-демонстрации и тест-драйв приборов на Активной кухне',
                description:
                  'Тестирование режимов выпечки с паром, индукционных зон и диспоузеров на действующей кухонной зоне в салоне на ул. Белинского, 15.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Профессиональная установка и подключение встраиваемой бытовой техники',
                description:
                  'Авторизованный монтаж встраиваемой техники собственной службой с сохранением полной заводской гарантии производителя.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Бесплатное ответственное хранение техники на центральном складе',
                description:
                  'Бесплатное хранение оплаченной техники на охраняемом центральном складе (ул. Коминтерна, 27) на период ремонта до 6 месяцев.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Аккуратная доставка и подъем на этаж собственной службой',
                description:
                  'Доставка специализированным транспортом и ручной подъем на этаж по Нижнему Новгороду и Нижегородской области.',
              },
            },
          ],
        },
        subOrganization: [
          { '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-15' },
          { '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-11' },
          { '@id': 'https://www.simona-bt.ru/#warehouse-kominterna-27' },
        ],
      },
      {
        '@type': 'HomeGoodsStore',
        '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-15',
        parentOrganization: {
          '@id': 'https://www.simona-bt.ru/#organization',
        },
        name: 'Флагманский салон бытовой техники «СИМОНА» & Активная кухня',
        url: 'https://www.simona-bt.ru/showrooms',
        telephone: '+78314237600',
        priceRange: '₽₽₽',
        image: 'https://www.simona-bt.ru/images/showroom_belinskogo_15.jpg',
        description:
          'Главная экспозиция встраиваемой и соло бытовой техники европейских брендов. Действующая «Активная кухня» для кулинарных демонстраций и тест-драйва приборов, лаундж-зона для архитекторов и дизайнеров, клиентская парковка перед входом.',
        sameAs: ['https://yandex.ru/maps/org/simona/1042774312/'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. Белинского, 15',
          addressLocality: 'Нижний Новгород',
          postalCode: '603000',
          addressCountry: 'RU',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 56.314227,
          longitude: 44.004118,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '10:00',
            closes: '20:00',
          },
        ],
        amenityFeature: [
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Активная кухня для кулинарных демонстраций',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Клиентская парковка перед салоном',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Лаундж-зона для архитекторов и дизайнеров',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Экспресс-самовывоз малой бытовой техники',
            value: true,
          },
        ],
      },
      {
        '@type': 'HomeGoodsStore',
        '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-11',
        parentOrganization: {
          '@id': 'https://www.simona-bt.ru/#organization',
        },
        name: 'Фирменный салон OMOIKIRI & KÖRTING «СИМОНА»',
        url: 'https://www.simona-bt.ru/showrooms',
        telephone: '+79200057682',
        priceRange: '₽₽₽',
        description:
          'Монобрендовый салон японских гранитных и нержавеющих кухонных моек Omoikiri, смесителей 2-в-1 с питьевым каналом, подключенных измельчителей пищевых отходов (диспоузеров) и встраиваемой техники Körting.',
        sameAs: ['https://yandex.ru/maps/org/simona/1042774312/'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. Белинского, 11/66',
          addressLocality: 'Нижний Новгород',
          postalCode: '603000',
          addressCountry: 'RU',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 56.315102,
          longitude: 44.005321,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '10:00',
            closes: '20:00',
          },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.simona-bt.ru/#warehouse-kominterna-27',
        parentOrganization: {
          '@id': 'https://www.simona-bt.ru/#organization',
        },
        name: 'Центральный склад и терминал выдачи заказов «СИМОНА»',
        url: 'https://www.simona-bt.ru/contacts',
        telephone: '+78314239390',
        description:
          'Централизованный логистический хаб (~8000 SKU в наличии), зона безопасной отгрузки крупногабаритной техники в легковой и грузовой транспорт, пункт бесплатного ответственного хранения до 6 месяцев.',
        sameAs: ['https://yandex.ru/maps/-/CDuW523W'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. Коминтерна, 27',
          addressLocality: 'Нижний Новгород',
          postalCode: '603003',
          addressCountry: 'RU',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 56.347891,
          longitude: 43.876543,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '10:00',
            closes: '14:30',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.simona-bt.ru/#website',
        url: 'https://www.simona-bt.ru',
        name: 'СИМОНА — Сеть салонов бытовой техники и O2O digital-витрина',
        publisher: {
          '@id': 'https://www.simona-bt.ru/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.simona-bt.ru/catalog?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
