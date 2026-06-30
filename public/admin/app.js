let currentEditingProductId = null;
const page = document.body.dataset.page;
const messageEl = document.querySelector("#message");
const yen = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
});
const categories = [
    { id: 1, name: "ファッション" },
    { id: 2, name: "PC・モバイル用品" },
    { id: 3, name: "生活雑貨" },
    { id: 4, name: "リビング・インテリア" },
    { id: 5, name: "タオル" },
    { id: 6, name: "キッチン・食器・ランチ" },
    { id: 7, name: "トイ・ホビー" },
    { id: 8, name: "ぬいぐるみ" },
    { id: 9, name: "キーホルダー" },
    { id: 10, name: "ステーショナリー" },
    { id: 11, name: "食品" },
    { id: 12, name: "お買い物袋・その他" },
];
const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
);

function getToken() {
    return localStorage.getItem("token") || localStorage.getItem("admin_token");
}

function getUser() {
    return JSON.parse(
        localStorage.getItem("user") ||
            localStorage.getItem("admin_user") ||
            "null",
    );
}

function isAdmin(user = getUser()) {
    return user?.role === "admin";
}

function saveSession(response) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("admin_token", response.token);
    localStorage.setItem("admin_user", JSON.stringify(response.user));
}

function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
}

function requireLogin() {
    if (!getToken()) {
        location.href = "../shop/login.html";
        return false;
    }

    return true;
}

function requireAdmin() {
    if (!requireLogin()) {
        return false;
    }

    if (!isAdmin()) {
        location.href = "../shop/index.html";
        return false;
    }

    return true;
}

function setMessage(text = "", isError = false) {
    if (!messageEl) {
        return;
    }

    messageEl.textContent = text;
    messageEl.classList.toggle("has-text", Boolean(text));
    messageEl.classList.toggle("error", isError);
}

function getErrorMessage(error) {
    if (error?.errors) {
        return Object.values(error.errors).flat().join(" ");
    }

    return error?.message || "処理に失敗しました.";
}

async function apiFetch(url, options = {}) {
    const token = getToken();
    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        if (res.status === 401 && page !== "login") {
            clearSession();
            location.href = "../shop/login.html";
        }

        throw data || { message: "API request failed" };
    }

    return data;
}

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
            })[char],
    );
}

function price(value) {
    return yen.format(Number(value || 0));
}

function categoryName(categoryId) {
    return (
        categoryMap.get(Number(categoryId)) ||
        `未設定 (ID: ${escapeHtml(categoryId || "-")})`
    );
}

function categorySelect(selectedId) {
    return `<select name="category_id" aria-label="カテゴリ">${categories.map((category) => `<option value="${category.id}" ${Number(selectedId) === category.id ? "selected" : ""}>${escapeHtml(category.name)} (ID: ${category.id})</option>`).join("")}</select>`;
}

function bindLogout() {
    const button = document.querySelector("#logoutButton");

    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {
        try {
            await apiFetch("/api/logout", { method: "POST" });
        } catch (_) {
            // tokenが無効でも管理画面からは退出させる.
        }

        clearSession();
        location.href = "../shop/login.html";
    });
}

async function initLogin() {
    const form = document.querySelector("#loginForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setMessage("ログイン中です.");

        try {
            const response = await apiFetch("/api/login", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
            });

            saveSession(response);

            if (response.user?.role !== "admin") {
                clearSession();
                setMessage(
                    "管理者権限のあるユーザーのみログインできます.",
                    true,
                );
                return;
            }

            location.href = "./index.html";
        } catch (error) {
            setMessage(getErrorMessage(error), true);
        }
    });
}

async function loadProducts() {
    return apiFetch("/api/admin/products");
}

function renderProducts(products) {
    const table = document.querySelector("#productsTable");
    const countLabel = document.querySelector("#countLabel");

    countLabel.textContent = `${products.length}件`;

    if (products.length === 0) {
        table.innerHTML =
            '<div class="empty">商品はまだ登録されていません.</div>';
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
            ${products
                .map(
                    (product) => `
                <tr data-row="${escapeHtml(product.id)}">
                    <td>${escapeHtml(product.id)}</td>
                    <td>
                        <div class="thumb">
                            ${product.image_url ? `<img src="${escapeHtml(product.image_url)}" alt="">` : ""}
                        </div>
                    </td>
                    <td>
                        <div class="product-name">${escapeHtml(product.name)}</div>
                        <p class="product-desc">${escapeHtml(product.information || "説明なし")}</p>
                    </td>
                    <td>
                        <p class="product-desc">${escapeHtml(categoryName(product.category_id))}</p>
                    </td>
                    <td>${price(product.price)}</td>
                    <td>${escapeHtml(product.stock)}</td>
                    <td>
                        <span class="status ${Number(product.is_public) ? "" : "off"}">${Number(product.is_public) ? "表示" : "非表示"}</span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="small-button" type="button" data-edit="${escapeHtml(JSON.stringify(product))}">編集</button>
                            <button class="danger-button" type="button" data-delete="${escapeHtml(product.id)}">削除</button>
                        </div>
                    </td>
                </tr>
            `,
                )
                .join("")}
        </tbody>
    </table>
`;

    table.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", () => {
            const product = JSON.parse(button.dataset.edit);
            setFormToEditMode(product);
        });
    });

    table.querySelectorAll("[data-delete]").forEach((button) => {
        button.addEventListener("click", () =>
            deleteProduct(button.dataset.delete),
        );
    });
}

function setFormToEditMode(product) {
    currentEditingProductId = product.id;
    const form = document.querySelector("#productForm");
    form.querySelector("h2").textContent =
        `商品を出荷・編集 (ID: ${product.id})`;
    form.querySelector(".primary-button").textContent = "変更を保存";

    form.elements.category_id.value = product.category_id;
    form.elements.name.value = product.name;
    form.elements.price.value = product.price;
    form.elements.information.value = product.information || "";
    form.elements.stock.value = product.stock;
    form.elements.is_public.checked = Number(product.is_public) === 1;
    form.scrollIntoView({ behavior: "smooth" });
}

function resetProductForm(form) {
    currentEditingProductId = null;
    form.reset();
    form.querySelector("h2").textContent = "商品を追加";
    form.querySelector(".primary-button").textContent = "商品を登録";
    form.elements.category_id.value = "1";
    form.elements.is_public.checked = true;
}

async function refreshProducts(options = {}) {
    const clearMessage = options.clearMessage ?? true;

    if (clearMessage) {
        setMessage("商品を読み込み中です.");
    }

    try {
        const products = await loadProducts();
        renderProducts(products);
        if (clearMessage) {
            setMessage("");
        }
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function createProduct(form) {
    const formData = new FormData(form);
    formData.set("is_public", form.elements.is_public.checked ? "1" : "0");

    if (!form.elements.image.files.length) {
        formData.delete("image");
    }

    setMessage("商品を登録中です.");

    try {
        await apiFetch("/api/admin/products", {
            method: "POST",
            body: formData,
        });
        form.reset();
        form.elements.category_id.value = "1";
        form.elements.is_public.checked = true;
        setMessage("商品を登録しました.");
        await refreshProducts({ clearMessage: false });
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function handleUpdateProduct(form) {
    const formData = new FormData(form);
    formData.set("is_public", form.elements.is_public.checked ? "1" : "0");
    formData.append("_method", "PUT");

    if (!form.elements.image.files.length) {
        formData.delete("image");
    }

    setMessage("商品を更新中です.");

    try {
        await apiFetch(
            `/api/admin/products/${encodeURIComponent(currentEditingProductId)}`,
            {
                method: "POST",
                body: formData,
            },
        );
        resetProductForm(form);
        setMessage("商品を更新しました.");
        await refreshProducts({ clearMessage: false });
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function createAdminUser(form) {
    setMessage("管理者ユーザーを追加中です.");

    try {
        await apiFetch("/api/admin/users", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        form.reset();
        setMessage("管理者ユーザーを追加しました.");
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

function rowValues(productId) {
    const row = document.querySelector(`[data-row="${CSS.escape(productId)}"]`);

    return {
        category_id: Number(
            row.querySelector('[name="category_id"]').value || 1,
        ),
        name: row.dataset.name || "",
        price: Number(row.querySelector('[name="price"]').value || 0),
        information: row.dataset.information || "",
        stock: Number(row.querySelector('[name="stock"]').value || 0),
        is_public: row.querySelector('[name="is_public"]').checked ? 1 : 0,
    };
}

async function updateProduct(productId) {
    setMessage("商品を保存中です.");

    try {
        await apiFetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
            method: "PUT",
            body: JSON.stringify(rowValues(productId)),
        });
        setMessage("商品を保存しました.");
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

    setMessage("商品を削除中です.");

    try {
        await apiFetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
            method: "DELETE",
        });
        setMessage("商品を削除しました.");
        await refreshProducts({ clearMessage: false });
    } catch (error) {
        setMessage(getErrorMessage(error), true);
    }
}

async function initProducts() {
    if (!requireAdmin()) {
        return;
    }

    const form = document.querySelector("#productForm");
    const adminUserForm = document.querySelector("#adminUserForm");
    const reloadButton = document.querySelector("#reloadButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (currentEditingProductId) {
            await handleUpdateProduct(form);
        } else {
            await createProduct(form);
        }
    });

    adminUserForm.addEventListener("submit", (event) => {
        event.preventDefault();
        createAdminUser(adminUserForm);
    });

    reloadButton.addEventListener("click", refreshProducts);
    await refreshProducts();
}

async function initOrders() {
    if (!requireAdmin()) {
        return;
    }

    const reloadButton = document.querySelector("#reloadButton");
    reloadButton.addEventListener("click", refreshOrders);
    await refreshOrders();
}

async function refreshOrders() {
    const wrap = document.querySelector("#ordersTable");
    setMessage("注文を読み込み中です.");

    try {
        const orders = await apiFetch("/api/orders");
        const sorted = orders
            .slice()
            .sort((a, b) => Number(b.id) - Number(a.id));

        if (sorted.length === 0) {
            wrap.innerHTML = '<div class="empty">注文はまだありません.</div>';
            setMessage("");
            return;
        }

        wrap.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>注文ID</th>
                <th>ユーザーネーム</th>
                <th>合計金額</th>
                <th>注文日時</th>
            </tr>
        </thead>
        <tbody>
            ${sorted
                .map(
                    (order) => `
                <tr>
                    <td>${escapeHtml(order.id)}</td>
                    <td>${escapeHtml(order.user_name || order.user_id)}</td> <td>${price(order.total_price)}</td>
                    <td>${escapeHtml(order.ordered_at || order.created_at || "-")}</td>
                </tr>
            `,
                )
                .join("")}
        </tbody>
    </table>
`;
        setMessage("");
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
