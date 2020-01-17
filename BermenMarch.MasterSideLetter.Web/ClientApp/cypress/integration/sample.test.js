
import { homeaddInvestorInFavorites,investorDeleteAPI} from '../support/util';
import { addInvestorInRecent} from '../support/util';
let investor1,investor2,investor3;

describe('Home Page', () => {
  
    beforeEach(function () {    
        cy.ntlm('https://localhost:44344','Manikanta.More','Chinnu@sirisep19','CORP');
        cy.visit('/');
        cy.contains("Home");
        investorDeleteAPI();
      })
  

  it('TC21 :it should verify investor favorite grid columns',() => {

    cy.get('[data-cy="investor-grid-headers"]').first().contains('Name');
    cy.get('[data-cy="investor-grid-headers"]').first().contains('Type');
    cy.get('[data-cy="investor-grid-headers"]').first().contains('Aggregated $');
    cy.get('[data-cy="investor-grid-headers"]').first().contains('No.');
    cy.get('[data-cy="investor-grid-headers"]').first().contains('Recent Investments'); 
    cy.get('[data-cy="investor-grid-headers"]').first().contains('Viewed');    
  });

  it('TC22 :it should verify recenlty viewed investor grid columns',() => {
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Name');
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Type');
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Aggregated $');
    cy.get('[data-cy="investor-grid-headers"]').last().contains('No.');
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Recent Investments'); 
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Viewed'); 
  });

  it('TC23 :it should verify add investor in favorite investors grid',() => {    
    investor1 =homeaddInvestorInFavorites()
  });
  
  it('TC24 :it should verify dismiss edit investor in favorite investors grid',() => {
          
    investor1 =homeaddInvestorInFavorites()
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="investor-edit"]').click();    
        cy.get('[data-cy="investor-cancel"]').click();
      });
  });

  it('TC25 :it should verify edit investor in favorite investors grid',() => {
    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="investor-edit"]').click();  
        cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type('Updated');
        cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(3) > p-celleditor > .w-100').type('TypeUpdate');
        cy.get('[data-cy="investor-save"]').click();
      });
      cy.wait(1000)
      cy.get('[data-cy="favorite-investors"]').within(() => {
        cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','TypeUpdate')
      })

      cy.get('[data-cy="recent-investors"]').within(() => {
          cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','TypeUpdate')
      })
  });

  it('TC26 :it should verify dismiss investor delete in favorite investor grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })

    cy.get('@row').within(() => { 
        cy.get('[data-cy="investor-delete"]').click();
    })
    cy.get('[data-cy="delete-cancel"]').click();
    cy.get('[data-cy="favorite-investors"]').within(() => {
        cy.contains('tr',investor1)
    })
  }); 

  it('TC27 :it should verify unfavorite investor from favorite investor grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })

    cy.get('@row').within(() => {
      cy.get('[data-cy="investor-unfavorite-icon"]').click();
    })
    cy.wait(1000);
    cy.get('[data-cy="favorite-investors"]').should('not.contain',investor1)     

  });

  it('TC28 :it should verify last viewed column',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).within(() => {
        cy.get('[data-cy="last-accessed-date"]').should('contain', '');
        });        
      })
      cy.get('[data-cy="favorite-investors"]')
      .find('tbody>tr').contains(investor1).click();
  
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);
      cy.wait(2000);
      cy.get('[data-cy="home-component"]').click()
      cy.contains("Home");
  
      const todaysDate = Cypress.moment().format('MM/D/YY')
  
      cy.get('[data-cy="favorite-investors"]').within(() => {
        cy.contains('tr',investor1).within(() => {
          cy.get('[data-cy="last-accessed-date"]').should('contain',todaysDate);
          });        
        })
  });

  it('TC29 :it should verify route to investor profile from favorite investor grid',() => {

    cy.get('[data-cy="add-investor-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type('PannierUpdated');
    cy.get(':nth-child(3) > p-celleditor > .w-100').type('Lind');
    cy.get('[data-cy="investor-save"]').click();
    cy.wait(2000);

    cy.get('[data-cy="favorite-investors"]')
    .find('tbody>tr').contains('PannierUpdated').click();
    cy.wait(2000);

    cy.get('[data-cy="investorprofile-name"]').contains('PannierUpdated');
    cy.get('[data-cy="investorprofile-type"]').contains('Lind');
    cy.get('[data-cy="home-component"]').click()
    cy.contains("Home");
  });

  it('TC30 :it should verify investor delete in favorite investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })

    cy.get('@row').within(() => { 
        cy.get('[data-cy="investor-delete"]').click();
    })
    cy.get('[data-cy="delete-ok"]').click();
    cy.wait(1000)
    cy.get('[data-cy="favorite-investors"]').should('not.contain',investor1)
    cy.get('[data-cy="recent-investors"]').should('not.contain',investor1)

  });  

  it('TC31 :it should verify sorting functionality favorite investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    investor2 = homeaddInvestorInFavorites();
    investor3 = homeaddInvestorInFavorites();
    var a = [investor1,investor2,investor3];
    a.sort();

    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.get('tr').eq(1).contains(a[0]);
      cy.get('tr').eq(2).contains(a[1]);
      cy.get('tr').eq(3).contains(a[2]);
    });

    cy.get('[data-cy="investor-grid-headers"]').first().contains('Name').click();
    cy.wait(2000);
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.get('tr').eq(1).contains(a[2]);
      cy.get('tr').eq(2).contains(a[1]);
      cy.get('tr').eq(3).contains(a[0]);
      });  
      
    cy.get('[data-cy="investor-grid-headers"]').first().contains('Name').click();
  });

  it('TC32 :it should verify sorting functionality recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    investor2 = homeaddInvestorInFavorites();
    investor3 = homeaddInvestorInFavorites();
    var a = [investor1,investor2,investor3];
    a.sort();

    var table = cy.get('[data-cy="recent-investors"]').within(() => {
    table.get('tr').eq(1).contains(a[0]);
    table.get('tr').eq(2).contains(a[1]);
    table.get('tr').eq(3).contains(a[2]);
    });   
    
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Name').click();
    cy.wait(2000);
    var table1 = cy.get('[data-cy="recent-investors"]').within(() => {
      table1.get('tr').eq(1).contains(a[2]);
      table1.get('tr').eq(2).contains(a[1]);
      table1.get('tr').eq(3).contains(a[0]);
      });    
      
    cy.get('[data-cy="investor-grid-headers"]').last().contains('Name').click();
  });

  it('TC33 :it should verify dismiss edit investor in recent investors grid',() => {

    var investor1 = homeaddInvestorInFavorites();
    cy.reload();
    var row = cy.get('[data-cy="recent-investors"]').contains(investor1);
    cy.get('[data-cy="recent-investors"]').within(() => {
      
        cy.get('[data-cy="investor-edit"]').click();    
        cy.get('[data-cy="investor-cancel"]').click();

    });

  });

  it('TC34 :it should verify edit investor in recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="recent-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="investor-edit"]').click();  
        cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type('Updated');
        cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(3) > p-celleditor > .w-100').type('typeUpdate');
        cy.get('[data-cy="investor-save"]').click();
      });
      cy.wait(1000)
      cy.get('[data-cy="favorite-investors"]').within(() => {
        cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','typeUpdate')
      })

      cy.get('[data-cy="recent-investors"]').within(() => {
          cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','typeUpdate')
      })
  });

  it('TC35 :it should verify dismiss investor delete in recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="recent-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })

    cy.get('@row').within(() => { 
        cy.get('[data-cy="investor-delete"]').click();
    })
    cy.get('[data-cy="delete-cancel"]').click();
    cy.get('[data-cy="recent-investors"]').within(() => {
        cy.contains('tr',investor1)
    })

  });    

  it('TC36 :it should verify investor unfavorite in recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="recent-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })

    cy.get('@row').within(() => {
      cy.get('[data-cy="investor-unfavorite-icon"]').click();
    })
    cy.wait(1000);
    cy.get('[data-cy="favorite-investors"]').should('not.contain',investor1)    

  });    

  it('TC37 :it should verify last viewed column  in recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="favorite-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })
  
      cy.get('@row').get('[data-cy="last-accessed-date"]').should('contain', '');

      cy.get('[data-cy="recent-investors"]').within(() => {
        cy.contains('tr',investor1).as('row');        
        })
    
        cy.get('@row').get('[data-cy="last-accessed-date"]').should('contain', '');
  
      cy.get('[data-cy="recent-investors"]')
      .find('tbody>tr').contains(investor1).click();
  
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);
      cy.wait(2000);
      cy.get('[data-cy="home-component"]').click()
      cy.contains("Home");
  
      const todaysDate = Cypress.moment().format('MM/D/YY')
  
      cy.get('[data-cy="recent-investors"]')
      .find('tbody>tr').contains(investor1).as('row');
  
      cy.get('@row').get('[data-cy="last-accessed-date"]').first().contains(todaysDate) 
  });

  it('TC38 :it should verify route to investor profile from recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
    cy.get('[data-cy="recent-investors"]').within(() => {
      cy.contains('tr',investor1).as('row');        
      })
    cy.get('[data-cy="recent-investors"]')
    .find('tbody>tr').contains(investor1).click();

    cy.get('[data-cy="investorprofile-name"]').contains(investor1);
    cy.get('[data-cy="home-component"]').click()
    cy.contains("Home");
  });

  it('TC39 :it should verify investor delete in recent investors grid',() => {

    investor1 = homeaddInvestorInFavorites();
  
      cy.get('[data-cy="recent-investors"]').within(()=>{

        cy.get('tr').contains(investor1).as('row');
        cy.get('@row').get('[data-cy="investor-delete"]').first().click(); 
       
      })
      cy.get('[data-cy="delete-ok"]').click();

  });   
});