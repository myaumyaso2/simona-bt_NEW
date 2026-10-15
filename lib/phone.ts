/**
 * Утилиты для работы с номерами телефонов (маска РФ и валидация)
 * Стандарт SIMONA: +7 (XXX) XXX-XX-XX
 */

/**
 * Форматирует строку ввода в маску российского номера: +7 (XXX) XXX-XX-XX
 * Поддерживает умный ввод (с 7, 8 или сразу с 9), вставку из буфера и удаление (Backspace).
 */
export function formatPhoneMask(input: string, prevValue: string = ''): string {
  if (!input) return '';

  // Очищаем от всего, кроме цифр
  let digits = input.replace(/\D/g, '');

  // Обработка Backspace на форматирующих символах (пробел, дефис, скобка):
  // если длина строки уменьшилась, а количество цифр не изменилось — удаляем последнюю цифру
  if (prevValue) {
    const prevDigits = prevValue.replace(/\D/g, '');
    if (digits.length === prevDigits.length && input.length < prevValue.length) {
      digits = digits.slice(0, -1);
    }
  }

  if (!digits) return '';

  // Нормализация первой цифры к 7:
  // 8 или 7 -> 7
  // 9 -> пользователь начал сразу с кода оператора (+7 (9...))
  // другие цифры -> также подставляем 7 в начало
  if (digits[0] === '8' || digits[0] === '7') {
    digits = '7' + digits.slice(1);
  } else {
    digits = '7' + digits;
  }

  // Ограничение: максимум 11 цифр (1 страна + 10 номер)
  digits = digits.slice(0, 11);

  // Форматирование по маске: +7 (XXX) XXX-XX-XX
  let result = '+7';
  if (digits.length > 1) {
    result += ' (' + digits.slice(1, 4);
  }
  if (digits.length >= 4) {
    result += ') ';
  }
  if (digits.length > 4) {
    result += digits.slice(4, 7);
  }
  if (digits.length >= 7) {
    result += '-';
  }
  if (digits.length > 7) {
    result += digits.slice(7, 9);
  }
  if (digits.length >= 9) {
    result += '-';
  }
  if (digits.length > 9) {
    result += digits.slice(9, 11);
  }

  return result;
}

/**
 * Проверяет, является ли введенный номер полным и валидным российским номером (11 цифр)
 */
export function isValidRussianPhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'));
}

/**
 * Возвращает только цифры телефона для сохранения в базе данных или передачи в API (+7XXXXXXXXXX)
 */
export function getCanonicalPhone(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return '+7' + digits.slice(1);
  }
  if (digits.length === 10) {
    return '+7' + digits;
  }
  return phone.trim();
}
