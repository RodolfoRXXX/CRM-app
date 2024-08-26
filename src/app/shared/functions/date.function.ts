/*----- FUnciones para manejar objetos de tipo Date -----*/

//Función que define que semana es
    //recibe: [{ period: '2024-07-05', response: 175 }].split('-W')[1], [{ period: '2024-07-05', response: 175 }].split('-W',1)[0])
    //devuelve: '3° semana de julio'
export function getWeekInfo(weekNumber: number, year: number) {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
  
    // Ajuste para que el primer día sea lunes
    const dayOfWeek = firstDayOfWeek.getDay();
    const diff = firstDayOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    firstDayOfWeek.setDate(diff);
  
    const month = firstDayOfWeek.toLocaleString('es-ES', { month: 'long' });
  
    // Determinar si es la primera, segunda, etc., semana del mes
    const startOfMonth = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), 1);
    const weekOfMonth = Math.ceil(((firstDayOfWeek.getDate() - 1) + startOfMonth.getDay()) / 7);
  
    return `${weekOfMonth}ª semana de ${month}.`;
  }

//Función que devuelve el día del mes
    //recibe: [{ period: '2024-07-05', response: 175 }].split('-W')[1], [{ period: '2024-07-05', response: 175 }].split('-W',1)[0])
    //devuelve: '05-06'
export function formatDate(dateString: string) {
    // Diccionario para los nombres abreviados de los meses en español
    const monthNames = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
  
    // Parsear la fecha en formato YYYY-MM-DD
    const [year, day, month] = dateString.split('-').map(Number);
  
    // Obtener el nombre del mes abreviado
    const monthAbbreviation = monthNames[month - 1]; // Los meses en el array están indexados desde 0
  
    // Formatear la fecha en DD-MMM
    return `${day.toString().padStart(2, '0')}-${monthAbbreviation}`;
  }

//Función que devuelve el nombre del mes
    //recibe: [{ period: '2024-07-05', response: 175 }].split('-W')[1], [{ period: '2024-07-05', response: 175 }].split('-W',1)[0])
    //devuelve: 'Febrero' (nombre del mes)
export function getMonthName(monthNumber: number) {
    // Verificar que el número del mes esté en el rango válido
    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error('Número de mes inválido. Debe estar entre 1 y 12.');
    }
  
    // Diccionario para los nombres completos de los meses en español
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    // Devolver el nombre del mes correspondiente
    return monthNames[monthNumber - 1];
  }

//Función que devuelve la fecha resultado de la fecha actual menos un parámetro
    //recibe: 30(un número entero)
    //devuelve: '2024-07-05'(una fecha en string)
export function calculateDateLimit(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//Función que devuelve la cantidad de días desde la fecha actual hasta fin de mes
    //no recibe datos
    //entrega un número entero que son la cantidad de días
export function diasHastaFinDeMes(): number {
  // Obtener la fecha actual
  const hoy: Date = new Date();
  
  // Obtener el año y el mes actual
  const año: number = hoy.getFullYear();
  const mes: number = hoy.getMonth();
  
  // Calcular la fecha del primer día del próximo mes
  const primerDiaProximoMes: Date = new Date(año, mes + 1, 1);
  
  // Calcular la diferencia en milisegundos entre las dos fechas
  const diferenciaMilisegundos: number = primerDiaProximoMes.getTime() - hoy.getTime();
  
  // Convertir la diferencia de milisegundos a días
  const diasRestantes: number = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  
  return diasRestantes;
}

//Función que devuelve el nombre del mes de acuerdo a la fecha ingresada
    //recibe una fecha del siguiente formato: '2024-08-24 20:24:46'
    //devuelve el nombre del mes en string, ej: Agosto
export function getMonthNameForDate(dateString: string): string {
  // Convertir la cadena de fecha a un objeto Date
  const date = new Date(dateString);
  
  // Obtener el número del mes (0-11) y sumarle 1 para ajustarlo al rango (1-12)
  const monthNumber = date.getMonth() + 1;
  
  // Diccionario para los nombres completos de los meses en español
  const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Devolver el nombre del mes correspondiente
  return monthNames[monthNumber - 1];
}

//Función que devuelve true si la fecha ingresada es del mismo mes o posterior al actual y false si es de meses anteriores al actual
    //recibe una fecha del siguiente formato: '2024-08-24 20:24:46'
    //devuelve boolean, true or false
export function esMismoOMesPosterior(fechaString: string): boolean {
  // Convertir la cadena de fecha a un objeto Date
  const fecha = new Date(fechaString);
  
  // Obtener la fecha actual
  const fechaActual = new Date();
  
  // Comparar años
  if (fecha.getFullYear() < fechaActual.getFullYear()) {
      return false;
  }
  
  // Si el año es el mismo, comparar los meses
  if (fecha.getFullYear() === fechaActual.getFullYear()) {
      if (fecha.getMonth() < fechaActual.getMonth()) {
          return false;
      }
  }
  
  // Si la fecha ingresada no es anterior, devolver true
  return true;
}

//Función que devuelve true o false si la fecha pasada está dentro de los 30 días de la fecha actual o false en caso contrario
    //recibe una fecha del siguiente formato: '2024-08-24 20:24:46'
    //devuelve un boolean, true or false
export function isNewerThan30Days(inputDate: string): boolean {
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - 30);

  const formattedInputDate = new Date(inputDate);

  return formattedInputDate > pastDate;
}