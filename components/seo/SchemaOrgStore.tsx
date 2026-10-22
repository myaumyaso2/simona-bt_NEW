import React from 'react';

export function SchemaOrgStore() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeGoodsStore',
        '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-15',
        name: 'Флагманский салон премиальной бытовой техники «СИМОНА»',
        url: 'https://www.simona-bt.ru',
        telephone: '+78312118242',
        priceRange: '₽₽₽₽',
        image: 'https://www.simona-bt.ru/images/showroom_belinskogo_15.jpg',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '184',
          bestRating: '5',
          worstRating: '1',
        },
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
      },
      {
        '@type': 'HomeGoodsStore',
        '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-11',
        name: 'Фирменный салон OMOIKIRI & KÖRTING «СИМОНА»',
        url: 'https://www.simona-bt.ru',
        telephone: '+78312118242',
        priceRange: '₽₽₽₽',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '184',
          bestRating: '5',
          worstRating: '1',
        },
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
        name: 'Центральный склад и терминал выдачи заказов «СИМОНА»',
        url: 'https://www.simona-bt.ru',
        telephone: '+78314237600',
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
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.simona-bt.ru/#website',
        url: 'https://www.simona-bt.ru',
        name: 'СИМОНА — Премиальная бытовая техника и O2O digital-витрина',
        publisher: {
          '@id': 'https://www.simona-bt.ru/#showroom-belinskogo-15',
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
