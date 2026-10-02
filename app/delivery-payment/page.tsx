'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconDelivery,
  SimonaIconGuarantee,
  SimonaIconBuilding,
  SimonaIconCheck,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';
import {
  Truck,
  CreditCard,
  QrCode,
  FileSpreadsheet,
  Banknote,
  Percent,
  Calendar,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Info,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function DeliveryPaymentPage() {
  // Calculator state
  const [calcDest, setCalcDest] = useState<'nn' | 'oblast_1' | 'oblast_2' | 'russia'>('nn');
  const [calcOrderAmount, setCalcOrderAmount] = useState<number>(65000);
  const [calcUnits, setCalcUnits] = useState<number>(3);
  const [hasSideBySide, setHasSideBySide] = useState<boolean>(false);
  const [hasManualLift, setHasManualLift] = useState<boolean>(false);
  const [manualFloor, setManualFloor] = useState<number>(3);

  // Calculate pricing
  const calculateTotal = () => {
    if (calcDest === 'russia') {
      return { isTK: true, cost: 0 };
    }

    if (calcDest === 'nn') {
      if (calcOrderAmount >= 50000) {
        let extra = 0;
        if (hasSideBySide) extra += 1000;
        if (hasManualLift) extra += (calcUnits * 150 + (hasSideBySide ? 150 : 0)) * Math.max(0, manualFloor - 1);
        return { isFree: extra === 0, cost: extra, baseFree: true };
      }
      let base = 1000;
      if (calcUnits >= 4 && calcUnits <= 6) base = 1500;
      if (calcUnits > 6) base = 2000;
      if (hasSideBySide) base += 1000;
      if (hasManualLift) base += (calcUnits * 150 + (hasSideBySide ? 150 : 0)) * Math.max(0, manualFloor - 1);
      return { isFree: false, cost: base };
    }

    if (calcDest === 'oblast_1') {
      let base = 1700;
      if (calcUnits >= 4 && calcUnits <= 6) base = 2200;
      if (calcUnits > 6) base = 2700;
      if (hasSideBySide) base += 1000;
      if (hasManualLift) base += (calcUnits * 150 + (hasSideBySide ? 150 : 0)) * Math.max(0, manualFloor - 1);
      return { isFree: false, cost: base };
    }

    if (calcDest === 'oblast_2') {
      let base = 2700;
      if (calcUnits >= 4 && calcUnits <= 6) base = 3300;
      if (calcUnits > 6) base = 3600;
      if (hasSideBySide) base += 1000;
      if (hasManualLift) base += (calcUnits * 150 + (hasSideBySide ? 150 : 0)) * Math.max(0, manualFloor - 1);
      return { isFree: false, cost: base };
    }

    return { isFree: false, cost: 1000 };
  };

  const result = calculateTotal();

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              Логистика и расчеты
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Условия доставки и варианты оплаты
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Собственная служба доставки «СИМОНА» с аккуратным подъемом в квартиру, бесплатное хранение на центральном складе до 6 месяцев и безопасные онлайн-платежи с соблюдением 54-ФЗ.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#calculator"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>Рассчитать стоимость доставки</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#payment-methods"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition"
              >
                <CreditCard className="w-4 h-4 text-simona-teal" />
                <span>Способы оплаты</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Delivery Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Собственная служба</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Штатный экипаж экспедиторов, обученный деликатной транспортировке премиальных стеклокерамических и эмалированных приборов.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">2-часовой интервал</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Не нужно ждать весь день: согласуем точный двухчасовой слот прибытия, а за 1 час водитель предупредит вас звонком.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Занос и распаковка</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Занесем приборы в квартиру, распакуем, проверим стекла и целостность при вас, а упаковку аккуратно вывезем.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <SimonaIconBuilding className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Хранение 6 месяцев</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Идет ремонт? Оплаченная техника бесплатно хранится на нашем сухом охраняемом складе до полугода с фиксацией цены.
            </p>
          </div>
        </div>

        {/* Interactive Delivery Calculator (Split Layout) */}
        <div id="calculator" className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="border-b border-[#2B313A] pb-4 text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Калькулятор тарифов</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Расчет стоимости доставки
            </h2>
            <p className="text-xs text-[#87888A]">
              Прозрачные тарифы без скрытых доплат. При сумме заказа от 50 000 ₽ по Нижнему Новгороду — доставка бесплатна!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Destination Selector */}
              <div>
                <label className="block text-xs font-semibold text-white mb-2">Зона доставки:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCalcDest('nn')}
                    className={`p-3 rounded-xl border text-left transition ${
                      calcDest === 'nn'
                        ? 'bg-simona-teal/10 border-simona-teal text-white'
                        : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Нижний Новгород</div>
                    <div className="text-[11px] text-[#87888A] mt-0.5">В пределах города (ежедневно, кроме вт)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcDest('oblast_1')}
                    className={`p-3 rounded-xl border text-left transition ${
                      calcDest === 'oblast_1'
                        ? 'bg-simona-teal/10 border-simona-teal text-white'
                        : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Область: Зона 1 (до 50 км)</div>
                    <div className="text-[11px] text-[#87888A] mt-0.5">Дзержинск, Кстово, Бор, Богородск, Балахна</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcDest('oblast_2')}
                    className={`p-3 rounded-xl border text-left transition ${
                      calcDest === 'oblast_2'
                        ? 'bg-simona-teal/10 border-simona-teal text-white'
                        : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Область: Зона 2 (51–100 км)</div>
                    <div className="text-[11px] text-[#87888A] mt-0.5">Арзамас, Городец, Заволжье, Павлово</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcDest('russia')}
                    className={`p-3 rounded-xl border text-left transition ${
                      calcDest === 'russia'
                        ? 'bg-simona-teal/10 border-simona-teal text-white'
                        : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Другие регионы РФ</div>
                    <div className="text-[11px] text-[#87888A] mt-0.5">Транспортные компании (СДЭК, ДЛ, ПЭК)</div>
                  </button>
                </div>
              </div>

              {calcDest !== 'russia' ? (
                <>
                  {/* Order Amount & Units */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-white">Сумма заказа:</label>
                        <span className="text-xs font-mono text-simona-teal font-bold">{calcOrderAmount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="200000"
                        step="5000"
                        value={calcOrderAmount}
                        onChange={(e) => setCalcOrderAmount(Number(e.target.value))}
                        className="w-full accent-simona-teal cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-[#87888A] mt-1">
                        <span>10 000 ₽</span>
                        <span className="text-emerald-400">Бесплатно от 50 000 ₽</span>
                        <span>200 000 ₽</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-white">Количество единиц техники:</label>
                        <span className="text-xs font-mono text-white font-bold">{calcUnits} шт.</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={calcUnits}
                        onChange={(e) => setCalcUnits(Number(e.target.value))}
                        className="w-full accent-simona-teal cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-[#87888A] mt-1">
                        <span>1 шт.</span>
                        <span>4–6 шт.</span>
                        <span>10 шт.</span>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] cursor-pointer hover:border-simona-teal/50 transition">
                      <input
                        type="checkbox"
                        checked={hasSideBySide}
                        onChange={(e) => setHasSideBySide(e.target.checked)}
                        className="w-4 h-4 rounded text-simona-teal accent-simona-teal"
                      />
                      <div className="text-xs">
                        <span className="text-white font-medium">В заказе есть широкий холодильник Side-by-Side</span>
                        <span className="text-[#87888A] block text-[11px]">+1 000 ₽ к подъему крупногабарита</span>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] cursor-pointer hover:border-simona-teal/50 transition">
                      <input
                        type="checkbox"
                        checked={hasManualLift}
                        onChange={(e) => setHasManualLift(e.target.checked)}
                        className="w-4 h-4 rounded text-simona-teal accent-simona-teal"
                      />
                      <div className="text-xs">
                        <span className="text-white font-medium">Ручной подъем без грузового лифта</span>
                        <span className="text-[#87888A] block text-[11px]">150 ₽ за этаж/прибор со 2-го этажа</span>
                      </div>
                    </label>

                    {hasManualLift && (
                      <div className="pl-6 pt-1 flex items-center space-x-3">
                        <span className="text-xs text-[#87888A]">Этаж подъема:</span>
                        <input
                          type="number"
                          min="2"
                          max="25"
                          value={manualFloor}
                          onChange={(e) => setManualFloor(Number(e.target.value))}
                          className="w-20 px-3 py-1.5 rounded-lg bg-[#16191D] border border-[#2B313A] text-white text-xs font-mono text-center focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-5 rounded-2xl bg-[#1E2228] border border-[#2B313A] space-y-3 text-xs">
                  <div className="flex items-center space-x-2 text-simona-teal font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Стандарты межрегиональной отправки:</span>
                  </div>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex items-start gap-2">
                      <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                      <span>Отгружаем надежными федеральными перевозчиками: СДЭК (малый габарит), Деловые Линии, ПЭК (встройка и крупный габарит).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                      <span><strong>Обязательная жесткая деревянная обрешетка</strong> каждого места: гарантирует целостность стекла и корпусов.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                      <span><strong>100% страхование груза</strong> на полную стоимость заказа. В случае форс-мажора в пути — риски компенсируются без волокиты.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                      <span>Стоимость доставки рассчитывается по тарифам ТК и оплачивается при получении на терминале либо курьеру «до двери».</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Result Box (5 Cols) */}
            <div className="lg:col-span-5 bg-[#1E2228] border border-[#2B313A] rounded-2xl p-6 sm:p-7 space-y-5">
              <span className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider block">
                Итоговый расчет:
              </span>

              {calcDest !== 'russia' ? (
                <>
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-montserrat font-bold text-white">
                      {result.cost === 0 ? (
                        <span className="text-emerald-400">Бесплатно</span>
                      ) : (
                        <span>{result.cost.toLocaleString('ru-RU')} ₽</span>
                      )}
                    </div>
                    <div className="text-xs text-[#87888A]">
                      {calcDest === 'nn' && result.cost === 0 && 'Акция: бесплатная доставка при заказе от 50 000 ₽'}
                      {calcDest === 'nn' && result.cost > 0 && 'Доставка до двери с заносом в квартиру'}
                      {calcDest.startsWith('oblast') && 'Доставка по области (по вторникам) до двери'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2B313A] space-y-2 text-xs">
                    <div className="flex justify-between text-[#87888A]">
                      <span>Направление:</span>
                      <span className="text-white font-medium">
                        {calcDest === 'nn' ? 'Нижний Новгород' : calcDest === 'oblast_1' ? 'Область (до 50 км)' : 'Область (51–100 км)'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#87888A]">
                      <span>Приборов в заказе:</span>
                      <span className="text-white font-medium">{calcUnits} шт.</span>
                    </div>
                    <div className="flex justify-between text-[#87888A]">
                      <span>Дни доставки:</span>
                      <span className="text-white font-medium">
                        {calcDest === 'nn' ? 'Ежедневно (кроме вт)' : 'Вторник (весь день)'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#87888A]">
                      <span>Интервал времени:</span>
                      <span className="text-simona-teal font-medium">Точное 2-часовое окно</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-2xl font-montserrat font-bold text-white">
                    По тарифам ТК
                  </div>
                  <p className="text-xs text-[#87888A] leading-relaxed">
                    Наш менеджер подберет оптимальную транспортную компанию по срокам и стоимости, оформит жесткую упаковку и пришлет накладную для отслеживания.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/catalog"
                  className="w-full py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide text-center block transition shadow-lg shadow-simona-teal/20"
                >
                  Перейти к выбору техники
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-[#16191D] border border-[#2B313A] text-[11px] text-[#87888A] flex items-start gap-2">
                <Info className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                <span>
                  Самовывоз с центрального склада (ул. Коминтерна, 27) — всегда <strong>бесплатно</strong> независимо от суммы.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Payment Methods Section */}
        <div id="payment-methods" className="space-y-8">
          <div className="text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Финансовый контур</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Способы и безопасность оплаты
            </h2>
            <p className="text-xs text-[#87888A]">
              Все платежи защищены 256-битным SSL-шифрованием и полностью соответствуют требованиям 54-ФЗ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Method 1: Online YooKassa */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-white">
                Банковской картой онлайн
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Мгновенная оплата при оформлении заказа в корзине через защищенный шлюз ЮKassa. Принимаются карты МИР, Visa, Mastercard, Maestro любого банка РФ.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2B313A]/60">
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Без комиссии для покупателя</span>
                </li>
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Электронный фискальный чек 54-ФЗ на email и SMS</span>
                </li>
              </ul>
            </div>

            {/* Method 2: SBP */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-white">
                Система быстрых платежей (СБП)
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Оплата по динамическому QR-коду за секунды прямо в мобильном приложении вашего банка без ввода реквизитов карты.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2B313A]/60">
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Поддерживают все ведущие банки России</span>
                </li>
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Мгновенное подтверждение и резервирование товара</span>
                </li>
              </ul>
            </div>

            {/* Method 3: B2B Invoicing */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-white">
                Безналичный расчет (юрлица и ИП)
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Выставление счета с НДС или без НДС. Работаем по договорам поставки, предоставляем полный комплект закрывающих документов УПД через ЭДО (Диадок / СБИС).
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2B313A]/60">
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Спецификации под тендеры и дизайн-проекты</span>
                </li>
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Фиксация стоимости приборов в договоре</span>
                </li>
              </ul>
            </div>

            {/* Method 4: Salon Terminal & Cash */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-white">
                Оплата в салоне «СИМОНА»
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Оплачивайте наличными или банковской картой через POS-терминал во время визита во флагманский салон на ул. Белинского, 15 после живого знакомства с приборами.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2B313A]/60">
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Кассовый чек и гарантийный талон сразу на руки</span>
                </li>
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Возможность внесения предоплаты по заказным позициям</span>
                </li>
              </ul>
            </div>

            {/* Method 5: Installments & Split */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-white">
                Рассрочка и оплата частями
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Комфортные программы финансирования от банков-партнеров без первого взноса и переплат на срок от 3 до 12 месяцев.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2B313A]/60">
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Быстрое решение онлайн без визита в банк</span>
                </li>
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Честные условия без скрытых страховок</span>
                </li>
              </ul>
            </div>

            {/* Method 6: Prepayment Policy */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-white">
                Заказные позиции и предоплата
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                На товары из наличия действует постоплата или предоплата по вашему выбору. Для эксклюзивных заказных позиций европейских фабрик оформляется договор поставки.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#2B313A]/60">
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Фиксация цены в рублях на дату договора</span>
                </li>
                <li className="flex items-center gap-2">
                  <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Прозрачный трекинг статуса поставки</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
