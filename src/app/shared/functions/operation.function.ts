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