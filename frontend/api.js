const API = {
  token: () => sessionStorage.getItem('bellybossToken'),
  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (this.token()) headers.Authorization = `Bearer ${this.token()}`;
    const response = await fetch(`/api${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) sessionStorage.removeItem('bellybossToken');
      throw new Error(data.message || 'Unable to complete your request.');
    }
    return data;
  },
  money(value) { return `₹${Number(value).toFixed(2)}`; },
  showMessage(element, message, kind = 'danger') {
    element.className = `alert alert-${kind}`;
    element.textContent = message;
    element.hidden = false;
  }
};
