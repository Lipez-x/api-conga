import * as Handlebars from 'handlebars';

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('money', function (value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  });

  Handlebars.registerHelper('decimal', function (value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'decimal',
      currency: 'BRL',
    });
  });

  Handlebars.registerHelper('sum', function (a, b) {
    return Number(a) + Number(b);
  });

  Handlebars.registerHelper('profit', function (receitas, despesas) {
    return Number(receitas) - Number(despesas);
  });

  Handlebars.registerHelper('date', function (date) {
    if (!date) return '';

    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  });

  Handlebars.registerHelper('formatPeriodShort', function (from, to) {
    if (!from || !to) return '';

    const normalize = (date: string) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-');
        return new Date(Number(y), Number(m) - 1, Number(d));
      }

      return new Date(date);
    };

    const f = normalize(from);
    const t = normalize(to);

    const monthAbbr = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];

    const format = (d: Date) => {
      const year = String(d.getFullYear());
      const day = String(d.getDate()).padStart(2, '0');
      const month = monthAbbr[d.getMonth()];
      return `${day} de ${month} de ${year}`;
    };

    return `${format(f)} - ${format(t)}`;
  });

  Handlebars.registerHelper('formatDateTime', function (date) {
    if (!date) return '';

    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });
}
