import { defaultTo, round } from 'lodash';

class Value {
  constructor(amount = 0, scale = 'unit', unitPrice = 1, unitPrecision = 8, currencyPrecision = 2) {
    this.amount = amount;
    this.scale = scale;
    this.unitPrice = unitPrice;
    this.unitPrecision = unitPrecision;
    this.currencyPrecision = currencyPrecision;
  }

  valueOf() {
    return this.unitValue;
  }

  get unitValue() {
    return Number(this.scale === 'price' ? round(this.amount / this.unitPrice, this.unitPrecision) : this.amount);
  }

  get priceValue() {
    return Number(this.scale === 'unit' ? round(this.amount * this.unitPrice, this.currencyPrecision) : this.amount);
  }

  toUnit() {
    return new Value(this.unitValue, 'unit', this.unitPrice, this.unitPrecision, this.currencyPrecision);
  }

  toPrice() {
    return new Value(this.priceValue, 'price', this.unitPrice, this.unitPrecision, this.currencyPrecision);
  }

  setUnitPrice(unitPrice) {
    return new Value(this.amount, this.scale, unitPrice, this.unitPrecision, this.currencyPrecision);
  }

  clone(amount, scale = null) {
    return new Value(amount, defaultTo(scale, this.scale), this.unitPrice, this.unitPrecision, this.currencyPrecision);
  }

  static isValid(value) {
    return value instanceof Value && !isNaN(value.valueOf());
  }

  static validate() {
    return () => ({
      validator(rule, value) {
        const params = { field: rule.field };

        if (!Value.isValid(value)) {
          return Promise.reject(`${rule.field} is not a valid number`);
        }

        if (value.valueOf() < 0) {
          return Promise.reject(`${rule.field} cannot be negative`);
        }

        return Promise.resolve();
      }
    });
  }

  static validateMax(max) {
    return () => ({
      validator(rule, value) {
        const params = { field: rule.field, max };

        if (value?.valueOf() > max) {
          return Promise.reject(`${rule.field} cannot be greater than ${max}`);
        } else {
          return Promise.resolve();
        }
      }
    });
  }

  static validateMin(min) {
    return () => ({
      validator(rule, value) {
        const params = { field: rule.field, min };

        if (value?.valueOf() < min) {
          return Promise.reject(`${rule.field} cannot be less than ${min}`);
        } else {
          return Promise.resolve();
        }
      }
    });
  }
}

export default Value;
