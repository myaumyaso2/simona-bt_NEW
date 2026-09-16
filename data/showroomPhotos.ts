export interface ShowroomPhoto {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: 'ALL' | 'ACTIVE_KITCHEN' | 'BRANDS' | 'ZONES' | 'B2B' | 'DETAILS';
  categoryLabel: string;
  tag: string;
  description: string;
}

export const BELINSKOGO_15_PHOTOS: ShowroomPhoto[] = [
  {
    "id": "bel-1",
    "src": "/showrooms/belinskogo-15/salon_01.jpg",
    "title": "Флагманский салон «СИМОНА»",
    "subtitle": "ул. Белинского, 15",
    "category": "ALL",
    "categoryLabel": "Общий вид",
    "tag": "Флагман",
    "description": "Центральное пространство премиальной встройки, бренд-зон и действующей «Активной кухни» в Нижнем Новгороде."
  },
  {
    "id": "bel-2",
    "src": "/showrooms/belinskogo-15/active_kitchen_01.jpg",
    "title": "Активная кухня СИМОНА",
    "subtitle": "Остров Miele & ASKO",
    "category": "ACTIVE_KITCHEN",
    "categoryLabel": "Активная кухня",
    "tag": "Подключено к воде и газу",
    "description": "Полностью функционирующий кухонный остров для персональных тест-драйвов и шеф-дегустаций."
  },
  {
    "id": "bel-3",
    "src": "/showrooms/belinskogo-15/miele_zone_01.jpg",
    "title": "Бренд-зона Miele",
    "subtitle": "Generation 7000",
    "category": "BRANDS",
    "categoryLabel": "Бренд-зоны",
    "tag": "Официальный партнер Miele",
    "description": "Экспозиция флагманских духовых шкафов, пароварок, кофемашин и техники по уходу за бельем."
  },
  {
    "id": "bel-4",
    "src": "/showrooms/belinskogo-15/asko_zone_01.jpg",
    "title": "Бренд-зона ASKO",
    "subtitle": "Scandinavian Craftsmanship",
    "category": "BRANDS",
    "categoryLabel": "Бренд-зоны",
    "tag": "Шведское качество",
    "description": "Премиальные варочные поверхности Celsius°Cooking, посудомоечные машины и духовые шкафы ASKO Elements."
  },
  {
    "id": "bel-5",
    "src": "/showrooms/belinskogo-15/active_kitchen_02.jpg",
    "title": "Шеф-зона и дегустационный стол",
    "subtitle": "Активная кухня",
    "category": "ACTIVE_KITCHEN",
    "categoryLabel": "Активная кухня",
    "tag": "Гастрономия",
    "description": "Пространство для мастер-классов, приготовления блюд су-вид и тестирования программ выпечки."
  },
  {
    "id": "bel-6",
    "src": "/showrooms/belinskogo-15/smeg_zone_01.jpg",
    "title": "Экспозиция SMEG",
    "subtitle": "Итальянский дизайн",
    "category": "BRANDS",
    "categoryLabel": "Бренд-зоны",
    "tag": "Style & Soul",
    "description": "Коллекции Victoria, Linea, Portofino и культовая малая бытовая техника в стиле 50-х."
  },
  {
    "id": "bel-7",
    "src": "/showrooms/belinskogo-15/wine_storage_01.jpg",
    "title": "Сомелье-зона и винные шкафы",
    "subtitle": "Liebherr & Miele",
    "category": "ZONES",
    "categoryLabel": "Зоны салона",
    "tag": "Винное хранение",
    "description": "Премиальные винные климатические шкафы с независимыми температурными зонами и защитой от вибраций."
  },
  {
    "id": "bel-8",
    "src": "/showrooms/belinskogo-15/lounge_01.jpg",
    "title": "Лаунж-переговорная для дизайнеров",
    "subtitle": "Клубная зона B2B",
    "category": "B2B",
    "categoryLabel": "Клуб дизайнеров",
    "tag": "Переговорная база",
    "description": "Комфортное пространство для встреч архитекторов с заказчиками, работы с каталогами образцов и 3D-проектами."
  },
  {
    "id": "bel-9",
    "src": "/showrooms/belinskogo-15/coffee_corner_01.jpg",
    "title": "Кофейная станция СИМОНА",
    "subtitle": "Авторский кофе для гостей",
    "category": "ZONES",
    "categoryLabel": "Зоны салона",
    "tag": "Сервис",
    "description": "Свежесваренный авторский эспрессо и капучино из флагманских встроенных кофемашин Miele."
  },
  {
    "id": "bel-10",
    "src": "/showrooms/belinskogo-15/details_01.jpg",
    "title": "Тактильные материалы и переключатели",
    "subtitle": "Качество в деталях",
    "category": "DETAILS",
    "categoryLabel": "Детали",
    "tag": "Эстетика",
    "description": "Матовая сталь, шлифованный алюминий, поворотные регуляторы с мягким ходом и благородное стекло."
  },
  {
    "id": "bel-11",
    "src": "/showrooms/belinskogo-15/salon_02.jpg",
    "title": "Экспозиция встраиваемой техники",
    "subtitle": "Премиум-сегмент",
    "category": "ALL",
    "categoryLabel": "Общий вид",
    "tag": "Встройка",
    "description": "Более 150 единиц техники в реальной интерьерной интеграции в фасады Nobilia и Cucine Lube."
  },
  {
    "id": "bel-12",
    "src": "/showrooms/belinskogo-15/active_kitchen_03.jpg",
    "title": "Приготовление с паром Miele DGC",
    "subtitle": "Активная кухня",
    "category": "ACTIVE_KITCHEN",
    "categoryLabel": "Активная кухня",
    "tag": "Шеф-тест",
    "description": "Демонстрация комбинированного режима пара и конвекции с сохранением витаминов и текстуры."
  }
];
