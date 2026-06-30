const page = document.body.dataset.page;
const messageEl = document.querySelector('#message');
const yen = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
});
const categories = [
    { id: 1, name: 'ファッション' },
    { id: 2, name: 'PC・モバイル用品' },
    { id: 3, name: '生活雑貨' },
    { id: 4, name: 'リビング・インテリア' },
    { id: 5, name: 'タオル' },
    { id: 6, name: 'キッチン・食器・ランチ' },
    { id: 7, name: 'トイ・ホビー' },
    { id: 8, name: 'ぬいぐるみ' },
    { id: 9, name: 'キーホルダー' },
    { id: 10, name: 'ステーショナリー' },
    { id: 11, name: '食品' },
    { id: 12, name: 'お買い物袋・その他' },
];
const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

function getToken() {
    return localStorage.getItem('token') || localStorage.getItem('admin_token');
}

function getUser() {
    return JSON.parse(localStorage.getItem('user') || localStorage.getItem('admin_user') || 'null');
}

function isAdmin(user = getUser()) {
    return user?.role === 'admin';
}

function saveSession(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('admin_token', response.token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
}

function requireLogin() {
    if (!getToken()) {
        location.href = '../shop/login.html';
        return false;
    }

    return true;
}

function requireAdmin() {
    if (!requireLogin()) {
        return false;
    }

    if (!isAdmin()) {
        location.href = '../shop/index.html';
        return false;
    }

    return true;
}

function setMessage(text = '', isError = false) {
    if (!messageEl) {
        return;
    }

    messageEl.textContent = text;
    messageEl.classList.toggle('has-text', Boolean(text));
    messageEl.classList.toggle('error', isError);
}

function getErrorMessage(error) {
    if (error?.errors) {
        return Object.values(error.errors).flat().join(' ');
    }

    return error?.message || '処理に失敗しました.';
}

async function apiFetch(url, options = {}) {
    const token = getToken();
    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        if (res.status === 401 && page !== 'login') {
            clearSession();
            location.href = '../shop/login.html';
        }

        throw data || { message: 'API request failed' };
    }

    return data;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }[char]));
}

function price(value) {
    return yen.format(Number(value || 0));
}

function categoryName(categoryId) {
    return categoryMap.get(Number(categoryId)) || `未設定 (ID: ${escapeHtml(categoryId || '-')})`;
}

function categorySelect(selectedId) {
    return `<select name="category_id" aria-label="カテゴリ">${categories.map((category) => `<option value="${category.id}" ${Number(selectedId) === category.id ? 'selected' : ''}>${escapeHtml(category.name)} (ID: ${category.id})</option>`).join('')}</select>`;
}

function bindLogout() {
    const button = document.querySelector('#logoutButton');

    if (!button) {
        return;
    }

    button.addEventListener('click', async () => {
        try {
            await apiFetch('/api/logout', { method: 'POST' });
        } catch (_) {
            // tokenが無効でも管理画面からは退出させる.
        }

        clearSession();
        location.href = '../shop/login.html';
    });
}

async function initLogin() {
    const form = document.querySelector('#loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setMessage('ログイン中です.');

        try {
            const response = await apiFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
            });

            saveSession(response);

            if (response.user?.role !== 'admin') {
                clearSession();
                setMessage('管理者権限のあるユーザーのみログインできます.', true);
                return;
            }

            location.href = './index.html';
        } catch (error) {
            setMessage(getErrorMessage(error), true);
        }
    });
}

async function loadProducts() {
    return apiFetch('/api/admin/products');
}

function renderProducts(products) {
    const table = document.querySelector('#productsTable');
    const countLabel = document.querySelector('#countLabel');

    countLabel.textContent = `${products.length}件`;

    if (products.length === 0) {
        table.innerHTML = '<div class="empty">商品はまだ登録されていません.</div>';
        return;
    }

    table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>画像</th>
                    <th>商品</th>
                    <th>カテゴリ</th>
                    <th>価格</th>
                    <th>在庫</th>
                    <th>公開</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${products.map((product) => `
                    <tr data-row="${escapeHtml(product.id)}">
                        <td>${escapeHtml(product.id)}</td>
                        <td>
                            <div class="thumb">
                                ${product.image_url ? `<img src="${escapeHtml(product.image_url)}" alt="">` : ''}
                            </div>
                            <input class="image-input" name="image" type="file" accept="image/png,image/jpeg,image/gif" aria-label="商品画像">
                        </td>
                        <td>
                            <input name="name" type="text" value="${escapeHtml(product.name)}" aria-label="商品名">
                            <textarea name="information" rows="2" aria-label="説明">${escapeHtml(product.information || '')}</textarea>
                        </td>
                        <td>
                            ${categorySelect(product.category_id)}
                            <p class="product-desc">現在: ${escapeHtml(categoryName(product.category_id))}</p>
                        </td>
                        <td><input name="price" type="number" min="0" value="${escapeHtml(product.price)}" aria-label="価格"></td>
                        <td><input name="stock" type="number" min="0" value="${escapeHtml(product.stock)}" aria-label="在庫"></td>
                        <td>
                            <span class="status ${Number(product.is_public) ? '' : 'off'}">${Number(product.is_public) ? '表示' : '非表示'}</span>
                            <label class="check-row">
                                <input name="is_public" type="checkbox" ${Number(product.is_public) ? 'checked' : ''}>
                                変更
                            </label>
                        </td>
                        <td>
                            <div class="actions">
                                <button class="small-button" type="button" data-update="${escapeHtml(product.id)}">保存</button>
                                <button class="danger-button" type="button" data-delete="${escapeHtml(product.id)}">削除</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    table.querySelectorAll('[data-update]').forEach((button) => {
        button.addEventListener('click', () => updateProduct(button.dataset.update));
    });

    table.querySelectorAll('[data-delete]').forEach((button) => {
        button.addEventListener('click', () => deleteProduct(button.dataset.delete));
    });
}

async function refreshProducts(options = {}) {
    const clearMessage = options.clearMessage ?? true;

    if (clearMessage) {
        setMessage('商品を読み込み中です.');
    }

    try {
        const products = await loadProducts();
        renderProducts(products);
        if (clearMessage) {
            setMessage('');
        }
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function createProduct(form) {
    const formData = new FormData(form);
    formData.set('is_public', form.elements.is_public.checked ? '1' : '0');

    if (!form.elements.image.files.length) {
        formData.delete('image');
    }

    setMessage('商品を登録中です.');

    try {
        await apiFetch('/api/admin/products', {
            method: 'POST',
            body: formData,
        });
        form.reset();
        form.elements.category_id.value = '1';
        form.elements.is_public.checked = true;
        setMessage('商品を登録しました.');
        await refreshProducts({ clearMessage: false });
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function createAdminUser(form) {
    setMessage('管理者ユーザーを追加中です.');

    try {
        await apiFetch('/api/admin/users', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        form.reset();
        setMessage('管理者ユーザーを追加しました.');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

function rowValues(productId) {
    const row = document.querySelector(`[data-row="${CSS.escape(productId)}"]`);
    const formData = new FormData();

    formData.set('category_id', row.querySelector('[name="category_id"]').value || '1');
    formData.set('name', row.querySelector('[name="name"]').value || '');
    formData.set('price', row.querySelector('[name="price"]').value || '0');
    formData.set('information', row.querySelector('[name="information"]').value || '');
    formData.set('stock', row.querySelector('[name="stock"]').value || '0');
    formData.set('is_public', row.querySelector('[name="is_public"]').checked ? '1' : '0');

    const image = row.querySelector('[name="image"]').files[0];

    if (image) {
        formData.set('image', image);
    }

    return formData;
}

async function updateProduct(productId) {
    setMessage('商品を保存中です.');

    try {
        await apiFetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
            method: 'POST',
            body: rowValues(productId),
        });
        setMessage('商品を保存しました.');
        await refreshProducts({ clearMessage: false });
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function deleteProduct(productId) {
    const ok = window.confirm(`商品ID ${productId} を削除しますか.`);

    if (!ok) {
        return;
    }

    setMessage('商品を削除中です.');

    try {
        await apiFetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
            method: 'DELETE',
        });
        setMessage('商品を削除しました.');
        await refreshProducts({ clearMessage: false });
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function initProducts() {
    if (!requireAdmin()) {
        return;
    }

    const form = document.querySelector('#productForm');
    const adminUserForm = document.querySelector('#adminUserForm');
    const reloadButton = document.querySelector('#reloadButton');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        createProduct(form);
    });

    adminUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createAdminUser(adminUserForm);
    });

    reloadButton.addEventListener('click', refreshProducts);
    await refreshProducts();
}

async function initOrders() {
    if (!requireAdmin()) {
        return;
    }

    const reloadButton = document.querySelector('#reloadButton');
    reloadButton.addEventListener('click', refreshOrders);
    await refreshOrders();
}

function orderDetailsHtml(order) {
    const details = order.details || [];

    if (details.length === 0) {
        return '<div class="order-details"><p class="muted">注文内容はありません.</p></div>';
    }

    return `
        <div class="order-details">
            ${details.map((detail) => {
                const product = detail.product;
                const subtotal = Number(detail.price || 0) * Number(detail.quantity || 0);

                return `
                    <div class="order-detail-row">
                        <div>
                            <strong>${escapeHtml(product?.name || `商品ID ${detail.product_id}`)}</strong>
                            <p class="muted">商品ID ${escapeHtml(detail.product_id)} / 数量 ${escapeHtml(detail.quantity)} / 単価 ${price(detail.price)}</p>
                        </div>
                        <span class="price">${price(subtotal)}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

async function refreshOrders() {
    const list = document.querySelector('#ordersList');
    setMessage('注文を読み込み中です.');

    try {
        const orders = await apiFetch('/api/orders');
        const sorted = orders.slice().sort((a, b) => Number(b.id) - Number(a.id));

        if (sorted.length === 0) {
            list.innerHTML = '<div class="empty">注文はまだありません.</div>';
            setMessage('');
            return;
        }

        list.innerHTML = sorted.map((order) => `
            <article class="order-item">
                <button class="order-summary" type="button" data-order-toggle="${escapeHtml(order.id)}">
                    <div>
                        <h3>注文ID ${escapeHtml(order.id)}</h3>
                        <p class="muted">
                            ユーザー ${escapeHtml(order.user?.name || `ID ${order.user_id}`)} (ID: ${escapeHtml(order.user_id)})
                            / 注文日時 ${escapeHtml(order.ordered_at || order.created_at || '-')}
                        </p>
                    </div>
                    <p class="price">${price(order.total_price)}</p>
                </button>
                <div class="is-hidden" data-order-details="${escapeHtml(order.id)}">
                    ${orderDetailsHtml(order)}
                </div>
            </article>
        `).join('');

        list.querySelectorAll('[data-order-toggle]').forEach((button) => {
            button.addEventListener('click', () => {
                const detail = list.querySelector(`[data-order-details="${CSS.escape(button.dataset.orderToggle)}"]`);
                detail?.classList.toggle('is-hidden');
            });
        });

        setMessage('');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

bindLogout();

const initializers = {
    login: initLogin,
    products: initProducts,
    orders: initOrders,
};

initializers[page]?.();
