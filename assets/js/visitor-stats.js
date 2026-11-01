/* Keep the existing Busuanzi counters; its JSONP endpoint does not require CORS. */
(() => {
    'use strict';
    const fields = ['site_uv', 'site_pv', 'page_pv'];
    const cacheKey = 'junjing:visitor-stats:' + location.hostname;
    const status = document.getElementById('visitor-stats-status');
    const setStatus = text => { if (status) status.textContent = text; };
    const valid = value => Number.isSafeInteger(value) && value >= 0;
    const display = data => fields.forEach(field => {
        const node = document.getElementById('busuanzi_value_' + field);
        if (node && valid(data[field])) node.textContent = data[field].toLocaleString('zh-CN');
    });
    let cached;
    try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch (_) { /* Storage may be disabled. */ }
    const start = () => {
        const callback = 'JunJingStats_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const script = document.createElement('script');
        let settled = false;
        let timer;
        const cleanup = () => {
            clearTimeout(timer);
            script.onerror = null;
            script.remove();
            // A timed-out JSONP response may already be in flight.
            window[callback] = () => {};
        };
        const fail = () => {
            if (settled) return;
            settled = true;
            cleanup();
            const usable = cached && fields.every(field => valid(cached[field]));
            if (usable) {
                display({ site_uv: cached.site_uv, site_pv: cached.site_pv,
                    page_pv: cached.path === location.pathname ? cached.page_pv : undefined });
                setStatus('统计服务暂不可用，显示上次数据');
            } else {
                setStatus('统计服务暂不可用');
            }
            fields.forEach(field => {
                const node = document.getElementById('busuanzi_value_' + field);
                if (node && node.textContent === '—') node.textContent = '暂不可用';
            });
        };
        window[callback] = data => {
            if (settled) return;
            if (!data || !fields.every(field => valid(data[field]))) { fail(); return; }
            settled = true;
            cleanup();
            display(data);
            setStatus('');
            try {
                localStorage.setItem(cacheKey, JSON.stringify({
                    site_uv: data.site_uv, site_pv: data.site_pv, page_pv: data.page_pv,
                    path: location.pathname
                }));
            } catch (_) { /* Counters still work without storage. */ }
        };
        script.async = true;
        script.referrerPolicy = 'no-referrer-when-downgrade';
        script.src = 'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=' + callback;
        script.onerror = fail;
        timer = setTimeout(fail, 8000);
        document.head.appendChild(script);
    };
    // A third-party request must never delay the page's load event.
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
})();
