const page = document.body.dataset.page;
const messageEl = document.querySelector('#message');
const yen = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
});

migrateOldSession();

function migrateOldSession() {
    if (!localStorage.getItem('token') && localStorage.getItem('shop_token')) {
        localStorage.setItem('token', localStorage.getItem('shop_token'));
    }

    if (!localStorage.getItem('user') && localStorage.getItem('shop_user')) {
        localStorage.setItem('user', localStorage.getItem('shop_user'));
    }
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

function isAdmin(user = getUser()) {
    return user?.role === 'admin';
}

function saveSession(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('admin_token', response.token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    localStorage.removeItem('shop_token');
    localStorage.removeItem('shop_user');
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('shop_token');
    localStorage.removeItem('shop_user');
}

function requireLogin() {
    if (!getToken()) {
        location.href = './login.html';
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
    const res = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        if (res.status === 401) {
            clearSession();
            if (page !== 'login' && page !== 'register') {
                location.href = './login.html';
            }
        }

        throw data || { message: 'API request failed' };
    }

    return data;
}

function renderUserLabel() {
    const user = getUser();
    const label = document.querySelector('#userLabel');
    const adminLink = document.querySelector('#adminNavLink');

    if (label && user) {
        label.textContent = isAdmin(user)
            ? `${user.name}でログイン中 (管理者)`
            : `${user.name}でログイン中`;
    }

    if (adminLink) {
        adminLink.classList.toggle('is-hidden', !isAdmin(user));
    }
}

function productImage(product) {
    if (product?.image_url) {
        return `<img src="${escapeHtml(product.image_url)}" alt="">`;
    }

    if (product?.image) {
        return `<img src="${escapeHtml(product.image)}" alt="">`;
    }

    return '';
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

function stockLabel(product) {
    return Number(product.stock || 0) > 0
        ? `在庫 ${escapeHtml(product.stock ?? 0)}`
        : '品切れ';
}

async function addToCart(productId, quantity = 1) {
    if (!requireLogin()) {
        return;
    }

    const user = getUser();
    setMessage('カートに追加中です.');

    try {
        await apiFetch('/api/cart-items', {
            method: 'POST',
            body: JSON.stringify({
                user_id: user.id,
                product_id: Number(productId),
                quantity: Math.max(1, Number(quantity || 1)),
            }),
        });
        setMessage('カートに追加しました.');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function logout() {
    try {
        if (getToken()) {
            await apiFetch('/api/logout', { method: 'POST' });
        }
    } catch (_) {
        // tokenが無効でも画面上はログアウトさせる.
    }

    clearSession();
    location.href = './login.html';
}

function bindLogout() {
    const button = document.querySelector('#logoutButton');

    if (button) {
        button.addEventListener('click', logout);
    }
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
            location.href = './index.html';
        } catch (error) {
            setMessage(getErrorMessage(error), true);
        }
    });
}

async function initRegister() {
    const form = document.querySelector('#registerForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setMessage('登録中です.');

        const body = {
            ...Object.fromEntries(new FormData(form)),
            role: 'user',
        };

        try {
            const response = await apiFetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(body),
            });
            saveSession(response);
            location.href = './index.html';
        } catch (error) {
            setMessage(getErrorMessage(error), true);
        }
    });
}

async function initProducts() {
    if (!requireLogin()) {
        return;
    }

    renderUserLabel();
    const list = document.querySelector('#productsList');
    setMessage('商品を読み込み中です.');

    try {
        const products = await apiFetch('/api/products');
        const publicProducts = products.filter((product) => Number(product.is_public) !== 0);

        if (publicProducts.length === 0) {
            list.innerHTML = '<div class="empty">表示できる商品がありません.</div>';
            setMessage('');
            return;
        }

        list.innerHTML = publicProducts.map((product) => `
            <article class="product-card">
                <div class="product-thumb">${productImage(product)}</div>
                <div class="product-body">
                    <h2>${escapeHtml(product.name)}</h2>
                    <p class="product-info">${escapeHtml(product.information || '商品説明は準備中です.')}</p>
                    <p class="price">${price(product.price)}</p>
                    <p class="muted">${stockLabel(product)}</p>
                    <div class="button-row">
                        <a class="plain-link" href="./product.html?id=${encodeURIComponent(product.id)}">詳細を見る</a>
                        <button class="secondary-button" type="button" data-add-cart="${escapeHtml(product.id)}" ${Number(product.stock || 0) <= 0 ? 'disabled' : ''}>${Number(product.stock || 0) <= 0 ? '品切れ' : 'カートに追加'}</button>
                    </div>
                </div>
            </article>
        `).join('');

        list.querySelectorAll('[data-add-cart]').forEach((button) => {
            button.addEventListener('click', () => addToCart(button.dataset.addCart, 1));
        });

        setMessage('');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function initProductDetail() {
    if (!requireLogin()) {
        return;
    }

    const id = new URLSearchParams(location.search).get('id');
    const detail = document.querySelector('#productDetail');

    if (!id) {
        detail.innerHTML = '<div class="empty">商品IDが指定されていません.</div>';
        return;
    }

    setMessage('商品を読み込み中です.');

    try {
        const product = await apiFetch(`/api/products/${encodeURIComponent(id)}`);
        detail.innerHTML = `
            <div class="product-thumb">${productImage(product)}</div>
            <div>
                <h2>${escapeHtml(product.name)}</h2>
                <p class="product-info">${escapeHtml(product.information || '商品説明は準備中です.')}</p>
                <p class="price">${price(product.price)}</p>
                <p class="muted">${stockLabel(product)}</p>
                <div class="qty-row">
                    <input id="quantityInput" type="number" min="1" max="${escapeHtml(product.stock ?? 0)}" value="1" aria-label="数量" ${Number(product.stock || 0) <= 0 ? 'disabled' : ''}>
                    <button class="secondary-button" type="button" id="detailAddButton" ${Number(product.stock || 0) <= 0 ? 'disabled' : ''}>${Number(product.stock || 0) <= 0 ? '品切れ' : 'カートに追加'}</button>
                </div>
            </div>
        `;

        if (Number(product.stock || 0) > 0) {
            document.querySelector('#detailAddButton').addEventListener('click', () => {
                addToCart(product.id, document.querySelector('#quantityInput').value);
            });
        }

        setMessage('');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function loadProductsMap() {
    const products = await apiFetch('/api/products');
    return new Map(products.map((product) => [Number(product.id), product]));
}

async function initCart() {
    if (!requireLogin()) {
        return;
    }

    const user = getUser();
    const list = document.querySelector('#cartList');
    const totalBox = document.querySelector('#cartTotal');
    setMessage('カートを読み込み中です.');

    try {
        const [cartItems, productsMap] = await Promise.all([
            apiFetch('/api/cart-items'),
            loadProductsMap(),
        ]);
        const ownItems = cartItems.filter((item) => Number(item.user_id) === Number(user.id));

        if (ownItems.length === 0) {
            list.innerHTML = '<div class="empty">カートに商品はありません.</div>';
            totalBox.innerHTML = '';
            totalBox.style.display = 'none';
            setMessage('');
            return;
        }

        let total = 0;
        list.innerHTML = ownItems.map((item) => {
            const product = productsMap.get(Number(item.product_id));
            const subtotal = Number(product?.price || 0) * Number(item.quantity || 0);
            total += subtotal;

            return `
                <article class="list-item">
                    <div>
                        <h3>${escapeHtml(product?.name || `商品ID ${item.product_id}`)}</h3>
                        <p class="muted">商品ID ${escapeHtml(item.product_id)} / 数量 ${escapeHtml(item.quantity)}</p>
                    </div>
                    <p class="price">${price(subtotal)}</p>
                </article>
            `;
        }).join('');

        totalBox.style.display = 'flex';
        totalBox.innerHTML = `
            <div>
                <h2>合計 ${price(total)}</h2>
                <p class="muted">注文するとカート内の商品が注文履歴へ移ります.</p>
            </div>
            <button class="primary-button" type="button" id="orderButton">注文する</button>
        `;

        document.querySelector('#orderButton').addEventListener('click', async () => {
            setMessage('注文処理中です.');

            try {
                await apiFetch('/api/orders', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: user.id }),
                });
                location.href = './orders.html';
            } catch (error) {
                setMessage(getErrorMessage(error), true);
            }
        });

        setMessage('');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function initOrders() {
    if (!requireLogin()) {
        return;
    }

    const user = getUser();
    const list = document.querySelector('#ordersList');
    setMessage('注文履歴を読み込み中です.');

    try {
        const orders = await apiFetch('/api/orders');
        const ownOrders = orders
            .filter((order) => Number(order.user_id) === Number(user.id))
            .sort((a, b) => Number(b.id) - Number(a.id));

        if (ownOrders.length === 0) {
            list.innerHTML = '<div class="empty">注文履歴はありません.</div>';
            setMessage('');
            return;
        }

        list.innerHTML = ownOrders.map((order) => `
            <article class="list-item">
                <div>
                    <h3>注文ID ${escapeHtml(order.id)}</h3>
                    <p class="muted">注文日時 ${escapeHtml(order.ordered_at || order.created_at || '-')}</p>
                </div>
                <p class="price">${price(order.total_price)}</p>
            </article>
        `).join('');
        setMessage('');
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

bindLogout();

const initializers = {
    login: initLogin,
    register: initRegister,
    products: initProducts,
    product: initProductDetail,
    cart: initCart,
    orders: initOrders,
};

initializers[page]?.();
