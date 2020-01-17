import { addFund,fundDeleteAPI} from '../support/util';
let fund1,fund2,fund3;
import { homeaddInvestorInFavorites,investorDeleteAPI} from '../support/util';
let investor1,investor2,investor3;

describe('Home Page', () => {

  beforeEach(function () {    
    cy.ntlm('https://localhost:44344','Manikanta.More','Chinnu@sirisep19','CORP');
    cy.visit('/');
    cy.contains("Home");
    fundDeleteAPI();
    investorDeleteAPI();
  })
 

  it('TC2 :it should verify funds favorite grid columns',() => {

    cy.get('[data-cy="favorites-fund-header"]').first().contains('Name');
    cy.get('[data-cy="favorites-fund-header"]').first().contains('Sponsor');
    cy.get('[data-cy="favorites-fund-header"]').first().contains('BusinessUnit');
    cy.get('[data-cy="favorites-fund-header"]').first().contains('Year');
    cy.get('[data-cy="favorites-fund-header"]').first().contains('Size');    
    cy.get('[data-cy="favorites-fund-header"]').first().contains('Strategy');
    cy.get('[data-cy="favorites-fund-header"]').first().contains('Viewed');    
    cy.get('[data-cy="favorites-fund-header"]').first().contains('MSL');    
    cy.get('[data-cy="favorites-fund-header"]').first().contains('MFN');
  });

  it('TC3 :it should verify recenlty viewed funds grid columns',() => {
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Name');
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Sponsor');
    cy.get('[data-cy="favorites-fund-header"]').last().contains('BusinessUnit');
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Year');
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Size');    
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Strategy');
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Viewed');       
    cy.get('[data-cy="favorites-fund-header"]').first().contains('MSL');    
    cy.get('[data-cy="favorites-fund-header"]').first().contains('MFN');
  });

  it('TC4 :it should verify add fund in favorite funds grid',() => {

    cy.get('[data-cy="add-fund-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type('Pannier');
    cy.get(':nth-child(3) > p-celleditor > .w-100').type('Lind');
    cy.get(':nth-child(4) > p-celleditor > .w-100').type('Harvey-Smitham');    
    cy.get(':nth-child(5) > p-celleditor > .w-100').type('2019');
    cy.get(':nth-child(6) > p-celleditor > .w-100').type('120');
    cy.get(':nth-child(7) > p-celleditor > .w-100').type('HealthCare');
    cy.get('[data-cy="fund-save"]').click();

    cy.get('[data-cy="favorite-funds"]').find('tbody>tr').contains('Pannier').as('row');
  
    cy.get('@row').get('[data-cy="last-accessed-date"]').first().should('contain', '');
    cy.wait(2000);

    cy.get('[data-cy="recent-funds"]').find('tbody>tr').contains('Pannier').as('row');
  
    cy.get('@row').get('[data-cy="last-accessed-date"]').first().should('contain', '');
  });

  
  it('TC5 :it should verify dismiss edit fund in favorite funds grid',() => {
          
    fund1 = addFund();
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
      cy.contains('tr',fund1).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="fund-edit"]').click();    
        cy.get('[data-cy="fund-cancel"]').click();
      });
  });

  it('TC6 :it should verify edit fund in favorite funds grid',() => {
    fund1 = addFund();
    cy.get('[data-cy="favorite-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="fund-edit"]').click();  
        cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type('Updated');
        cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(3) > p-celleditor > .w-100').type('SponsorUpdate');
        cy.get(':nth-child(4) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(4) > p-celleditor > .w-100').type('BUUpdate');
        cy.get(':nth-child(5) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(5) > p-celleditor > .w-100').type('2018');
        cy.get(':nth-child(6) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(6) > p-celleditor > .w-100').type('119');
        cy.get(':nth-child(7) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(7) > p-celleditor > .w-100').type('StrategyUpdate');
        cy.get('[data-cy="fund-save"]').click();
      });
      cy.wait(1000)
      cy.get('[data-cy="favorite-funds"]').within(() => {
        cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','SponsorUpdate')
        cy.contains('td','BUUpdate')
        cy.contains('td','2018')
        cy.contains('td','119')
        cy.contains('td','StrategyUpdate')
      })

      cy.get('[data-cy="recent-funds"]').within(() => {
          cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','SponsorUpdate')
        cy.contains('td','BUUpdate')
        cy.contains('td','2018')
        cy.contains('td','119')
        cy.contains('td','StrategyUpdate')
      })
  });

  it('TC7 :it should verify dismiss fund delete in favorite funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="favorite-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })

    cy.get('@row').within(() => { 
        cy.get('[data-cy="fund-delete"]').click();
    })
    cy.get('[data-cy="delete-cancel"]').click();
    cy.get('[data-cy="favorite-funds"]').within(() => {
        cy.contains('tr',fund1)
    })
  }); 

  it('TC8 :it should verify unfavorite fund from favorite funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="favorite-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })

    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-unfavorite-icon"]').click();
    })
    cy.wait(1000);
    cy.get('[data-cy="favorite-funds"]').should('not.contain',fund1)     

  });

  it('TC9 :it should verify last viewed column',() => {

    fund1 = addFund();
    cy.get('[data-cy="favorite-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })
  
      cy.get('@row').get('[data-cy="last-accessed-date"]').should('contain', '');
  
      cy.get('[data-cy="favorite-funds"]')
      .find('tbody>tr').contains(fund1).click();
  
      cy.get('[data-cy="fundprofile-name"]').contains(fund1);
      cy.wait(2000);
      cy.get('[data-cy="home-component"]').click()
      cy.contains("Home");
  
      const todaysDate = Cypress.moment().format('MM/D/YY')
  
      cy.get('[data-cy="favorite-funds"]')
      .find('tbody>tr').contains(fund1).as('row');
  
      cy.get('@row').get('[data-cy="last-accessed-date"]').first().contains(todaysDate) 
  });

  it('TC10 :it should verify route to fund profile from favorite funds grid',() => {

    cy.get('[data-cy="add-fund-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type('PannierUpdated');
    cy.get(':nth-child(3) > p-celleditor > .w-100').type('Lind');
    cy.get(':nth-child(4) > p-celleditor > .w-100').type('Harvey-Smitham');    
    cy.get(':nth-child(5) > p-celleditor > .w-100').type('2019');
    cy.get(':nth-child(6) > p-celleditor > .w-100').type('120');
    cy.get(':nth-child(7) > p-celleditor > .w-100').type('HealthCare');
    cy.get('[data-cy="fund-save"]').click();
    cy.wait(2000);

    cy.get('[data-cy="favorite-funds"]')
    .find('tbody>tr').contains('PannierUpdated').click();
    cy.wait(2000);

    cy.get('[data-cy="fundprofile-name"]').contains('PannierUpdated');
    cy.get('[data-cy="fundprofile-sponsor"]').contains('Lind');
    cy.get('[data-cy="fundprofile-businessunit"]').contains('Harvey-Smitham');    
    cy.get('[data-cy="fundprofile-year"]').contains('2019');
    cy.get('[data-cy="fundprofile-size"]').contains('120');
    cy.get('[data-cy="fundprofile-strategy"]').contains('HealthCare');
    cy.get('[data-cy="home-component"]').click()
    cy.contains("Home");
  });

  it('TC11 :it should verify fund delete in favorite funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="favorite-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })

    cy.get('@row').within(() => { 
        cy.get('[data-cy="fund-delete"]').click();
    })
    cy.get('[data-cy="delete-ok"]').click();
    cy.wait(1000)
    cy.get('[data-cy="favorite-funds"]').should('not.contain',fund1)
    cy.get('[data-cy="recent-funds"]').should('not.contain',fund1)

  });  

  it('TC12 :it should verify sorting functionality favorite funds grid',() => {

    fund1 = addFund();
    cy.reload();
    fund2 = addFund();
    
    cy.reload();
    fund3 = addFund();
    cy.reload();

    var a = [fund1,fund2,fund3];
    a.sort();

    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.get('tr').eq(0).contains(a[0]);
      cy.get('tr').eq(1).contains(a[1]);
      cy.get('tr').eq(2).contains(a[2]);
    });

    cy.get('[data-cy="favorites-fund-header"]').first().contains('Name').click();
    cy.wait(2000);
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.get('tr').eq(0).contains(a[2]);
      cy.get('tr').eq(1).contains(a[1]);
      cy.get('tr').eq(2).contains(a[0]);
      });  
      
    cy.get('[data-cy="favorites-fund-header"]').first().contains('Name').click();
  });

  //home component - recent Favorite Grid Test Cases
  it('TC13 :it should verify sorting functionality recent funds grid',() => {

    fund1 = addFund();
    fund2 = addFund();
    fund3 = addFund();
    var a = [fund1,fund2,fund3];
    a.sort();

    var table = cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
    table.get('tr').eq(0).contains(a[0]);
    table.get('tr').eq(1).contains(a[1]);
    table.get('tr').eq(2).contains(a[2]);
    });   
    
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Name').click();
    cy.wait(2000);
    var table1 = cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      table1.get('tr').eq(0).contains(a[2]);
      table1.get('tr').eq(1).contains(a[1]);
      table1.get('tr').eq(2).contains(a[0]);
      });    
      
    cy.get('[data-cy="favorites-fund-header"]').last().contains('Name').click();
  });

  it('TC14 :it should verify dismiss edit fund in recent funds grid',() => {

    var fund1 = addFund();
    cy.reload();
    var row = cy.get('[data-cy="recent-funds"]').contains(fund1);
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      
        cy.get('[data-cy="fund-edit"]').eq(0).click();    
        cy.get('[data-cy="fund-cancel"]').eq(0).click();

    });

  });

  it('TC15 :it should verify edit fund in recent funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="recent-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="fund-edit"]').click();  
        cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type('Updated');
        cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(3) > p-celleditor > .w-100').type('SponsorUpdate');
        cy.get(':nth-child(4) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(4) > p-celleditor > .w-100').type('BUUpdate');
        cy.get(':nth-child(5) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(5) > p-celleditor > .w-100').type('2018');
        cy.get(':nth-child(6) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(6) > p-celleditor > .w-100').type('119');
        cy.get(':nth-child(7) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(7) > p-celleditor > .w-100').type('StrategyUpdate');
        cy.get('[data-cy="fund-save"]').click();
      });
      cy.wait(1000)
      cy.get('[data-cy="favorite-funds"]').within(() => {
        cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','SponsorUpdate')
        cy.contains('td','BUUpdate')
        cy.contains('td','2018')
        cy.contains('td','119')
        cy.contains('td','StrategyUpdate')
      })

      cy.get('[data-cy="recent-funds"]').within(() => {
          cy.contains('tr','Updated').as('row');        
      })
      cy.get('@row').within(() => {

        cy.contains('td','SponsorUpdate')
        cy.contains('td','BUUpdate')
        cy.contains('td','2018')
        cy.contains('td','119')
        cy.contains('td','StrategyUpdate')
      })
  });

  it('TC16 :it should verify dismiss fund delete in recent funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="recent-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })

    cy.get('@row').within(() => { 
        cy.get('[data-cy="fund-delete"]').click();
    })
    cy.get('[data-cy="delete-cancel"]').click();
    cy.get('[data-cy="recent-funds"]').within(() => {
        cy.contains('tr',fund1)
    })

  });    

  it('TC17 :it should verify fund unfavorite in recent funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="recent-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })

    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-unfavorite-icon"]').click();
    })
    cy.wait(1000);
    cy.get('[data-cy="favorite-funds"]').should('not.contain',fund1)    

  });    

  it('TC18 :it should verify last viewed column  in recent funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="favorite-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })
  
      cy.get('@row').get('[data-cy="last-accessed-date"]').should('contain', '');

      cy.get('[data-cy="recent-funds"]').within(() => {
        cy.contains('tr',fund1).as('row');        
        })
    
        cy.get('@row').get('[data-cy="last-accessed-date"]').should('contain', '');
  
      cy.get('[data-cy="recent-funds"]')
      .find('tbody>tr').contains(fund1).click();
  
      cy.get('[data-cy="fundprofile-name"]').contains(fund1);
      cy.wait(2000);
      cy.get('[data-cy="home-component"]').click()
      cy.contains("Home");
  
      const todaysDate = Cypress.moment().format('MM/D/YY')
  
      cy.get('[data-cy="recent-funds"]')
      .find('tbody>tr').contains(fund1).as('row');
  
      cy.get('@row').get('[data-cy="last-accessed-date"]').first().contains(todaysDate) 
  });

  it('TC19 :it should verify route to fund profile from recent funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="recent-funds"]').within(() => {
      cy.contains('tr',fund1).as('row');        
      })
    cy.get('[data-cy="recent-funds"]')
    .find('tbody>tr').contains(fund1).click();

    cy.get('[data-cy="fundprofile-name"]').contains(fund1);
    cy.get('[data-cy="home-component"]').click()
    cy.contains("Home");
  });

  it('TC20 :it should verify fund delete in recent funds grid',() => {

    fund1 = addFund();
    cy.get('[data-cy="recent-funds"]').within(()=>{
  
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(()=>{

        cy.get('tr').contains(fund1).as('row');
        cy.get('@row').get('[data-cy="fund-delete"]').first().click(); 
       
      })
      cy.get('[data-cy="delete-ok"]').click();

    })    
  });    

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
