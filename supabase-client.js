(function () {
  const config = window.WAO_SUPABASE || {};
  const base = String(config.url || '').replace(/\/$/, '');
  const projectRef = base.match(/^https:\/\/([^.]+)/)?.[1] || 'default';
  const storageKey = `wao_admin_session_${projectRef}`;
  const configured = Boolean(base && config.anonKey && !base.includes('YOUR_PROJECT'));
  const session = () => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } };
  const headers = (auth = false, extra = {}) => ({
    apikey: config.anonKey || '',
    ...(auth && session()?.access_token ? { Authorization: `Bearer ${session().access_token}` } : {}),
    ...extra
  });
  async function request(path, options = {}, auth = false, timeoutMs = 12000) {
    if (!configured) throw new Error('Supabase 尚未配置，请先复制 supabase-config.example.js。');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${base}${path}`, { ...options, signal: controller.signal, headers: headers(auth, options.headers) });
      const body = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.msg || body?.message || body?.error_description || `请求失败 (${response.status})`);
      return body;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('连接 Supabase 超时，请检查网络或更换浏览器后重试。');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  window.WaoData = {
    configured,
    session,
    async signIn(email, password) {
      const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      localStorage.setItem(storageKey, JSON.stringify(data)); return data;
    },
    signOut() { localStorage.removeItem(storageKey); },
    listProducts(includeDrafts = false) {
      const query = includeDrafts ? '' : '&status=eq.published';
      return request(`/rest/v1/products?select=*&order=sort_order.asc,updated_at.desc${query}`, {}, includeDrafts);
    },
    getProduct(id, includeDrafts = false) {
      const draft = includeDrafts ? '' : '&status=eq.published';
      return request(`/rest/v1/products?select=*&id=eq.${encodeURIComponent(id)}${draft}&limit=1`, {}, includeDrafts).then(rows => rows[0] || null);
    },
    saveProduct(product) {
      const editing = Boolean(product.id);
      const path = editing ? `/rest/v1/products?id=eq.${encodeURIComponent(product.id)}` : '/rest/v1/products';
      return request(path, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify(product) }, true).then(rows => rows?.[0]);
    },
    deleteProduct(id) { return request(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, true); },
    async uploadImage(file, productKey) {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const path = `${productKey}/${crypto.randomUUID()}-${safe}`;
      await request(`/storage/v1/object/product-images/${path}`, { method: 'POST', headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' }, body: file }, true, 120000);
      return `${base}/storage/v1/object/public/product-images/${path}`;
    }
  };
})();
