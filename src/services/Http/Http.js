import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import {
  get,
  assign,
  first,
  forOwn,
  isEmpty,
  isFunction,
  isString,
  isUndefined,
  castArray,
  flatten,
  values,
  has
} from 'lodash';
import { notify, useVar, modal, mountHandler } from 'utils';
import baseStation from '@iconify-icons/ri/base-station-fill';
import indeterminateCircleFill from '@iconify-icons/ri/indeterminate-circle-fill';
import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import { useRedirectPath } from 'redirect';
import { useTokens } from 'hooks/global';
import router from 'router/router';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default class Http {
  constructor() {
    this.request = axios.create();
    this.resetCancelToken();
  }

  resetCancelToken() {
    this.source = axios.CancelToken.source();
    this.request.defaults.cancelToken = this.source.token;
  }

  cancel(message) {
    this.source.cancel(message);
    this.resetCancelToken();
  }

  isCancel(error) {
    return axios.isCancel(error);
  }
}

const unavailable = (data) => {
  modal.confirm({
    title: 'Unavialable',
    icon: <Box component={Icon} icon={indeterminateCircleFill} />,
    content: data._error_message,
    okText: 'Refresh',
    cancelButtonProps: { sx: { display: 'none' } }
  });
};

const pageExpired = (data) => {
  modal.confirm({
    title: 'Session Expired',
    icon: <Box component={Icon} icon={baseStation} />,
    content: data._error_message,
    okText: 'Login',
    cancelButtonProps: { sx: { display: 'none' } }
  });
};

/**
 * Request hook
 *
 * @returns {[axios, boolean]}
 */
export const useRequest = () => {
  const [loading, setLoading] = useState(false);
  const service = useVar(() => new Http());
  const { redirectPath } = useRedirectPath();

  useEffect(() => {
    const handler = mountHandler();
    const interceptors = service.request.interceptors;

    const requestInterceptor = interceptors.request.use((config) => {
      handler.execute(() => {
        setLoading(true);
      });
      // You can modify the request config here
      config.params = {
        ...config.params, // Preserve existing parameters
        redirect: redirectPath // Add a background parameter
      };
      return config;
    });

    const responseInterceptor = interceptors.response.use(
      ({ data }) => {
        handler.execute(() => {
          if (data.success) {
            notify.success(data.success);
          }
          setLoading(false);
        });
        return data;
      },
      (error) => {
        handler.execute(() => {
          setLoading(false);

          if (error.response) {
            const { status, data } = error.response;

            switch (status) {
              case 401: {
                unavailable(data);
                break;
              }
              case 419: {
                pageExpired(data);
                break;
              }
              case 500: {
                if (data._error_message === 'Invalid token header. No credentials provided.') {
                  window.location = router.generatePath('landing.logout');
                }
                break;
              }
              default: {
                const { errors, message } = data;

                if (!isEmpty(errors)) {
                  forOwn(errors, (data) => {
                    castArray(data).forEach((e) => {
                      notify.error(e);
                    });
                  });
                } else if (isString(message)) {
                  notify.error(message);
                }
              }
            }
          }
        });

        error.canceled = axios.isCancel(error);

        return Promise.reject(error);
      }
    );

    return () => {
      service.cancel();
      interceptors.response.eject(responseInterceptor);
      interceptors.request.eject(requestInterceptor);
      handler.unmount();
    };
  }, [service, redirectPath]);

  return [service.request, loading];
};

/**
 * Form request hook
 *
 * @param form
 * @returns {[axios, boolean]}
 */
export const useFormRequest = (form) => {
  const [loading, setLoading] = useState(false);
  const service = useVar(() => new Http());
  const { redirectPath } = useRedirectPath();

  useEffect(() => {
    const handler = mountHandler();
    const interceptors = service.request.interceptors;

    const requestInterceptor = interceptors.request.use((config) => {
      handler.execute(() => {
        setLoading(true);
      });
      // You can modify the request config here
      config.params = {
        ...config.params, // Preserve existing parameters
        redirect: redirectPath // Add a background parameter
      };
      return config;
    });

    const responseInterceptor = interceptors.response.use(
      ({ data }) => {
        handler.execute(() => {
          if (isString(data.success)) {
            notify.success(data.success);
          }
          setLoading(false);
        });
        return data;
      },
      (error) => {
        handler.execute(() => {
          setLoading(false);

          if (error.response) {
            const { status, data } = error.response;

            switch (status) {
              case 401: {
                unavailable(data);
                break;
              }
              case 419: {
                pageExpired(data);
                break;
              }
              case 500: {
                if (data._error_message === 'Invalid token header. No credentials provided.') {
                  window.location = router.generatePath('landing.logout');
                }
                break;
              }
              default: {
                const { errors, message } = data;

                if (!isEmpty(errors)) {
                  const fields = [];

                  // prettier-ignore
                  forOwn(errors, (data, key) => {
                                        const namePath = key.split(".");
                                        const prevValue = form.getFieldValue(namePath);

                                        fields.push({
                                            name: namePath,
                                            errors: data,
                                            value: prevValue
                                        });

                                        if (isUndefined(prevValue)) {
                                            castArray(data).forEach((e) => {
                                                notify.error(e);
                                            });
                                        }
                                    });

                  form.setFields(fields);
                  form.scrollToField(first(fields).name);
                } else if (isString(message)) {
                  notify.error(message);
                }
              }
            }
          }
        });

        error.canceled = axios.isCancel(error);

        return Promise.reject(error);
      }
    );

    return () => {
      service.cancel();
      interceptors.response.eject(responseInterceptor);
      interceptors.request.eject(requestInterceptor);
      handler.unmount();
    };
  }, [service, form, redirectPath]);

  return [service.request, loading];
};

export function useUploadRequest() {
  const [loading, setLoading] = useState(false);
  const service = useVar(() => new Http());
  const { redirectPath } = useRedirectPath();

  useEffect(() => {
    const handler = mountHandler();
    const interceptors = service.request.interceptors;

    const requestInterceptor = interceptors.request.use((config) => {
      handler.execute(() => {
        setLoading(true);
      });
      // You can modify the request config here
      config.params = {
        ...config.params, // Preserve existing parameters
        redirect: redirectPath // Add a background parameter
      };
      return config;
    });

    const responseInterceptor = interceptors.response.use(
      (response) => {
        handler.execute(() => {
          const { data } = response;
          if (data.success) {
            notify.success(data.success);
          }
          setLoading(false);
        });
        return response;
      },
      (error) => {
        handler.execute(() => {
          setLoading(false);

          if (error.response) {
            const { status, data } = error.response;

            switch (status) {
              case 401: {
                unavailable(data);
                break;
              }
              case 419: {
                pageExpired(data);
                break;
              }
              case 500: {
                if (data._error_message === 'Invalid token header. No credentials provided.') {
                  window.location = router.generatePath('landing.logout');
                }
                break;
              }
            }
          }
        });

        error.canceled = axios.isCancel(error);

        return Promise.reject(error);
      }
    );
    return () => {
      handler.unmount();
      interceptors.request.eject(requestInterceptor);
      interceptors.response.eject(responseInterceptor);
      service.cancel();
    };
  }, [service, redirectPath]);

  const request = useMemo(() => {
    return function (options) {
      const form = new FormData();
      form.set(options.filename, options.file);

      forOwn(options.data, (v, k) => {
        form.append(k, v);
      });

      service.request
        .post(options.action, form, {
          headers: assign({ 'Content-Type': 'multipart/form-data' }, options.headers),

          onUploadProgress(progress) {
            const { onProgress } = options;

            if (isFunction(onProgress)) {
              const { loaded, total } = progress;
              const percent = Math.round((loaded * 100) / total);
              return onProgress({ percent });
            }

            return null;
          }
        })
        .then((response) => {
          const { onSuccess } = options;

          if (isFunction(onSuccess)) {
            const { data, request } = response;
            return onSuccess(data, request);
          }

          return null;
        })
        .catch((error) => {
          const { onError } = options;

          if (!error.canceled && error.response) {
            const data = error.response.data;

            if (isFunction(onError)) {
              return onError(error, data);
            }
          }
          return null;
        });
    };
  }, [service]);

  return [request, loading];
}

export function notifyError(error) {
  const { errors, message } = get(error, 'response.data', {});

  if (!isEmpty(errors)) {
    flattenValues(errors).forEach((error) => {
      notify.error(error);
    });
  } else if (isString(message)) {
    notify.error(message);
  }
}

export { axios };

export function thunkRequest() {
  const service = new Http();

  service.request.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401: {
            unavailable(data);
            break;
          }
          case 419: {
            pageExpired(data);
            break;
          }
          case 500: {
            if (data._error_message === 'Invalid token header. No credentials provided.') {
              window.location = router.generatePath('landing.logout');
            }
            break;
          }
          default: {
            if (isString(data.message)) {
              notify.error(data.message);
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return service.request;
}

const flattenValues = (data) => flatten(values(data));
