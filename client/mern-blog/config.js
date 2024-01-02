const currentURL = window.location.href;
export const isRemote = currentURL.slice(0, 8) === "https://"

export const backend_url =  isRemote ? 'https://myblog-57vg.onrender.com' : "http://localhost:4000";