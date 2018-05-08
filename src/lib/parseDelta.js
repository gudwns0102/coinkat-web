import toLocaleString from './toLocaleString';

export default function (currentPrice, openPrice){
  var margin = currentPrice - openPrice;
  typeof margin === 'int' ? null : margin = Number(margin.toFixed(1));
  const percent = Number((margin/openPrice*100).toFixed(2));
  const delta = margin > 0 ? `+${toLocaleString(margin)} (+${percent}%) ▲ ` : margin === 0 ? '0(0%)' : `${toLocaleString(margin)}(${percent}%) ▼ `;

  return {
    margin,
    percent,
    delta,
  }
}