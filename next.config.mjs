/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simona-bt.ru',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'simona-bt.ru',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/optovyj_otdel',
        destination: '/opt',
        permanent: true,
      },
      {
        source: '/optovyj_otdel/',
        destination: '/opt',
        permanent: true,
      },
      {
        source: '/optovyj-otdel',
        destination: '/opt',
        permanent: true,
      },
      // UMI.CMS Promos section redirect
      {
        source: '/actions_sales',
        destination: '/promos',
        permanent: true,
      },
      {
        source: '/actions_sales/',
        destination: '/promos',
        permanent: true,
      },
      // Specific legacy promo slug mappings (underscores to hyphens)
      {
        source: '/actions_sales/korting_pokupka_eto_podarok1',
        destination: '/promos/korting-pokupka-eto-podarok1',
        permanent: true,
      },
      {
        source: '/actions_sales/korting_pokupka_eto_podarok1/',
        destination: '/promos/korting-pokupka-eto-podarok1',
        permanent: true,
      },
      {
        source: '/actions_sales/akciya_ot_smeg_skidka_20_na_komplekt_bytovoj_tehniki',
        destination: '/promos/akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki',
        permanent: true,
      },
      {
        source: '/actions_sales/akciya_ot_smeg_skidka_20_na_komplekt_bytovoj_tehniki/',
        destination: '/promos/akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki',
        permanent: true,
      },
      {
        source: '/actions_sales/korting_ckidka_pri_pokupke_komplekta',
        destination: '/promos/korting-ckidka-pri-pokupke-komplekta',
        permanent: true,
      },
      {
        source: '/actions_sales/korting_ckidka_pri_pokupke_komplekta/',
        destination: '/promos/korting-ckidka-pri-pokupke-komplekta',
        permanent: true,
      },
      {
        source: '/actions_sales/evelux_skidki_pri_pokupke_komplekta',
        destination: '/promos/evelux-skidki-pri-pokupke-komplekta',
        permanent: true,
      },
      {
        source: '/actions_sales/evelux_skidki_pri_pokupke_komplekta/',
        destination: '/promos/evelux-skidki-pri-pokupke-komplekta',
        permanent: true,
      },
      {
        source: '/actions_sales/vard_skidki_pri_pokupke_komplekta',
        destination: '/promos/vard-skidki-pri-pokupke-komplekta',
        permanent: true,
      },
      {
        source: '/actions_sales/vard_skidki_pri_pokupke_komplekta/',
        destination: '/promos/vard-skidki-pri-pokupke-komplekta',
        permanent: true,
      },
      {
        source: '/actions_sales/vard_gril_plancha',
        destination: '/promos/vard-gril-plancha',
        permanent: true,
      },
      {
        source: '/actions_sales/vard_gril_plancha/',
        destination: '/promos/vard-gril-plancha',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_skidka_20_na_komplekt1',
        destination: '/promos/falmec-skidka-20-na-komplekt1',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_skidka_20_na_komplekt1/',
        destination: '/promos/falmec-skidka-20-na-komplekt1',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_bolshe_podarkov',
        destination: '/promos/falmec-bolshe-podarkov',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_bolshe_podarkov/',
        destination: '/promos/falmec-bolshe-podarkov',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_new_actions',
        destination: '/promos/falmec-new-actions',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_new_actions/',
        destination: '/promos/falmec-new-actions',
        permanent: true,
      },
      {
        source: '/actions_sales/evelux_34',
        destination: '/promos/evelux-34',
        permanent: true,
      },
      {
        source: '/actions_sales/evelux_34/',
        destination: '/promos/evelux-34',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_water_50',
        destination: '/promos/falmec-water-50',
        permanent: true,
      },
      {
        source: '/actions_sales/falmec_water_50/',
        destination: '/promos/falmec-water-50',
        permanent: true,
      },
      // Wildcard fallback for all other /actions_sales/:slug paths
      {
        source: '/actions_sales/:slug',
        destination: '/promos/:slug',
        permanent: true,
      },
      {
        source: '/actions_sales/:slug/',
        destination: '/promos/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
