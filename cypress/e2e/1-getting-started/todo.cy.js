/// <reference types="cypress" />

describe('test login', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })


  it('Redirige a [localhost:5173/dashboard] cuando los datos SI son correctos', () => {

    cy.get('[data-cy=email-input]').type('admin')
    cy.get('[data-cy=password-input]').type('1234')

    cy.get('[data-cy=submit-button]').click()

    cy.url().should('eq', 'http://localhost:5173/dashboard')
  })


  it('Muestra una alerta cuando los datos NO son correctos y permanecemos en [localhost:5173/]', () => {

    cy.get('[data-cy=email-input]').type('email@noValid.com')
    cy.get('[data-cy=password-input]').type('passwordNOvalida')

    cy.get('[data-cy=submit-button]').click()

    cy.on('window:alert', (textAlert) => {
      expect(textAlert).to.contains('Email or password wrong')
    })

    cy.url().should('eq', 'http://localhost:5173/')
  })


  it('Impide el acceso a rutas privadas si el login NO está realizado y redirige a [localhost:5173/]', () => {

    cy.visit('http://localhost:5173/bookings')
    cy.url().should('eq', 'http://localhost:5173/')
  })


  it('Redirige a [localhost:5173/] si el usuario NO está autenticado y hace clic en un enlace a una ruta privada estando dentro de la aplicación', () => {

    cy.get('[data-cy=email-input]').type('admin')
    cy.get('[data-cy=password-input]').type('1234')
    cy.get('[data-cy=submit-button]').click()

    cy.get('[data-cy=nav-ctn-rooms]', { timeout: 1000 }).click()
    cy.clearLocalStorage()
    cy.url().should('eq', 'http://localhost:5173/rooms')

    cy.get('[data-cy=nav-ctn-bookings]', { timeout: 10000 }).click()
    cy.url().should('eq', 'http://localhost:5173/')
  })

})
