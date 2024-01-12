import { stringify, parse } from 'qs';
import Urls from './urls';

class Route {
  constructor(name, definition, config) {
    this.name = name;
    this.definition = definition;
    this.bindings = definition.bindings ?? {};
    this.wheres = definition.wheres ?? {};
    this.config = config;
  }

  get template() {
    const origin = !this.config.absolute
      ? ''
      : this.definition.domain
        ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${
            this.config.port ? `:${this.config.port}` : ''
          }`
        : this.config.url;

    return `${origin}/${this.definition.uri}`.replace(/\/+$/, '');
  }

  get parameterSegments() {
    return (
      this.template.match(/{[^}?]+\??}/g)?.map((segment) => ({
        name: segment.replace(/{|\??}/g, ''),
        required: !/\?}$/.test(segment)
      })) ?? []
    );
  }

  matchesUrl(url) {
    if (!this.definition.methods.includes('GET')) return false;

    const pattern = this.template
      .replace(/(\/?){([^}?]*)(\??)}/g, (_, slash, segment, optional) => {
        const regex = `(?<${segment}>${this.wheres[segment]?.replace(/(^\^)|(\$$)/g, '') || '[^/?]+'})`;
        return optional ? `(${slash}${regex})?` : `${slash}${regex}`;
      })
      .replace(/^\w+:\/\//, '');

    const [location, query] = url.replace(/^\w+:\/\//, '').split('?');

    const matches = new RegExp(`^${pattern}/?$`).exec(location);

    return matches ? { params: matches.groups, query: parse(query) } : false;
  }

  compile(params) {
    const segments = this.parameterSegments;

    if (!segments.length) return this.template;

    return this.template
      .replace(/{([^}?]+)(\??)}/g, (_, segment, optional) => {
        if (!optional && [null, undefined].includes(params[segment])) {
          throw new Error(`Urls error: '${segment}' parameter is required for route '${this.name}'.`);
        }

        if (segments[segments.length - 1].name === segment && this.wheres[segment] === '.*') {
          return encodeURIComponent(params[segment] ?? '').replace(/%2F/g, '/');
        }

        if (
          this.wheres[segment] &&
          !new RegExp(`^${optional ? `(${this.wheres[segment]})?` : this.wheres[segment]}$`).test(params[segment] ?? '')
        ) {
          throw new Error(
            `Urls error: '${segment}' parameter does not match required format '${this.wheres[segment]}' for route '${this.name}'.`
          );
        }

        return encodeURIComponent(params[segment] ?? '');
      })
      .replace(/\/+$/, '');
  }
}

class Router extends String {
  constructor(name, params, absolute = true, config) {
    super();
    this._config = config ? config : Urls;
    this._config = { ...this._config, absolute };

    if (name) {
      if (!this._config.routes[name]) {
        throw new Error(`Urls error: route '${name}' is not in the route list.`);
      }

      this._route = new Route(name, this._config.routes[name], this._config);
      this._params = this._parse(params);
    }
  }

  toString() {
    const unhandled = Object.keys(this._params)
      .filter((key) => !this._route.parameterSegments.some(({ name }) => name === key))
      .filter((key) => key !== '_query')
      .reduce(
        (result, current) => ({
          ...result,
          [current]: this._params[current]
        }),
        {}
      );

    return (
      this._route.compile(this._params) +
      stringify(
        { ...unhandled, ...this._params['_query'] },
        {
          addQueryPrefix: true,
          arrayFormat: 'indices',
          encodeValuesOnly: true,
          skipNulls: true,
          encoder: (value, encoder) => (typeof value === 'boolean' ? Number(value) : encoder(value))
        }
      )
    );
  }

  _unresolve(url) {
    if (!url) {
      url = this._currentUrl();
    } else if (this._config.absolute && url.startsWith('/')) {
      url = this._location().host + url;
    }

    let matchedParams = {};
    const [name, route] = Object.entries(this._config.routes).find(
      ([name, route]) => (matchedParams = new Route(name, route, this._config).matchesUrl(url))
    ) || [undefined, undefined];

    return { name, ...matchedParams, route };
  }

  _currentUrl() {
    const { host, pathname, search } = this._location();

    return (
      (this._config.absolute
        ? host + pathname
        : pathname.replace(this._config.url.replace(/^\w*:\/\/[^/]+/, ''), '').replace(/^\/+/, '/')) + search
    );
  }

  current(name, params) {
    const { name: current, params: currentParams, query, route } = this._unresolve();

    if (!name) {
      return current;
    }

    const match = new RegExp(`^${name.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(current);

    if ([null, undefined].includes(params) || !match) {
      return match;
    }

    const routeObject = new Route(current, route, this._config);

    params = this._parse(params, routeObject);
    const routeParams = { ...currentParams, ...query };

    if (Object.values(params).every((p) => !p) && !Object.values(routeParams).some((v) => v !== undefined)) {
      return true;
    }

    return Object.entries(params).every(([key, value]) => routeParams[key] === value);
  }

  _location() {
    const { host = '', pathname = '', search = '' } = typeof window !== 'undefined' ? window.location : {};

    return {
      host: this._config.location?.host ?? host,
      pathname: this._config.location?.pathname ?? pathname,
      search: this._config.location?.search ?? search
    };
  }

  get params() {
    const { params, query } = this._unresolve();

    return { ...params, ...query };
  }

  has(name) {
    return Object.keys(this._config.routes).includes(name);
  }

  _parse(params = {}, route = this._route) {
    params = params || {};

    params = ['string', 'number'].includes(typeof params) ? [params] : params;

    const segments = route.parameterSegments.filter(({ name }) => !this._config.defaults[name]);

    if (Array.isArray(params)) {
      params = params.reduce((result, current, i) => {
        return segments[i]
          ? { ...result, [segments[i].name]: current }
          : typeof current === 'object'
            ? { ...result, ...current }
            : { ...result, [current]: '' };
      }, {});
    } else if (
      segments.length === 1 &&
      !params[segments[0].name] &&
      (params.hasOwnProperty(Object.values(route.bindings)[0]) || params.hasOwnProperty('id'))
    ) {
      params = { [segments[0].name]: params };
    }

    return {
      ...this._defaults(route),
      ...this._substituteBindings(params, route)
    };
  }

  _defaults(route) {
    return route.parameterSegments
      .filter(({ name }) => this._config.defaults[name])
      .reduce(
        (result, { name }) => ({
          ...result,
          [name]: this._config.defaults[name]
        }),
        {}
      );
  }

  _substituteBindings(params, { bindings, parameterSegments }) {
    return Object.entries(params).reduce((result, [key, value]) => {
      if (
        !value ||
        typeof value !== 'object' ||
        Array.isArray(value) ||
        !parameterSegments.some(({ name }) => name === key)
      ) {
        return { ...result, [key]: value };
      }

      if (!value.hasOwnProperty(bindings[key])) {
        if (value.hasOwnProperty('id')) {
          bindings[key] = 'id';
        } else {
          throw new Error(
            `Urls error: object passed as '${key}' parameter is missing route model binding key '${bindings[key]}'.`
          );
        }
      }

      return { ...result, [key]: value[bindings[key]] };
    }, {});
  }

  valueOf() {
    return this.toString();
  }

  check(name) {
    return this.has(name);
  }
}

export default function routes(name, params, absolute, config) {
  const router = new Router(name, params, absolute, config);

  return name ? router.toString() : router;
}
