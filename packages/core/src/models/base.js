import { Logger } from "@composer/util";
import { Collection } from "../util/collection";
import { composite, jsonnable } from "./mixins";

export class BaseModel extends composite(class {}, jsonnable) {

  static parse (properties) {
    return new this(properties);
  }

  static forEachProperty (fn) {
    Object.keys(this.properties).forEach((property) => {
      fn(property, this.properties[property]);
    });
  }

  /**
   * Bootstrap model properties and getters/setters
   */
  static init () {
    this.forEachProperty((property, definition) => {
      this.defineModelProperty(property, definition);
    });
  }

  /**
   * Bootstrap a single property or collection
   */
  static defineModelProperty(property, definition) {
    Object.defineProperty(this.prototype, property, {
      get: function () {
        return this.properties[property];
      }
    });
  }

  constructor (properties) {
    super(properties);

    // Logger specific to this record
    this.logger = new Logger(this.constructor.name);

    // Make a copy of original properties object
    this.properties = Object.assign({}, properties);

    // Initialize properties
    this.constructor.forEachProperty((property, definition) => {
      const currentValue = this[property];
      const defaultValue = definition.defaultValue;

      // Apply default value
      if (typeof currentValue === 'undefined' && defaultValue) {
        this.properties[property] = (typeof defaultValue === 'function')
          ? defaultValue.call(this, this.properties)
          : defaultValue;
      }
      
      // Initialize collection
      else if (definition.collection) {
        this.properties[property] = new Collection({
          obj: this,
          type: definition.type,
          records: this.properties[property] || [],
          property: property,
          definition: definition,
        });
      }
    });
  }

  setProperties(properties = {}) {
    Object.assign(this.properties, properties);
    return this;
  }

  clone () {
    return new this.constructor(Object.assign({}, this.properties));
  }

  validate() {
    return { errors: [], valid: true };
  }

}