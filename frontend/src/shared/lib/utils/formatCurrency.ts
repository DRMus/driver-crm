/**
 * Форматирует рубли для отображения
 */
export const formatCurrency = (rubles: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(rubles);
};

