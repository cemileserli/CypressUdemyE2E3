/// <reference types="cypress" />

describe('share location', () => {
  beforeEach('', () => {
    cy.clock()  //Calling the clock method to Manipulate the time
    cy.fixture('user-location').as('userLocation')
    cy.visit('/').then((win) => {
      cy.get('@userLocation').then(fakeLocation => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').as('getUserLocation')
          .callsFake((cb) => {
            setTimeout(() => {
              cb(fakeLocation)
            }, 100);
          })
      })
      cy.stub(win.navigator.clipboard, "writeText").as('copyToClipBoard').resolves()
      cy.spy(win.localStorage, 'setItem').as('storeLocation')
      cy.spy(win.localStorage, 'getItem').as('getStoredLocation')
    })
  })
  it('should fetch the user location', () => {
    cy.get('[data-cy="get-loc-btn"]').as('getLocationButton')
    cy.get('@getLocationButton').click()
    cy.get('@getUserLocation').should('have.been.called')
    cy.get('@getLocationButton').should('be.disabled')
    cy.get('[data-cy="actions"]').should('contain', 'Location fetched!')
  });

  it.only('should share a location Url', () => {
    let username = "cemil eserli"
    cy.get('[data-cy="name-input"]').type(username)
    cy.get('[data-cy="get-loc-btn"]').click()
    cy.get('[data-cy="share-loc-btn"]').click()
    cy.get('@copyToClipBoard').should('have.been.called')
    cy.get('@userLocation').then(fakeLocation => {
      const { latitude, longitude } = fakeLocation.coords;
      //cy.get('@copyToClipBoard').should('always.have.been.calledWithMatch', new RegExp(`${fakeLocation.coords.latitude}.*${fakeLocation.coords.longitude}.*${encodeURI(username)}`))
      cy.get('@copyToClipBoard').should('always.have.been.calledWithMatch', new RegExp(`${latitude}.*${longitude}.*${encodeURI(username)}`))
      cy.get('@storeLocation').should('have.been.called')
        .and('have.been.calledWithMatch', `${username}`, new RegExp(`${latitude}.*${longitude}.*${encodeURI(username)}`))
      cy.get('@getStoredLocation').should('have.been.called')
    })
    cy.get('[data-cy="info-message"]')
      .should('be.visible')
      .and('contain', 'clipboard')

    cy.tick(2000)
    cy.get('[data-cy="info-message"]').should('not.be.visible')

  })


});
