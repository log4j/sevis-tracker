// Get the Browser Fetch API - Use browser native Fetch API or a polyfill
const windowFetch = (() => {
  // Polyfill Fetch API (Safari 9.3 still does not have support)
  // DE58278: Add Edge to condition since the fetch fn in Edge has a defect which affects Dossier.
  // Once the Edge defect is fixed, we can remove that from the condition...
  // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/
  if (!window.fetch || window.navigator.userAgent.indexOf('Edge') >= 0) {
    window.fetch = null;
    require('whatwg-fetch'); // eslint-disable-line global-require
  }

  return window.fetch;
})();


const responseHandler = (res) => {
  if (
    res &&
        res.headers &&
        res.headers.get('Content-Type') &&
        res.headers.get('Content-Type').indexOf('json') >= 0
  ) {
    return res.json();
  }
  return null;
};

export function post(url, body, options) {
  return windowFetch(url, {
    method: 'POST',
    body: JSON.stringify(body || {}) || '',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers),
    },
  }).then(responseHandler);
}

export function postWithToken(url, body, token) {
  return post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function get(url, token, options) {
  return windowFetch(url, {
    method: 'GET',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options && options.headers),
    },
  }).then(responseHandler);
}
