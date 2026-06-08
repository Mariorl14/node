const MESES_ES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

const TIMEZONE = 'America/Costa_Rica';


function getMesTrabajada(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);

  const month = Number(parts.find((p) => p.type === 'month').value);
  const year = parts.find((p) => p.type === 'year').value;

  return `${MESES_ES[month - 1]} ${year}`;
}

module.exports = { getMesTrabajada };
