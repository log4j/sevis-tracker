// Get the Browser Fetch API - Use browser native Fetch API or a polyfill
const windowFetch = (() => {
  // Polyfill Fetch API (Safari 9.3 still does not have support)
  // DE58278: Add Edge to condition since the fetch fn in Edge has a defect which affects Dossier.
  // Once the Edge defect is fixed, we can remove that from the condition...
  // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/
  if (!window.fetch || window.navigator.userAgent.indexOf("Edge") >= 0) {
    window.fetch = null;
    require("whatwg-fetch");
  }

  return window.fetch;
})();

let token = "";

export function setToken(newToken) {
  token = newToken;
}

export function post(url, body, options) {
  return windowFetch(url, {
    method: "POST",
    body: JSON.stringify(body) || "",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options && options.headers)
    }
  }).then(res => res.json());
}

export function get(url, body, options) {
  return windowFetch(url, {
    method: "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...(options && options.headers)
    }
  }).then(res => res.json());
}
