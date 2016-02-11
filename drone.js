"use strict";

var autoincrement = 0;

function sum(prev, curr) {
  return prev + curr;
}

module.exports = function (maxLoad) {
  return {
    _id: autoincrement++,
    type: "drone",
    items: [],

    /**
     * Добавляет новый груз в отсек дрона и возвращает текущую загруженность дрона
     * @param itemType
     * @returns {Number} возвращает загруженность дрона
     * @private
     */
    _load: function (itemType) {
      itemType = Number(itemType);
      let sum = this.items.reduce(sum, 0);
      if (this.items.reduce(sum, 0) <= maxLoad) {
        this.items.push(itemType);
        return sum + itemType;
      } else {
        throw new Error(`Дрон не может взять этот груз (${itemType}). Превышен допустимый лимит веса (${maxLoad})`)
      }
    },

    /**
     * Выгружает указанный товар из дрона. Если не указать тип - выгрузит все товары
     * @param itemType
     * @returns {Number} возвращает список выгруженных товаров
     * @private
     */
    _unload: function (itemType) {
      itemType = Number(itemType || null);
      if (itemType > 0) {
        return this.items.splice(this.items.indexOf(itemType), 1);
      } else {
        return this.items.splice(0, this.items.length);
      }
    },
    _wait: function () {
      throw new Error("Пока что не написан");
    },
    _move: function () {
      throw new Error("Пока что не описан");
    }
  }
};