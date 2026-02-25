const BUN_ID = 'bun-1';
const MAIN_ID = 'main-1';
const ACCESS_TOKEN = 'Bearer fake-access-token';
const REFRESH_TOKEN = 'fake-refresh-token';

const MODAL_SELECTOR = '[data-cy="modal"]';
const MODAL_CLOSE_SELECTOR = '[data-cy="modal-close"]';
const INGREDIENT_DETAILS_SELECTOR = '[data-cy="ingredient-details"]';
const BURGER_CONSTRUCTOR_SELECTOR = '[data-cy="burger-constructor"]';
const ORDER_NUMBER_SELECTOR = '[data-cy="order-number"]';
const ORDER_BUTTON_SELECTOR = '.order-button button, .order-button';

const ingredientLinkSelector = (id: string) => `[data-cy="ingredient-${id}"] a`;
const ingredientButtonSelector = (id: string) =>
  `[data-cy="ingredient-${id}"] button`;

const openConstructorPage = (isAuthorized = false) => {
  cy.intercept('**/api/**', (req) => {
    throw new Error(`Unmocked API request: ${req.method} ${req.url}`);
  });

  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );

  if (isAuthorized) {
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
  } else {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'Unauthorized' }
    }).as('getUser');
  }

  cy.visit('/', {
    onBeforeLoad(win) {
      if (isAuthorized) {
        win.localStorage.setItem('refreshToken', REFRESH_TOKEN);
        win.document.cookie = `accessToken=${ACCESS_TOKEN}; path=/`;
      } else {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie =
          'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  });

  cy.wait('@getIngredients');
  cy.wait('@getUser');
};

describe('Constructor page', () => {
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('opens and closes ingredient modal', () => {
    openConstructorPage();

    cy.get(ingredientLinkSelector(BUN_ID)).click();
    cy.get(MODAL_SELECTOR).should('be.visible');
    cy.get(INGREDIENT_DETAILS_SELECTOR).should('be.visible');
    cy.get(INGREDIENT_DETAILS_SELECTOR).should('contain', 'Тестовая булка');
    cy.get(INGREDIENT_DETAILS_SELECTOR).should('contain', '400');

    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.get(MODAL_SELECTOR).should('not.exist');
    cy.location('pathname').should('eq', '/');
  });

  it('adds bun and main ingredient to constructor', () => {
    openConstructorPage();

    cy.get(ingredientButtonSelector(BUN_ID)).click();
    cy.get(ingredientButtonSelector(MAIN_ID)).click();

    cy.get(BURGER_CONSTRUCTOR_SELECTOR)
      .should('contain', 'Тестовая булка')
      .and('contain', 'Тестовая начинка');
  });

  it('creates an order for authorized user and clears constructor', () => {
    openConstructorPage(true);

    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/api/orders', { fixture: 'profile-orders.json' }).as(
      'getProfileOrders'
    );

    cy.get(ingredientButtonSelector(BUN_ID)).click();
    cy.get(ingredientButtonSelector(MAIN_ID)).click();
    cy.get(ORDER_BUTTON_SELECTOR).first().click();

    cy.wait('@createOrder');
    cy.wait('@getProfileOrders');
    cy.get(ORDER_NUMBER_SELECTOR).should('contain', '12345');

    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.get(BURGER_CONSTRUCTOR_SELECTOR).should('not.contain', 'Тестовая начинка');
    cy.get(BURGER_CONSTRUCTOR_SELECTOR).should('not.contain', 'Тестовая булка');
  });
});
