import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';

// 1. Month map for repairing Russian Excel decimal date corruptions
const MONTH_MAP: Record<string, number> = {
  янв: 1, фев: 2, мар: 3, апр: 4, май: 5, июн: 6,
  июл: 7, авг: 8, сен: 9, окт: 10, ноя: 11, дек: 12,
};

export function fixExcelDecimal(rawVal: string): string {
  if (!rawVal) return rawVal;
  const val = rawVal.trim().toLowerCase();

  // Pattern 1: "19.май" or "06.янв" or "02.апр" (number.month) -> number.month_num
  const match1 = val.match(/^0?(\d+)\.([а-я]{3,4})$/);
  if (match1) {
    const num = match1[1];
    const mStr = match1[2].slice(0, 3);
    const mNum = MONTH_MAP[mStr];
    if (mNum !== undefined) {
      return `${num}.${mNum}`;
    }
  }

  // Pattern 2: "фев.43" (month.number) -> month_num.number
  const match2 = val.match(/^([а-я]{3,4})\.(\d+)$/);
  if (match2) {
    const mStr = match2[1].slice(0, 3);
    const mNum = MONTH_MAP[mStr];
    if (mNum !== undefined) {
      return `${mNum}.${match2[2]}`;
    }
  }

  return rawVal.trim();
}

// 2. Canonical dictionary of all technical column slugs to natural Russian labels
const CANONICAL_LABELS: Record<string, string> = {
  // General & Dimensions
  cvet: 'Цвет',
  garantiya: 'Гарантия',
  stranaproishozhdeniya: 'Страна производства',
  width: 'Ширина (см)',
  depth: 'Глубина (см)',
  height: 'Высота (см)',
  length: 'Длина (см)',
  weight: 'Вес (кг)',
  gabarity_upakovki: 'Габариты упаковки (см)',
  ves_v_upakovke: 'Вес в упаковке (кг)',
  material_korpusa: 'Материал корпуса',
  potreblyaemaya_mownost_vt: 'Потребляемая мощность (Вт)',
  mownost: 'Мощность (Вт)',
  tip_sushki: 'Тип сушки',
  kolvo_sekcij: 'Количество секций',
  regulirovka_temperatury: 'Регулировка температуры',
  displej: 'Дисплей',
  maksimalnaya_temperatura: 'Максимальная температура',
  material_nozhej: 'Материал ножей',
  kolichestvovo_nasadok: 'Количество насадок',
  naznachenie: 'Назначение',
  antiprigarnoe_pokrytie: 'Антипригарное покрытие',
  promyvka_nozhej_pod_vodoj: 'Промывка ножей под водой',
  samozatachivayuwiesya_nozhi: 'Самозатачивающиеся ножи',
  pitanie_ot_akkumulyatora: 'Питание от аккумулятора',
  avtootklyuchenie: 'Автоотключение',
  material_podoshvy_utyuga: 'Материал подошвы',
  diametr_rabochej_poverhnosti_sm: 'Диаметр рабочей поверхности (см)',
  kolichestvo_form_dlya_blinov: 'Количество форм для блинов',
  diametr_blinov_sm: 'Диаметр блинов (см)',
  nabor_posudy: 'Набор посуды',
  minimalnyj_uroven_shuma_db: 'Минимальный уровень шума (дБ)',
  
  // Hobs & Stoves
  vsego_konforok: 'Всего конфорок',
  material_paneli: 'Материал панели',
  tip_sensornogo_upravleniya: 'Переключатели',
  chugunnye_reshetki: 'Чугунные решетки',
  elektropodjig: 'Электроподжиг',
  gaz_kontrol_konforok: 'Газ-контроль конфорок',
  varka_raspolozhenie_pereklyuchatelej: 'Расположение переключателей',
  varka_tajmer_konforok: 'Таймер конфорок',
  varka_zawitnoe_otklyuchenie: 'Защитное отключение',
  varka_indikator_ostatochnogo_tepla: 'Индикатор остаточного тепла',

  // Ovens (Duhovka)
  duhovka_obem: 'Объем (л)',
  duhovka_mownost_podklyucheniya: 'Мощность подключения (кВт)',
  duhovka_gril: 'Гриль',
  duhovka_konvekciya: 'Конвекция',
  duhovka_pereklyuchateli: 'Переключатели',
  duhovka_tajmer: 'Таймер',
  duhovka_displej: 'Дисплей',
  duhovka_teleskopicheskie_napravlyayuwie: 'Телескопические направляющие',
  duhovka_chislo_stekol_dvercy: 'Число стекол дверцы',
  duhovka_ochistka: 'Очистка',
  duhovka_avtomaticheskie_programmy: 'Автоматические программы',
  duhovka_klass_energo: 'Класс энергопотребления',
  duhovka_rezhimov_nagreva: 'Режимов нагрева',
  duhovka_par: 'Приготовление на пару',

  // Dishwashers (PMM)
  pmm_vmestimost: 'Вместимость (комплектов)',
  pmm_klass_energopotrebleniya: 'Класс энергопотребления',
  pmm_klass_mojki: 'Класс мойки',
  pmm_klass_sushki: 'Класс сушки',
  pmm_tip_sushki: 'Тип сушки',
  pmm_zawita_ot_protechek: 'Защита от протечек',
  pmm_indikator_na_polu: 'Индикатор на полу',
  pmm_rashod_vody_za_cikl_l: 'Расход воды за цикл (л)',
  pmm_maksimalnaya_potreblyaemaya_mownost_kvt: 'Максимальная потребляемая мощность (кВт)',
  pmm_energopotreblenie_za_cikl_kvtch: 'Энергопотребление за цикл (кВт/ч)',
  pmm_uroven_shuma_pri_rabote_db: 'Уровень шума при работе (дБ)',
  pmm_kolichestvo_programm: 'Количество программ',
  pmm_intensivnaya_programma_dlya_silnozagryaznennoj_posudy: 'Интенсивная программа для сильнозагрязненной посуды',
  pmm_ekspressprogramma: 'Экспресс-программа (быстрый цикл)',
  pmm_tajmer_otsrochki_zapuska: 'Таймер отсрочки запуска',
  pmm_lotok_dlya_stolovyh_priborov: 'Лоток для столовых приборов',
  pmm_kolichestvo_korzin: 'Количество корзин',
  pmm_avtootkryvanie: 'Автооткрывание дверцы',
  pmm_vnutrennee_osvewenie: 'Внутреннее освещение',
  pmm_rezhim_polovinnoj_zagruzki: 'Режим половинной загрузки',

  // Washing Machines (SM)
  sm_maksimalnaya_zagruzka_belya_kg: 'Максимальная загрузка белья (кг)',
  sm_klass_energopotrebleniya: 'Класс энергопотребления',
  sm_klass_stirki: 'Класс стирки',
  sm_klass_otzhima: 'Класс отжима',
  sm_maks_skorost_vraweniya_pri_otzhime_obmin: 'Макс. скорость вращения при отжиме (об/мин)',
  sm_zawita_ot_protechek: 'Защита от протечек',
  sm_kolichestvo_programm_stirki: 'Количество программ стирки',
  sm_dozagruzka_belya: 'Дозагрузка белья',
  sm_uroven_shuma_stirka: 'Уровень шума при стирке (дБ)',
  sm_uroven_shuma_otzhim: 'Уровень шума при отжиме (дБ)',
  sm_otstrochka_starta: 'Отсрочка старта',
  sm_invertornyj_dvigatel: 'Инверторный двигатель',
  sm_funkciya_par: 'Функция Пар',
  sm_avtodozirovka_moyuwego_sredstva: 'Автодозировка моющего средства',

  // Drying Machines (Sushilka)
  sushilka_tip_sushki: 'Тип сушки',
  sushilka_maksimalnyj_uroven_shuma_db: 'Максимальный уровень шума (дБ)',
  sushilka_maksimalnaya_zagruzka_kg: 'Максимальная загрузка (кг)',
  sushilka_vozmozhnost_ustanovki_na_stiralnuyu_mashinu: 'Возможность установки на стиральную машину',
  sushilka_kolichestvo_programm: 'Количество программ',
  sushilka_zawita_ot_sminaniya: 'Защита от сминания',
  sushilka_maksimalnaya_potreblyaemaya_mownost_kvt: 'Максимальная потребляемая мощность (кВт)',
  sushilka_korzina_dlya_sushki_shersti: 'Корзина для сушки шерсти',
  sushilka_obrabotka_parom: 'Обработка паром',

  // Refrigerators (Holodilnik)
  holodilnik_morozilnaya_kamera: 'Морозильная камера',
  holodilnik_upravlenie: 'Управление',
  holodilnik_energopotreblenie_kvtchgod: 'Энергопотребление (кВтч/год)',
  holodilnik_kolichestvo_kompressorov: 'Количество компрессоров',
  holodilnik_kolichestvo_kamer: 'Количество камер',
  holodilnik_zona_svezhesti: 'Зона свежести',
  holodilnik_no_frost: 'No Frost',
  holodilnik_avtonomnoe_sohranenie_holoda: 'Автономное сохранение холода (ч)',
  holodilnik_mownost_zamorazhivaniya: 'Мощность замораживания (кг/сутки)',
  holodilnik_superzamorozka: 'Суперзаморозка',
  holodilnik_superohlazhdenie: 'Суперохлаждение',
  holodilnik_obwij_obem: 'Общий объем',
  holodilnik_obem_holodilnoj_kamery: 'Объем холодильной камеры (л)',
  holodilnik_obem_morozilnoj_kamery: 'Объем морозильной камеры (л)',
  holodilnik_maksimalnyj_uroven_shuma_db: 'Максимальный уровень шума (дБ)',
  holodilnik_vozmozhnost_perevesit_dver: 'Возможность перенавески двери',
  holodilnik_no_frost_v_morozilnoj_kamere: 'No Frost в морозильной камере',
  holodilnik_raspolozhenie_petlej: 'Расположение петель',
  holodilnik_dva_kontura_ohlazhdeniya: 'Два контура охлаждения',
  holodilnik_klass_energopotrebleniya: 'Класс энергопотребления',
  holodilnik_inverternyj_kompressor: 'Инверторный компрессор',
  holodilnik_generator_lda: 'Генератор льда',
  holodilnik_kreplenie_fasada: 'Крепление фасада',

  // Hoods (Vytyazhka)
  vytyazhka_rejimy_raboty: 'Режимы работы',
  vytyazhka_maksimalnaya_proizvoditelnost: 'Максимальная производительность (м³/ч)',
  vytyazhka_diametr_patrubka: 'Диаметр патрубка воздуховода (мм)',
  vytyazhka_potreblyaemaya_moshchnost: 'Потребляемая мощность (Вт)',
  vytyazhka_material_korpusa: 'Материал корпуса',
  vytyazhka_kolichestvo_skorostej: 'Количество скоростей',
  vytyazhka_upravlenie: 'Управление',
  vytyazhka_osvewenie: 'Освещение',
  vytyazhka_maksimalnyj_uroven_shuma: 'Максимальный уровень шума (дБ)',
  vytyazhka_maksimalnaya_vysota: 'Максимальная высота (см)',
  vytyazhka_ugolnyj_filtr: 'Угольный фильтр',

  // Microwaves (Microvoln)
  microvoln_obem: 'Объем (л)',
  microvoln_maksimalnaya_mownost_mikrovoln_vt: 'Максимальная мощность микроволн (Вт)',
  microvoln_gril: 'Гриль',
  microvoln_vnutrennee_pokrytie_kamery: 'Внутреннее покрытие камеры',
  microvoln_funkciya_razmorozki: 'Функция разморозки',
  microvoln_kolichestvo_avtomaticheskih_programm: 'Количество автоматических программ',
  microvoln_potreblyaemaya_mownost_kvt: 'Потребляемая мощность (кВт)',
  microvoln_konvekciya: 'Конвекция',

  // Sinks & Taps (Mojka & Smesitel)
  mojka_material: 'Материал',
  mojka_ustanovka: 'Установка',
  mojka_diametr_sliva: 'Диаметр слива',
  mojka_kolichestvo_chash: 'Количество чаш',
  mojka_otverstie_pod_smesitel: 'Отверстие под смеситель',
  mojka_nalichie_kryla: 'Наличие крыла',
  smesitel_tip: 'Тип смесителя',
  smesitel_povorotnyj_izliv: 'Поворотный излив',
  smesitel_vydvizhnoj_izliv: 'Выдвижной излив',
  smesitel_filtr: 'Подключение фильтра питьевой воды',

  // Small Domestic Appliances
  toster_maksimalnaya_potreblyaemaya_mownost_vt: 'Максимальная потребляемая мощность (Вт)',
  toster_kolichestvo_rezhimov: 'Количество режимов',
  toster_kolichestvo_tostov: 'Количество тостов',
  toster_reshetka_dlya_bulochek: 'Решетка для булочек',
  toster_podogrev: 'Подогрев',
  toster_razmorozka: 'Разморозка',

  chajnik_maksimalnaya_potreblyaemaya_mownost_kvt: 'Максимальная потребляемая мощность (кВт)',
  chajnik_material_korpusa: 'Материал корпуса',
  chajnik_material_vnutrennej_stenki: 'Материал внутренней стенки',
  chajnik_obem_l: 'Объем (л)',
  chajnik_nagrevatelnyj_element: 'Нагревательный элемент',
  chajnik_regulirovka_temperatury: 'Регулировка температуры',
  chajnik_podderzhanie_temperatury: 'Поддержание температуры',
  chajnik_zvukovoj_signal: 'Звуковой сигнал',
  chajnik_vnutrennyaya_podsvetka: 'Внутренняя подсветка',

  kofe_davlenie_pompy_bar: 'Давление помпы (бар)',
  kofe_regulirovka_kreposti_kofe: 'Регулировка крепости кофе',
  kofe_regulirovka_stepeni_pomola: 'Регулировка степени помола',
  kofe_kapuchinator: 'Капучинатор',
  kofe_obem_kontejnera_dlya_vody_l: 'Объем контейнера для воды (л)',
  kofe_tip_ispolzuemogo_kofe: 'Тип используемого кофе',
  kofe_regulirovka_porcii_goryachej_vody: 'Регулировка порции горячей воды',
  kofe_regulirovka_temperatury_kofe: 'Регулировка температуры кофе',
  kofe_mownost_vt: 'Мощность (Вт)',
  kofe_odnovremennoe_prigotovlenie_dvuh_chashek: 'Одновременное приготовление двух чашек',
  kofe_podacha_goryachej_vody: 'Подача горячей воды',
  kofe_avtomaticheskaya_dekalcinaciya: 'Автоматическая декальцинация',
  kofe_displej: 'Дисплей',
  kofe_podogrev_chashek: 'Подогрев чашек',

  blender_kolichestvo_skorostej: 'Количество скоростей',
  blender_nasadka_venchik: 'Насадка венчик',
  blender_kolka_lda: 'Колка льда',
  blender_nasadka_dlya_pyure: 'Насадка для пюре',
  blender_turborezhim: 'Турборежим',
  blender_izmelchitel: 'Измельчитель',
  blender_obem_chashi_l: 'Объем чаши (л)',
  blender_mownost_vt: 'Мощность (Вт)',
  blender_material_chashi: 'Материал чаши',
  blender_material_pogruzhnoj_chasti: 'Материал погружной части',
  blender_material_korpusa: 'Материал корпуса',
  blender_plavnaya_regulirovka_skorosti: 'Плавная регулировка скорости',
  blender_impulsnyj_rezhim: 'Импульсный режим',
  blender_nasadka_dlya_narezki_kubikami: 'Насадка для нарезки кубиками',

  // Wine Coolers
  'vin-shkaf_kolichestvo_temperaturnyh_zon': 'Количество температурных зон',
  'vin-shkaf_emkost_v_butylkah': 'Емкость (в бутылках)',
  'vin-shkaf_tip_ustanovki': 'Тип установки',

  // Vacuum cleaners
  pylesos_tip_pylesbornika: 'Тип пылесборника',
  pylesos_tip_elektropitaniya: 'Тип электропитания',
  pylesos_maksimalnaya_potreblyaemaya_mownost_vt: 'Максимальная потребляемая мощность (Вт)',
  pylesos_obem_pylesbornika_l: 'Объем пылесборника (л)',
  pylesos_filtr_tonkoj_ochistki: 'Фильтр тонкой очистки (HEPA)',
  pylesos_upravlenie: 'Управление',
  pylesos_turbowetka_v_komplekte: 'Турбощетка в комплекте',
  pylesos_parketnaya_wetka_v_komplekte: 'Паркетная щетка в комплекте',
  pylesos_kolichestvo_nasadok: 'Количество насадок',
  pylesos_radius_dejstviya_m: 'Радиус действия (м)',

  // Waste disposers & Sorters
  izmel_mownost_vt: 'Мощность (Вт)',
  izmel_oborotov_v_minutu: 'Оборотов в минуту',
  izmel_diametr_otverstiya_dyujmy: 'Диаметр отверстия (дюймы)',
  izmel_pnevmoknopka_v_komplekte: 'Пневмокнопка в комплекте',
  izmel_obem_kamery: 'Объем камеры (мл)',
  izmel_tip_motora: 'Тип мотора',
  izmel_material_rabochej_kamery: 'Материал рабочей камеры',
  sorter_kolichestvo_kontejnerov: 'Количество контейнеров',
  sorter_obwij_obem_l: 'Общий объем (л)',
  sorter_montazh_v_dverku_shkafa: 'Монтаж в дверцу шкафа',

  // Water heaters
  vodonagrev_mownost_nagreva_kvt: 'Мощность нагрева (кВт)',
  vodonagrev_obem_dlya_nakopitelnyh_l: 'Объем (л)',
  vodonagrev_razmewenie_dlya_nakopitelnyh: 'Размещение',
  vodonagrev_proizvoditelnost_dlya_protochnyh_lmin: 'Производительность (л/мин)',
  vodonagrev_upravlenie: 'Управление',
  vodonagrev_nasadki_dlya_protochnyh: 'Насадки в комплекте',

  // Multicookers, Steamer, Meat grinders
  multivarka_moshchnost: 'Мощность (Вт)',
  multivarka_obem_chashi: 'Объем чаши (л)',
  multivarka_pokrytie_chashi: 'Покрытие чаши',
  multivarka_upravlenie: 'Управление',
  multivarka_multipovar: 'Мультиповар',
  multivarka_avtomaticheskie_programmy: 'Количество автоматических программ',
  multivarka_tehnologiya_sous_vide: 'Технология Су-вид',

  soko_tip: 'Тип соковыжималки',
  soko_maksimalnaya_potreblyaemaya_mownost_vt: 'Максимальная потребляемая мощность (Вт)',
  soko_kolichestvo_skorostej: 'Количество скоростей',
  soko_tip_upravleniya: 'Тип управления',
  soko_protivokapelnaya_sistema: 'Противокапельная система',
  soko_impulsnyj_rezhim: 'Импульсный режим',

  myaso_proizvoditelnost_kgmin: 'Производительность (кг/мин)',
  myaso_maksimalnaya_potreblyaemaya_mownost_kvt: 'Максимальная потребляемая мощность (кВт)',
  myaso_kolichestvo_nasadok: 'Количество насадок',
  myaso_kolichestvo_reshetok: 'Количество решеток',
  myaso_nasadka_dlya_narezki_kubikami: 'Насадка для нарезки кубиками',
  myaso_nasadka_kebbe: 'Насадка кеббе',

  parovarka_obwij_obem_l: 'Общий объем (л)',
  parovarka_obm_rezervuara_dlya_vody_l: 'Объем резервуара для воды (л)',
  parovarka_kolvo_yarusov: 'Количество ярусов',
  parovarka_avtoprigotovlenie: 'Автоприготовление',
  parovarka_podderzhanie_tepla: 'Поддержание тепла',
  parovarka_avtomaticheskaya_ochistka_ot_nakipi: 'Автоматическая очистка от накипи',
  parovarka_displej: 'Дисплей',
  parovarka_tip_pereklyuchatelej: 'Тип переключателей',
  parovarka_mownost_podklyucheniya_kvt: 'Мощность подключения (кВт)',
  parovarka_rezhim_konservirovanie: 'Режим консервирования',
  parovarka_rezhim_suvid: 'Режим Су-вид',

  // Warming drawers
  podogrev_minimalnaya_temperatura_s: 'Минимальная температура (°C)',
  podogrev_maksimalnaya_temperatura_s: 'Максимальная температура (°C)',
  podogrev_teleskopicheskie_napravlyayuwie: 'Телескопические направляющие',
  podogrev_programma_prigotovleniya_testa: 'Программа приготовления теста',
  podogrev_maksimalnaya_zagruzka_v_komplektah: 'Максимальная загрузка (комплектов)',

  // Wine glasses & Tableware
  bokal_obem_ml: 'Объем (мл)',
  bokal_kolichestvo_bokalov_v_nabore: 'Количество бокалов в наборе',
  bokal_kollekciya: 'Коллекция',
  bokal_napitok: 'Напиток',
  bokal_material: 'Материал',
  bokal_strana_proizvodstva: 'Страна производства',
  bokal_ruchnaya_rabota: 'Ручная работа',
  bokal_dekanter_v_nabore: 'Декантер в наборе',
  dekanter_obem_ml: 'Объем (мл)',
  dekanter_material: 'Материал',
  dekanter_ruchnaya_rabota: 'Ручная работа',

  posuda_diametr_sm: 'Диаметр (см)',
  posuda_obem_l: 'Объем (л)',
  posuda_material: 'Материал',
  posuda_kryshka_v_komplekte: 'Крышка в комплекте',
  posuda_antiprigarnoe_pokrytie: 'Антипригарное покрытие',
  posuda_podhodit_dlya_vseh_tipov_plit: 'Подходит для всех типов плит',
  posuda_mozhno_ispolzovat_v_duhovke: 'Можно использовать в духовке',
  posuda_mozhno_myt_v_posudomoechnoj_mashine: 'Можно мыть в посудомоечной машине',

  // Irons & Steamers
  utyug_maksimalnaya_potreblyaemaya_mownost_vt: 'Максимальная потребляемая мощность (Вт)',
  utyug_intensivnost_para_gmin: 'Интенсивность подачи пара (г/мин)',
  utyug_vertikalnoe_otparivanie: 'Вертикальное отпаривание',
  utyug_material_podoshvy: 'Материал подошвы',
  utyug_obem_rezervuara_dlya_vody_ml: 'Объем резервуара для воды (мл)',
  utyug_avtomaticheskoe_otklyuchenie: 'Автоматическое отключение',
  utyug_sistema_zawity_ot_nakipi: 'Система защиты от накипи',
  utyug_protivokapelnaya_sistema: 'Противокапельная система',
  utyug_nasadka_dly_delikatnih_tkanei: 'Насадка для деликатных тканей',

  // Climate & Air
  vozduh_plowad_pomeweniya_kvm: 'Площадь помещения (м²)',
  vozduh_mownost_vt: 'Мощность (Вт)',
  vozduh_maks_rashod_vody_gch: 'Расход воды (г/ч)',
  vozduh_tip_upravleniya: 'Тип управления',
  vozduh_obem_rezervuara_l: 'Объем резервуара (л)',
  vozduh_aromatizaciya: 'Ароматизация',
  vozduh_ionizaciya: 'Ионизация',
  vozduh_proizvoditelnost_kubmch: 'Производительность (м³/ч)',
  vozduh_tip_uvlazhneniya: 'Тип увлажнения',
  vozduh_antibakterialnyj_filtr: 'Антибактериальный фильтр',
  vozduh_proizvoditelnost_osusheniya_lsutki: 'Производительность осушения (л/сутки)',
  vozduh_gigrostat: 'Гигростат',
  vozduh_teplyj_par: 'Теплый пар',
  vozduh_ugolnyj_filtr: 'Угольный фильтр',
  vozduh_hepa_filtr: 'HEPA фильтр',
  vozduh_podstvetka_nochnik: 'Подсветка-ночник',

  konder_plowad_pomeweniya: 'Площадь помещения (м²)',
  konder_rezhimy_raboty: 'Режимы работы',
  konder_pult_du: 'Пульт ДУ',
  konder_funkciya_osusheniya: 'Функция осушения',
  konder_nochnoj_rezhim: 'Ночной режим',
  konder_maksimalnaya_potreblyaemaya_mownost_kvt: 'Максимальная потребляемая мощность (кВт)',
  konder_proizvoditelnost_ohlazhdenie_kvt: 'Производительность охлаждения (кВт)',
  konder_proizvoditelnost_obogrev_kvt: 'Производительность обогрева (кВт)',
  konder_uroven_shuma_vnutrennego_bloka_db: 'Уровень шума внутреннего блока (дБ)',
  konder_invertornoe_upravlenie: 'Инверторное управление',
  konder_funkciya_ionizacii: 'Функция ионизации',

  // Grills & Toaster ovens
  gril_mownost_vt: 'Мощность (Вт)',
  gril_semnye_paneli: 'Съемные панели',
  gril_lotok_dlya_sbora_zhira: 'Лоток для сбора жира',
  gril_tajmer: 'Таймер',
  gril_kolichestvo_rezhimov_nagreva: 'Количество режимов нагрева',
  gril_upravlenie: 'Управление',
  gril_raskrytie_na_180_gradusov: 'Раскрытие на 180 градусов',

  mini_pech_obem_kamery_l: 'Объем камеры (л)',
  mini_pech_mownost_kvt: 'Мощность (кВт)',
  mini_pech_kolichestvo_rezhimov_nagreva: 'Количество режимов нагрева',
  mini_pech_gril: 'Гриль',
  mini_pech_konvekciya: 'Конвекция',
  mini_pech_upravlenie: 'Управление',
  mini_pech_tajmer: 'Таймер',
  mini_pech_vnutrennee_pokrytie_kamery: 'Внутреннее покрытие камеры',
  mini_pech_maksimalnaya_temperatura_nagreva: 'Максимальная температура нагрева (°C)',
  mini_pech_avtomaticheskie_programmy: 'Автоматические программы',
  mini_pech_displej: 'Дисплей',
  mini_pech_prigotovlenie_na_paru: 'Приготовление на пару',

  // Coffee grinders, Foamer, Scales, Ice maker
  molka_material_nozhej: 'Материал ножей',
  molka_material_korpusa: 'Материал корпуса',
  molka_mownost_vt: 'Мощность (Вт)',
  molka_zagruzka_kofe_v_zernah: 'Загрузка кофе в зернах (г)',
  molka_sistema_pomola: 'Система помола',
  molka_sjemny_rezervuar_dlya_molotogo_kofe: 'Съемный резервуар для молотого кофе',
  molka_regulirovka_stepeni_pomola: 'Регулировка степени помола',
  molka_dlina_shnura_m: 'Длина шнура (м)',
  molka_blokirovka_vklyucheniya_pri_snyatoj_kryshke: 'Блокировка включения при снятой крышке',

  vspen_obem_chashi_ml: 'Объем чаши (мл)',
  vspen_rezhimy_raboty: 'Режимы работы',
  vspen_maks_obem_moloka_ml: 'Макс. объем молока (мл)',
  vspen_material_chashi: 'Материал чаши',
  vspen_kolichestvo_nasadok: 'Количество насадок',
  vspen_pitanie: 'Питание',
  vspen_semnaya_chasha: 'Съемная чаша',
  vspen_mownost_vt: 'Мощность (Вт)',

  vesy_maksimalnaya_nagruzka_kg: 'Максимальная нагрузка (кг)',
  vesy_sohranenie_v_pamyati: 'Сохранение в памяти',
  vesy_pitanie: 'Питание',
  vesy_avtootklyuchenie: 'Автоотключение',
  vesy_naznachenie: 'Назначение',
  vesy_material_korpusa: 'Материал корпуса',
  vesy_diagnostika: 'Диагностика',

  ice_proizvoditelnost_kgsutki: 'Производительность (кг/сутки)',
  ice_mownost_podklyucheniya_vt: 'Мощность подключения (Вт)',
  ice_vremya_prigotovleniya_porcii_min: 'Время приготовления порции (мин)',

  // Cleaners, Steam stations, etc.
  gladil_dlina_gladilnogo_vala_sm: 'Длина гладильного вала (см)',
  gladil_davlenie_para_bar: 'Давление пара (бар)',
  gladil_prizhimnoe_davlenie_vala_n_sm: 'Прижимное давление вала (Н/см²)',
  gladil_aktivnyj_gladilnyj_stol: 'Активный гладильный стол',
  gladil_obem_rezervuara_dlya_vody_ml: 'Объем резервуара для воды (мл)',
  gladil_vertikalnoe_otparivanie: 'Вертикальное отпаривание',
  gladil_avtomaticheskoe_udalenie_nakipi: 'Автоматическое удаление накипи',
  gladil_potreblyaemaya_mownost: 'Потребляемая мощность (Вт)',
};

// Fallback auto-translator for any other transliterated column slug
function slugToHumanLabel(slug: string): string {
  if (CANONICAL_LABELS[slug]) return CANONICAL_LABELS[slug];

  let clean = slug.replace(/^[a-z0-9_-]+?_/, '');

  const unitReplacements: [RegExp, string][] = [
    [/_kvt$/, ' (кВт)'],
    [/_vt$/, ' (Вт)'],
    [/_db$/, ' (дБ)'],
    [/_kg$/, ' (кг)'],
    [/_sm$/, ' (см)'],
    [/_mm$/, ' (мм)'],
    [/_ml$/, ' (мл)'],
    [/_l$/, ' (л)'],
    [/_bar$/, ' (бар)'],
    [/_obmin$/, ' (об/мин)'],
    [/_m$/, ' (м)'],
    [/_lsutki$/, ' (л/сутки)'],
    [/_lmin$/, ' (л/мин)'],
    [/_gmin$/, ' (г/мин)'],
    [/_gch$/, ' (г/ч)'],
    [/_kubmch$/, ' (м³/ч)'],
    [/_kvm$/, ' (м²)'],
    [/_kvtchgod$/, ' (кВтч/год)'],
    [/_kvtch$/, ' (кВтч)'],
  ];

  let unitSuffix = '';
  for (const [regex, suffix] of unitReplacements) {
    if (regex.test(clean)) {
      clean = clean.replace(regex, '');
      unitSuffix = suffix;
      break;
    }
  }

  const dict: Record<string, string> = {
    maksimalnaya: 'Максимальная',
    maksimalnyj: 'Максимальный',
    maks: 'Макс.',
    potreblyaemaya: 'потребляемая',
    moshchnost: 'мощность',
    mownost: 'мощность',
    kolichestvo: 'Количество',
    kolvo: 'Количество',
    rezhimov: 'режимов',
    rezhim: 'Режим',
    rezhimy: 'Режимы',
    raboty: 'работы',
    tostov: 'тостов',
    reshetka: 'Решетка',
    dlya: 'для',
    bulochek: 'булочек',
    podogrev: 'Подогрев',
    razmorozka: 'Разморозка',
    proizvoditelnost: 'Производительность',
    diametr: 'Диаметр',
    patrubka: 'патрубка воздуховода',
    material: 'Материал',
    korpusa: 'корпуса',
    vnutrennej: 'внутренней',
    stenki: 'стенки',
    skorostej: 'скоростей',
    upravlenie: 'Управление',
    osvewenie: 'Освещение',
    uroven: 'Уровень',
    shuma: 'шума',
    zagruzka: 'Загрузка',
    belya: 'белья',
    klass: 'Класс',
    energopotrebleniya: 'энергопотребления',
    energo: 'энергопотребления',
    stirki: 'стирки',
    otzhima: 'отжима',
    skorost: 'скорость',
    vraweniya: 'вращения',
    pri: 'при',
    zawita: 'Защита',
    ot: 'от',
    protechek: 'протечек',
    programm: 'программ',
    dozagruzka: 'Дозагрузка',
    otstrochka: 'Отсрочка',
    starta: 'старта',
    invertornyj: 'Инверторный',
    dvigatel: 'двигатель',
    funkciya: 'Функция',
    par: 'пар',
    obem: 'Объем',
    chashi: 'чаши',
    kontejnera: 'контейнера',
    vody: 'воды',
    podklyucheniya: 'подключения',
    gril: 'Гриль',
    konvekciya: 'Конвекция',
    pereklyuchateli: 'Переключатели',
    tajmer: 'Таймер',
    displej: 'Дисплей',
    teleskopicheskie: 'Телескопические',
    napravlyayuwie: 'направляющие',
    chislo: 'Число',
    stekol: 'стекол',
    dvercy: 'дверцы',
    ochistka: 'Очистка',
    avtomaticheskie: 'Автоматические',
    programmy: 'программы',
    nagreva: 'нагрева',
    kamery: 'камеры',
    pokrytie: 'Покрытие',
    morozilnaya: 'Морозильная',
    kamera: 'камера',
    kompressorov: 'компрессоров',
    kamer: 'камер',
    zona: 'Зона',
    svezhesti: 'свежести',
    no: 'No',
    frost: 'Frost',
    superzamorozka: 'Суперзаморозка',
    superohlazhdenie: 'Суперохлаждение',
    obwij: 'Общий',
    holodilnoj: 'холодильной',
    morozilnoj: 'морозильной',
    vozmozhnost: 'Возможность',
    perevesit: 'перенавески',
    dver: 'двери',
    davlenie: 'Давление',
    pompy: 'помпы',
    kapuchinator: 'Капучинатор',
    vmestimost: 'Вместимость',
    mojki: 'мойки',
    sushki: 'сушки',
    tip: 'Тип',
    rashod: 'Расход',
    cikl: 'цикл',
    lotok: 'Лоток',
    stolovyh: 'столовых',
    priborov: 'приборов',
    korzin: 'корзин',
    avtootkryvanie: 'Автооткрывание',
    chash: 'чаш',
    sliva: 'слива',
    otverstie: 'Отверстие',
    pod: 'под',
    smesitel: 'смеситель',
    kryla: 'крыла',
    nalichie: 'Наличие',
    povorotnyj: 'Поворотный',
    izliv: 'излив',
    vydvizhnoj: 'Выдвижной',
    filtr: 'Фильтр',
  };

  const words = clean.split('_').map((w) => dict[w] || w);
  let res = words.join(' ');
  res = res.charAt(0).toUpperCase() + res.slice(1);
  return res + unitSuffix;
}

async function main() {
  console.log('🚀 Starting Full Restart and Synchronization of Product Characteristics...');
  const start = Date.now();

  const csvPath = 'C:\\Users\\trash\\.gemini\\antigravity\\brain\\e8fbc5f5-4ac1-458b-bb14-a46d4efd4a35\\scratch\\old_site_catalog_export';
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Export CSV file not found at: ${csvPath}`);
  }

  // 1. Read CSV with windows-1251 decoding
  console.log('📦 Reading and decoding CSV export...');
  const buffer = fs.readFileSync(csvPath);
  const text = new TextDecoder('windows-1251').decode(buffer);
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(';').map((h) => h.trim());
  console.log(`Found ${lines.length} lines, ${headers.length} columns in CSV.`);

  // 2. Read existing products from master dump
  const gzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  if (!fs.existsSync(gzPath)) {
    throw new Error(`Master catalog dump not found at: ${gzPath}`);
  }

  console.log('📦 Reading data/exported_catalog_products.json.gz...');
  const rawData = zlib.gunzipSync(fs.readFileSync(gzPath)).toString('utf8');
  const products = JSON.parse(rawData);
  console.log(`Found ${products.length} products in master dump.`);

  // Map products by 1C Code (id)
  const productMap = new Map<string, any>();
  products.forEach((p: any) => productMap.set(String(p.id).trim(), p));

  // 3. Process every CSV line and update product characteristics
  let matchedCount = 0;
  let updatedFeaturesCount = 0;
  let updatedStockRemoteCount = 0;
  let updatedDimensionsCount = 0;
  let updatedColorCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(';');
    const kod = parts[0]?.replace(/^"|"$/g, '').trim();
    if (!kod || isNaN(Number(kod)) || Number(kod) <= 0) continue;

    const prod = productMap.get(kod);
    if (!prod) continue;

    matchedCount++;

    const newFeatures: Array<{ label: string; value: string }> = [];
    let color: string | null = null;
    let width = '';
    let height = '';
    let depth = '';
    let stockRemote = 0;

    for (let j = 0; j < Math.min(parts.length, headers.length); j++) {
      const h = headers[j];
      const rawVal = parts[j]?.replace(/^"|"$/g, '').trim();
      if (!rawVal) continue;

      if (h === 'kod' || h === 'descr') continue;

      if (h === 'udalennyj_sklad') {
        const val = parseInt(rawVal, 10) || 0;
        if (val > 0) stockRemote = val;
        continue;
      }

      if (h === 'cvet') {
        color = rawVal;
      }

      // Collect dimensions
      if (h === 'width') width = fixExcelDecimal(rawVal);
      if (h === 'height') height = fixExcelDecimal(rawVal);
      if (h === 'depth' || h === 'length') depth = fixExcelDecimal(rawVal);

      // Handle value formatting
      let val = rawVal;
      if (val === '1') {
        val = 'есть';
      } else if (val === '0') {
        continue; // Rule: skip '0' values
      } else {
        val = fixExcelDecimal(val);
      }

      const label = CANONICAL_LABELS[h] || slugToHumanLabel(h);
      newFeatures.push({ label, value: val });
    }

    // Apply updates to product object
    if (newFeatures.length > 0) {
      prod.features = newFeatures;
      updatedFeaturesCount++;
    }

    if (stockRemote > 0) {
      prod.stockRemote = stockRemote;
      updatedStockRemoteCount++;
    }

    if (color && !prod.color) {
      prod.color = color;
      updatedColorCount++;
    }

    if (width || height || depth) {
      const w = width || (prod.dimensions?.match(/(\d+(?:\.\d+)?)\s*(?:x|×)/i)?.[1] ?? '');
      const h = height || (prod.dimensions?.match(/(?:x|×)\s*(\d+(?:\.\d+)?)\s*(?:x|×)/i)?.[1] ?? '');
      const d = depth || (prod.dimensions?.match(/(?:x|×)\s*(?:[^\s×x]+\s*(?:x|×)\s*)?(\d+(?:\.\d+)?)\s*см/i)?.[1] ?? '');
      
      if (w || h || d) {
        prod.dimensions = `${w || '?'} × ${h || '?'} × ${d || '?'} см`;
        updatedDimensionsCount++;
      }
    }
  }

  console.log(`\n📊 Processed CSV matches:`);
  console.log(`Matched products: ${matchedCount}`);
  console.log(`Updated features count: ${updatedFeaturesCount}`);
  console.log(`Updated stockRemote count: ${updatedStockRemoteCount}`);
  console.log(`Updated dimensions count: ${updatedDimensionsCount}`);
  console.log(`Updated colors count: ${updatedColorCount}`);

  // 4. Save backup and overwrite data/exported_catalog_products.json.gz
  const backupPath = path.join(process.cwd(), 'data', `exported_catalog_products.backup_features_${Date.now()}.json.gz`);
  fs.copyFileSync(gzPath, backupPath);
  console.log(`💾 Backup saved to: ${path.basename(backupPath)}`);

  const updatedGz = zlib.gzipSync(Buffer.from(JSON.stringify(products), 'utf8'));
  fs.writeFileSync(gzPath, updatedGz);
  console.log('✅ Overwritten data/exported_catalog_products.json.gz with new characteristics.');

  // 5. Update SQLite database in batches
  console.log('🧹 Updating SQLite database products with new characteristics and fields...');
  const batchSize = 100;
  let dbUpdated = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const chunk = products.slice(i, i + batchSize);
    await prisma.$transaction(
      chunk.map((p: any) =>
        prisma.product.update({
          where: { id: p.id },
          data: {
            featuresJson: JSON.stringify(p.features || []),
            dimensions: p.dimensions || null,
            color: p.color || null,
            stockRemote: Number(p.stockRemote) || 0,
          },
        })
      )
    );
    dbUpdated += chunk.length;
    if (dbUpdated % 1000 === 0 || dbUpdated === products.length) {
      console.log(`  -> Updated ${dbUpdated} / ${products.length} products in SQLite...`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✨ Successfully finished characteristics synchronization in ${elapsed}s!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during characteristics synchronization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
