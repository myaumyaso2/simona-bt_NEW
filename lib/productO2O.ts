import { ProductItem } from '@/types';
import { getProductPhysicalStatus, EffectivePhysicalStatus } from '@/lib/utils';
import { formatBrandName } from '@/lib/formatters';

export interface ProductO2OInfo {
  brandFormatted: string;
  physicalStatus: EffectivePhysicalStatus;
  isShowroom11: boolean;
  showroomName: string;
  showroomAddress: string;
  showroomId: 'belinskogo_11' | 'belinskogo_15';
  inShowroomExposition: boolean;
  statusBadge: {
    text: string;
    variant: 'emerald' | 'teal' | 'zinc';
    subtext?: string;
  };
  pickupText: {
    time: string;
    location: string;
  };
  deliveryText: {
    time: string;
    details: string;
  };
  consultationText: string;
}

export function getProductO2OInfo(product: ProductItem): ProductO2OInfo {
  const brandFormatted = formatBrandName(product.brand);
  const brandLower = (product.brand || '').toLowerCase();
  const isShowroom11 = brandLower.includes('omoikiri') || brandLower.includes('körting') || brandLower.includes('korting');

  const showroomAddress = isShowroom11 ? 'ул. Белинского, 11/66' : 'ул. Белинского, 15';
  const showroomName = isShowroom11
    ? 'Фирменный салон OMOIKIRI & KÖRTING'
    : 'Флагманский салон «СИМОНА»';
  const showroomId = isShowroom11 ? 'belinskogo_11' : 'belinskogo_15';

  const status = getProductPhysicalStatus(product);
  const inShowroomExposition = status === 'SHOWROOM';
  const isSmallAppliance = product.categoryType === 'CATEGORY_B';

  let statusBadge: ProductO2OInfo['statusBadge'];
  let pickupText: ProductO2OInfo['pickupText'];
  let deliveryText: ProductO2OInfo['deliveryText'];
  let consultationText: string;

  switch (status) {
    case 'SHOWROOM':
      statusBadge = {
        text: `В экспозиции: ${showroomAddress}`,
        variant: 'emerald',
        subtext: 'Доступен для осмотра и тест-драйва',
      };
      if (isSmallAppliance && !isShowroom11) {
        pickupText = {
          time: 'Сегодня',
          location: `из флагманского салона (${showroomAddress})`,
        };
      } else {
        pickupText = {
          time: 'Сегодня',
          location: 'с центрального склада (ул. Коминтерна, 27)',
        };
      }
      deliveryText = {
        time: 'Завтра, бесплатно',
        details: '(в белых перчатках до кухни)',
      };
      consultationText = `Модель представлена в экспозиции салона на ${showroomAddress}`;
      break;

    case 'LOCAL_STOCK':
      statusBadge = {
        text: 'На складе в Нижнем Новгороде',
        variant: 'emerald',
        subtext: 'Готов к быстрой отгрузке',
      };
      pickupText = {
        time: 'Сегодня',
        location: 'с центрального склада (ул. Коминтерна, 27)',
      };
      deliveryText = {
        time: '1–2 рабочих дня, бесплатно',
        details: '(в белых перчатках до кухни)',
      };
      consultationText = `Похожие образцы бренда ${brandFormatted} представлены в салоне на ${showroomAddress}`;
      break;

    case 'REMOTE_STOCK':
      statusBadge = {
        text: 'На удаленном складе в РФ',
        variant: 'teal',
        subtext: 'Прямая поставка от официального импортера',
      };
      pickupText = {
        time: 'Через 3–5 дней',
        location: 'терминал на ул. Коминтерна, 27 (по прибытии)',
      };
      deliveryText = {
        time: '3–7 рабочих дней',
        details: '(авторизованная логистика до кухни)',
      };
      consultationText = `Эксперт салона на ${showroomAddress} подробно расскажет о спецификации и согласует доставку`;
      break;

    case 'ON_ORDER':
    default:
      statusBadge = {
        text: 'Под заказ из Европы',
        variant: 'zinc',
        subtext: 'Индивидуальное фабричное производство',
      };
      pickupText = {
        time: 'По готовности поставки',
        location: 'терминал на ул. Коминтерна, 27',
      };
      deliveryText = {
        time: 'Срок согласуется с фабрикой',
        details: '(индивидуальный график поставки под дизайн-проект)',
      };
      consultationText = `Забронируйте консультацию в салоне на ${showroomAddress} для согласования спецификаций и сроков`;
      break;
  }

  return {
    brandFormatted,
    physicalStatus: status,
    isShowroom11,
    showroomName,
    showroomAddress,
    showroomId,
    inShowroomExposition,
    statusBadge,
    pickupText,
    deliveryText,
    consultationText,
  };
}
