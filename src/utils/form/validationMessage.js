const messages = {
  default: 'Validation error on field {name}',
  required: '{name} is required',
  enum: '{name} must be one of [{enum}]',
  whitespace: '{name} cannot be empty',
  'date.format': '{name} is invalid for format date',
  'date.parse': '{name} could not be parsed as a date',
  'date.invalid': '{name} is an invalid date',
  'types.template': '{name} is not a valid {type}',
  'string.len': '{name} must be exactly {len} characters',
  'string.min': '{name} must be at least {min} characters',
  'string.max': '{name} cannot be longer than {max} characters',
  'string.range': '{name} must be between {min} and {max} characters',
  'number.len': '{name} must equal {len}',
  'number.min': '{name} cannot be less than {min}',
  'number.max': '{name} cannot be greater than {max}',
  'number.range': '{name} must be between {min} and {max}',
  'array.len': '{name} must be exactly {len} in length',
  'array.min': '{name} cannot be less than {min} in length',
  'array.max': '{name} cannot be greater than {max} in length',
  'array.range': '{name} must be between {min} and {max} in length',
  'pattern.mismatch': '{name} does not match pattern {pattern}'
};

const params = {
  name: '{name}',
  type: '{type}',
  enum: '{enum}',
  len: '{len}',
  min: '{min}',
  max: '{max}',
  pattern: '{pattern}'
};

function formatMessage(message, params) {
  return message.replace(/{(\w+)}/g, (match, param) => params[param] || match);
}

export function getValidationMessages() {
  return {
    default: formatMessage(messages.default, { name: params.name }),
    required: formatMessage(messages.required, { name: params.name }),
    enum: formatMessage(messages.enum, {
      name: params.name,
      enum: params.enum
    }),
    whitespace: formatMessage(messages.whitespace, {
      name: params.name
    }),
    date: {
      format: formatMessage(messages['date.format'], {
        name: params.name
      }),
      parse: formatMessage(messages['date.parse'], {
        name: params.name
      }),
      invalid: formatMessage(messages['date.invalid'], {
        name: params.name
      })
    },
    types: {
      string: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      method: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      array: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      object: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      number: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      date: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      boolean: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      integer: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      float: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      regexp: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      email: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      url: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      }),
      hex: formatMessage(messages['types.template'], {
        name: params.name,
        type: params.type
      })
    },
    string: {
      len: formatMessage(messages['string.len'], {
        name: params.name,
        len: params.len
      }),
      min: formatMessage(messages['string.min'], {
        name: params.name,
        min: params.min
      }),
      max: formatMessage(messages['string.max'], {
        name: params.name,
        max: params.max
      }),
      range: formatMessage(messages['string.range'], {
        name: params.name,
        min: params.min,
        max: params.max
      })
    },
    number: {
      len: formatMessage(messages['number.len'], {
        name: params.name,
        len: params.len
      }),
      min: formatMessage(messages['number.min'], {
        name: params.name,
        min: params.min
      }),
      max: formatMessage(messages['number.max'], {
        name: params.name,
        max: params.max
      }),
      range: formatMessage(messages['number.range'], {
        name: params.name,
        min: params.min,
        max: params.max
      })
    },
    array: {
      len: formatMessage(messages['array.len'], {
        name: params.name,
        len: params.len
      }),
      min: formatMessage(messages['array.min'], {
        name: params.name,
        min: params.min
      }),
      max: formatMessage(messages['array.max'], {
        name: params.name,
        max: params.max
      }),
      range: formatMessage(messages['array.range'], {
        name: params.name,
        min: params.min,
        max: params.max
      })
    },
    pattern: {
      mismatch: formatMessage(messages['pattern.mismatch'], {
        name: params.name,
        pattern: params.pattern
      })
    }
  };
}
