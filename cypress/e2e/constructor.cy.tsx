const BUN_ID = 'bun-1';
const MAIN_ID = 'main-1';
const ACCESS_TOKEN = 'Bearer fake-access-token';
const REFRESH_TOKEN = 'fake-refresh-token';

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
        win.document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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

    cy.get(`[data-cy="ingredient-${BUN_ID}"] a`).click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Тестовая булка');
    cy.get('[data-cy="ingredient-details"]').should('contain', '400');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.location('pathname').should('eq', '/');
  });

  it('adds bun and main ingredient to constructor', () => {
    openConstructorPage();

    cy.get(`[data-cy="ingredient-${BUN_ID}"] button`).click();
    cy.get(`[data-cy="ingredient-${MAIN_ID}"] button`).click();

    cy.get('[data-cy="burger-constructor"]')
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

    cy.get(`[data-cy="ingredient-${BUN_ID}"] button`).click();
    cy.get(`[data-cy="ingredient-${MAIN_ID}"] button`).click();
    cy.get('.order-button button, .order-button').first().click();

    cy.wait('@createOrder');
    cy.wait('@getProfileOrders');
    cy.get('[data-cy="order-number"]').should('contain', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="burger-constructor"]').should(
      'not.contain',
      'Тестовая начинка'
    );
    cy.get('[data-cy="burger-constructor"]').should(
      'not.contain',
      'Тестовая булка'
    );
  });
});
