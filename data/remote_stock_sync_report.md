# Отчет о синхронизации удаленного склада (SIMONA-BT)

- **Дата и время**: 2026-10-28 14:29:32
- **Режим**: LIVE PRODUCTION
- **Порог наличия**: $\ge 5$ шт.
- **Обработано файлов поставщиков**: 15
- **Всего строк в файлах поставщиков**: 6782
- **Сопоставлено строк**: 1970
- **Пропущено строк (нет в каталоге)**: 4812

## Сводка по товарам каталога

| Метрика | Количество |
|---|---:|
| Переведено в статус «На удаленном складе» (`REMOTE_STOCK`) | **731** |
| Сохранен статус «На складе» в НН (`LOCAL_STOCK` priority) | **505** |
| Сохранен статус «На витрине» (`SHOWROOM` priority) | **52** |
| Сброшено в «Под заказ» (`ON_ORDER`, остаток < 5 шт.) | **339** |
| Всего изменений в базе данных | **1422** |

### Примеры товаров, получивших статус «На удаленном складе» (топ-15):

| 1C Код | Бренд | Артикул | Наименование | Остаток поставщика |
|---|---|---|---|---:|
| 89135 | KORTING | KD60HP83 | Сушильная машина KORTING KD 60HP83 | 100 шт. |
| 79013 | KORTING | KMO720X | Микроволновая печь KORTING KMO 720 X | 100 шт. |
| 85624 | EVELUX | ECFA2121 | Фильтр EVELUX ECFA 2121 | 100 шт. |
| 79016 | KORTING | DSK150 | Аксессуар для стиральной машины KORTING DSK 150 | 100 шт. |
| 78681 | KORTING | HGG6805CW | Газовая варочная панель KORTING HGG 6805 CW | 5 шт. |
| 85720 | ELICA | VERITASBI36BL | Встраиваемый винный шкаф ELICA VERITAS BI36 BL | 17 шт. |
| 88824 | GRAUDE | MWG38.0S | Встраиваемая микроволновая печь GRAUDE MWG 38.0 S | 5 шт. |
| 78953 | KORTING | KNFR1837X | Морозильник KORTING KNFR 1837 X | 10 шт. |
| 85898 | EVELUX | EWI61408 | Встраиваемая стиральная машина EVELUX EWI 61408 | 9 шт. |
| 90598 | SCHULTHESS | 52202МОНТАЖНЫЙКОМПЛЕКТБЕЗВЫДВИЖНОЙПОЛКИ | Соединительная полка SCHULTHESS 52202 Монтажный комплект без выдвижной полки | 5 шт. |
| 91505 | JACKYS | СОЕДИНИТЕЛЬНЫЙКИТ3.0 | Соединительная полка JACKYS Соединительный кит 3.0 | 30 шт. |
| 72080 | GRAUDE | MWG45.0E | Компактный духовой шкаф с микроволновкой GRAUDE MWG 45.0 E | 5 шт. |
| 88837 | ELICA | VIRTUSMULTI60TFTBL | Электрический духовой шкаф ELICA VIRTUS MULTI 60 TFT BL | 43 шт. |
| 75440 | SMEG | LSIA147S | Встраиваемая стирально-сушильная машина SMEG LSIA 147S | 5 шт. |
| 88723 | KORTING | KWK0904INFINITY | Электрический чайник KORTING KWK 0904 Infinity | 100 шт. |

### Примеры товаров, сброшенных в «Под заказ» (топ-10):

| 1C Код | Бренд | Артикул | Наименование |
|---|---|---|---|
| 84891 | VARD | VMC355HK | Встраиваемая микроволновая печь VARD VMC 355HK |
| 84912 | VARD | VWF494 | Полноразмерная стиральная машина VARD VWF 494 |
| 89051 | VARD | WCI4SSTB | Встраиваемый винный шкаф VARD WCI 4SSTB |
| 90983 | HIBERG | IDDQ10814W | Полноразмерная стиральная машина HIBERG i-DDQ10-814W |
| 83764 | KUPPERSBERG | FG63W | Газовая варочная панель KUPPERSBERG FG 63W |
| 91177 | KUPPERSBERG | RBW86 | Встраиваемый винный шкаф KUPPERSBERG RBW 86 |
| 84908 | VARD | VCC5K | Встраиваемая кофемашина VARD VCC 5K |
| 87148 | EVELUX | MW203X | Микроволновая печь EVELUX MW 203 X |
| 90145 | HAIER | HDB4H7A2TBEXRU | Сушильная машина HAIER HDB4 H7A2TBEX-RU |
| 85035 | KORTING | KCM9200BG | Встраиваемая кофемашина KORTING KCM 9200 BG |

### Примеры позиций поставщиков, отсутствующих в каталоге СИМОНЫ:

- `AEG HGB64420SM (stock=16, file=AEG_Haier_Midea.xls)`
- `AEG HKB64420NB (stock=98, file=AEG_Haier_Midea.xls)`
- `AEG HKB64453NB (stock=0, file=AEG_Haier_Midea.xls)`
- `AEG HKB75453NB (stock=0, file=AEG_Haier_Midea.xls)`
- `HAIER HHQ-M64CAQX (stock=4, file=AEG_Haier_Midea.xls)`
- `HAIER HHQ-M64CTB (stock=1, file=AEG_Haier_Midea.xls)`
- `HAIER HHQ-M64CTPX (stock=0, file=AEG_Haier_Midea.xls)`
- `HAIER HHQ-M64CTQX (stock=0, file=AEG_Haier_Midea.xls)`
- `HAIER HHQ-M64CTX (stock=2, file=AEG_Haier_Midea.xls)`
- `HAIER HHQ-M64CX (stock=0, file=AEG_Haier_Midea.xls)`
