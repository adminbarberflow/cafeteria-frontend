"use strict";

const siteData = window.NOVA_COFFEE_DATA ?? {
    categories: [],
    products: []
};

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-navigation");
const navigationLinks = navigation?.querySelectorAll("a");
const currentYearElement = document.querySelector("#current-year");

const categoriesContainer =
    document.querySelector("#menu-categories");

const productsContainer =
    document.querySelector("#menu-products");

const resultCountElement =
    document.querySelector("#menu-result-count");

let activeCategory = "todos";

function toggleNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Fechar menu de navegação"
            : "Abrir menu de navegação"
    );
}

function closeNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.setAttribute(
        "aria-label",
        "Abrir menu de navegação"
    );
}

function updateCurrentYear() {
    if (!currentYearElement) {
        return;
    }

    currentYearElement.textContent =
        String(new Date().getFullYear());
}

function formatPrice(price) {
    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(price);
}

function getCategoryName(categoryId) {
    const category = siteData.categories.find(
        (item) => item.id === categoryId
    );

    return category?.name ?? "Produto";
}

function createCategoryButton(category) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "category-button";
    button.dataset.category = category.id;
    button.textContent = category.name;

    button.setAttribute(
        "aria-pressed",
        String(category.id === activeCategory)
    );

    if (category.id === activeCategory) {
        button.classList.add("is-active");
    }

    return button;
}

function renderCategories() {
    if (!categoriesContainer) {
        return;
    }

    categoriesContainer.replaceChildren();

    siteData.categories.forEach((category) => {
        categoriesContainer.append(
            createCategoryButton(category)
        );
    });
}

function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    const visual = document.createElement("div");
    visual.className = "product-card__visual";
    visual.dataset.category = product.category;

    const image = document.createElement("img");

    image.className = "product-card__image";
    image.src = product.image;
    image.alt = `Imagem ilustrativa de ${product.name}`;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener(
        "error",
        () => {
            image.remove();
            visual.classList.add("is-image-unavailable");
        },
        {
            once: true
        }
    );

    visual.append(image);

    if (product.badge) {
        const badge = document.createElement("span");

        badge.className = "product-card__badge";
        badge.textContent = product.badge;

        visual.append(badge);
    }

    const content = document.createElement("div");
    content.className = "product-card__content";

    const meta = document.createElement("div");
    meta.className = "product-card__meta";

    const category = document.createElement("span");
    category.className = "product-card__category";
    category.textContent =
        getCategoryName(product.category);

    const price = document.createElement("strong");
    price.className = "product-card__price";
    price.textContent = formatPrice(product.price);

    meta.append(category, price);

    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-card__description";
    description.textContent = product.description;

    content.append(
        meta,
        title,
        description
    );

    article.append(
        visual,
        content
    );

    return article;
}

function getVisibleProducts() {
    if (activeCategory === "todos") {
        return siteData.products;
    }

    return siteData.products.filter(
        (product) =>
            product.category === activeCategory
    );
}

function updateResultCount(total) {
    if (!resultCountElement) {
        return;
    }

    const categoryName =
        activeCategory === "todos"
            ? "todo o cardápio"
            : getCategoryName(activeCategory);

    const productLabel =
        total === 1
            ? "produto encontrado"
            : "produtos encontrados";

    resultCountElement.textContent =
        `${total} ${productLabel} em ${categoryName}.`;
}

function renderProducts() {
    if (!productsContainer) {
        return;
    }

    const visibleProducts = getVisibleProducts();

    productsContainer.replaceChildren();
    updateResultCount(visibleProducts.length);

    if (visibleProducts.length === 0) {
        const emptyState = document.createElement("p");

        emptyState.className = "menu-empty-state";
        emptyState.textContent =
            "Nenhum produto disponível nesta categoria.";

        productsContainer.append(emptyState);
        return;
    }

    visibleProducts.forEach((product) => {
        productsContainer.append(
            createProductCard(product)
        );
    });
}

function updateCategoryButtons() {
    const buttons =
        categoriesContainer?.querySelectorAll(
            ".category-button"
        );

    buttons?.forEach((button) => {
        const isActive =
            button.dataset.category === activeCategory;

        button.classList.toggle(
            "is-active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });
}

function selectCategory(categoryId) {
    const categoryExists =
        siteData.categories.some(
            (category) =>
                category.id === categoryId
        );

    if (!categoryExists) {
        return;
    }

    activeCategory = categoryId;

    updateCategoryButtons();
    renderProducts();
}

categoriesContainer?.addEventListener(
    "click",
    (event) => {
        const button = event.target.closest(
            ".category-button"
        );

        if (!button) {
            return;
        }

        selectCategory(button.dataset.category);
    }
);

menuButton?.addEventListener(
    "click",
    toggleNavigation
);

navigationLinks?.forEach((link) => {
    link.addEventListener(
        "click",
        closeNavigation
    );
});

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    }
);

updateCurrentYear();
renderCategories();
renderProducts();


