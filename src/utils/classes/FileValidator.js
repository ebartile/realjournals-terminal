import { isArray, isEmpty } from 'lodash';
import { formatData } from '../formatter';

class FileValidator {
  errors = [];

  constructor(file) {
    this.file = file;
  }

  static make(file) {
    return new this(file);
  }

  mimeTypes(mimeTypes) {
    if (isArray(mimeTypes) && !mimeTypes.includes(this.file?.type)) {
      const types = mimeTypes.join(', ');
      const error = `File is invalid, ${types} is required.`;
      this.errors.push(error);
    }
    return this;
  }

  size(minSize = 0, maxSize = 10240) {
    const sizeInKb = (this.file?.size || 0) / 1024;
    if (minSize > sizeInKb || sizeInKb > maxSize) {
      const params = {
        min: formatData(minSize * 1024),
        max: formatData(maxSize * 1024)
      };
      const error = `File size must be between ${params.min} and ${params.max}.`;
      this.errors.push(error);
    }
    return this;
  }

  validate() {
    if (!isEmpty(this.errors)) {
      throw this.errors;
    }
  }
}

export default FileValidator;
