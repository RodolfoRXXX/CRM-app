/*----- FUnciones para realizar operaciones básicas sobre datos -----*/

import { DataItem } from "../interfaces/period.interface";

//Función que toma un array de objetos Period y devuelve el objeto de valor mayor, menor y el valor promedio
  //recibe un array de objetos: { period: '2024-07-05', response: 175 }
  //devuelve: {max: {}, min: {}, avg: 255}
export function analyzeData(data: DataItem[]) {
    if (data.length === 0) {
      return {
        max: null,
        min: null,
        avg: 0
      };
    }
  
    let maxItem = data[0];
    let minItem = data[0];
    let totalResponse = 0;
  
    for (let item of data) {
      if (item.response > maxItem.response) {
        maxItem = item;
      }
      if (item.response < minItem.response) {
        minItem = item;
      }
      totalResponse += item.response;
    }
  
    const avgResponse = totalResponse / data.length;
  
    return {
      max: maxItem,
      min: minItem,
      avg: avgResponse
    };
}

//Función que genera un código alfanumérico diferente cada vez que se llama, cuya longitud depende del entero que se le pase
    //recibe un entero
    //devuelve un Id con caracteres elegidos al azar de su conjunto
export function generateUniqueId(length: number = 16): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}