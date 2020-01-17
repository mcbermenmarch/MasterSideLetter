import { addFund,fundDeleteAPI} from '../support/util';
import {addFundProfileInvestor} from '../support/util';
let fund1,fund2,fund3;

describe('FundsPage', () => {

  beforeEach(function () {    
    cy.ntlm('https://localhost:44344','Manikanta.More','Chinnu@sirisep19','CORP');
    cy.visit('#/funds');
    cy.contains("All Funds");
    fundDeleteAPI();
  })

  //TC 1 -- already in home page tests
  //TC 2 -- already in home page tests

  //TC3
  it('it should verify all funds grid search', () => {
    
    cy.get('[data-cy="fundpage-search"]').type('search text');
    cy.get('[data-cy="click-seacrh"]').click();
  });

  //TC4 - removed advance filter

  //TC5 - add fund

  it('it should verify add fund from favorite funds grid ', () => {   
    cy.wait(1000); 
    fund1 = addFund();
  });

  //TC 6
  it('it should verify add fund with only name from favorite funds grid ',() => {

    var fundName = "Test"+Math.random().toString().slice(2,8);
    cy.get('[data-cy="add-fund-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);    
    cy.get('[data-cy="fund-save"]').click();
    cy.wait(1000);
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',fundName).within(() => {
        cy.get('[data-cy="fund-edit"]').click();      
        cy.wait(1000);
        cy.get(':nth-child(3) > p-celleditor > .w-100').type('Sponsor1');   
        cy.wait(1000);   
        cy.get('[data-cy="fund-save"]').click();  
        cy.contains('td','Sponsor1')
      });
    });     
  });

  //TC 12 add empty fund
  it('it should verify add an empty fund favorite funds grid ',() => {
    cy.get('[data-cy="add-fund-button"]').first().click(); 
    cy.wait(1000); 
    cy.get('[data-cy="fund-save"]').click();  
    cy.wait(1000);

    //delete fund
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {      
      cy.get('tr').eq(0).as('row');
    });
    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-delete"]').click();
    });
    //confirm delete the fund
    cy.get('[data-cy="delete-ok"]').click();  
  });  

  //TC 14
  it('it should verify delete the fund from favorites funds grid',() => {
    //add fund
    fund1 = addFund();   

    //select row from all funds grid and click delete
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {      
      cy.contains('tr',fund1).as('row');
    });
    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-delete"]').click();
    });
    //confirm delete the fund
    cy.get('[data-cy="delete-ok"]').click(); 

    //verify fund removed from favorites funds grid
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.get('tr').each(($tr, i) => {
        cy.get($tr).within(() => {
          cy.get('td').eq(1).should('not.have.attr',fund1)
          });
        });
      });
    //verify fund removed from all funds grid
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).should('not.have.attr','tr');
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.get('tr').each(($tr, i) => {
        cy.get($tr).within(() => {
          cy.get('td').eq(1).should('not.have.attr',fund1)
        });
      });
    });
  });

  //TC 15 delete fund
  it('it should verify delete the favorite fund from all funds grid',() => {
    //add fund
    fund1 = addFund();

    //select row from all funds grid and click delete
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {      
      cy.contains('tr',fund1).as('row');
    });
    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-delete"]').click();
    });
    //confirm delete the fund
    cy.get('[data-cy="delete-ok"]').click();  
    cy.wait(1000);    
    //verify fund removed from all funds grid
    
    cy.get('.ui-table-scrollable-body-table').eq(0).within(() =>{
     cy.get('.ui-table-tbody').should('not.contain',fund1)
    });
  });

  //TC 16
  it('it should verify delete the unfavorite fund from all funds grid',() => {
    //add fund
    fund1 = addFund();
    cy.wait(1000);   

    //unfavorite fund from favorites funds grid
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-unfavorite-icon"]').click();
      });      
    });      
    cy.wait(1000);
    cy.get('.ui-table-scrollable-body-table').eq(0).within(() =>{
      cy.get('.ui-table-tbody').should('not.contain',fund1)
    })
    //verify fund as unfavorite in all funds grid
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-favorite-icon"]').should('have.attr', 'title', 'Favorite')
      });      
    }); 

    //select row from all funds grid and click delete
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {      
      cy.contains('tr',fund1).as('row');
    });
    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-delete"]').click();
    });
    //confirm delete the fund
    cy.get('[data-cy="delete-ok"]').click();  
    cy.wait(1000);
    //verify fund removed from all funds grid
    
    cy.get('.ui-table-scrollable-body-table').eq(1).within(() =>{
      cy.get('.ui-table-tbody').should('not.contain',fund1)
    })
  });

  //TC 17 Dismiss delete fund from favorite funds grid
  it('it should verify dismiss delete fund from favorites funds grid',() => {
    //add fund
    fund1 = addFund();   

    //select row from all funds grid and click delete
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {      
      cy.contains('tr',fund1).as('row');
    });
    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-delete"]').click();
    });

    //cancel delete the fund
    cy.get('[data-cy="delete-cancel"]').click();  

    //verify fund still exists in from favorites funds grid
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',fund1)
    });  
        
  });

  //TC 18 
  it('it should verify dismiss delete fund from favorites funds grid',() => {
    cy.get('[data-cy="add-fund-button"]').first().click();
    cy.wait(1000);
    cy.get(':nth-child(2) > p-celleditor > .w-100').type('dismissEdit');    
    cy.get('[data-cy="fund-cancel"]').first().click();
  });

  //TC 19    
  it('it should verify select fund as favorite from all funds grid ',() => { 
    fund1 = addFund();
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-unfavorite-icon"]').click();
      });
    });      
    cy.wait(1000);     
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-favorite-icon"]').click();
      });
    });  
    //verify fund added in favorites grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });      
    });     

    //verify fund added in favorites grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });      
    }); 
      
  });

  //TC20 unfavorite fund from favorite funds grid
  it('it should verify unfavorite fund from favorite funds grid',() => { 
    fund1 = addFund();
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-unfavorite-icon"]').click();
      });
    });      
    cy.wait(1000);     
    //verify fund removed from favorites funds grid
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.contains('tr',fund1).within(function(){
        cy.get('[data-cy="fund-favorite-icon"]').should('have.attr', 'title', 'Favorite')
      });       
    });    
  });

  //TC 21 Open fund from Favorites funds grid & all funds grid
  it('it should verify open fund from favorites funds grid & all funds grid',() => { 
    fund1 = addFund();
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click();  
    cy.get('[data-cy="fundprofile-name"]').contains(fund1);
    cy.go('back');

    cy.get('[data-cy="all-funds-grid"]')
    .find('tbody>tr').contains(fund1).click();  
    cy.get('[data-cy="fundprofile-name"]').contains(fund1);
    cy.go('back');
  }); 

  //TC 22 verify favorites funds in Fund-profile
  it('it should verify verify favorites funds in fund-profile',() => { 
    fund1 = addFund();
    fund2 = addFund();
    fund3 = addFund();
    let fund4 = addFund();
    let fund5 = addFund();
    var favFundList = [fund1,fund2,fund3,fund4,fund5];
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click();   

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="favfund-name"]').eq(i).contains(favFundList[i].toString());
    }
  });

  //TC 23 verify recently viewed funds in Fund-profile
  it('it should verify recently viewed funds in fund-profile',() => { 
    fund1 = addFund(); 
    fund2 = addFund();
    fund3 = addFund();
    let fund4 = addFund();
    let fund5 = addFund();
    var favFundList = [fund1,fund2,fund3,fund4,fund5];
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click();   

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.go('back');
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund2).click(); 
    
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.reload();

    favFundList = [fund2,fund1,fund3,fund4,fund5];
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }

    cy.go('back');
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund3).click(); 

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.reload();

    favFundList = [fund3,fund2,fund1,fund4,fund5];
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }

    cy.go('back');
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund5).click(); 

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.reload();

    favFundList = [fund5,fund3,fund2,fund1,fund4];
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
  });  

  //TC 24 verify recently viewed funds in Fund-profile after fund delete
  it('it should verify recently viewed funds in fund-profile after fund delete',() => { 
    fund1 = addFund(); 
    fund2 = addFund();
    fund3 = addFund();
    let fund4 = addFund();
    let fund5 = addFund();
    var favFundList = [fund1,fund2,fund3,fund4,fund5];
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click();   

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.go('back');
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund2).click(); 
    
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.reload();

    favFundList = [fund2,fund1,fund3,fund4,fund5];
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }

    cy.go('back');
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund3).click(); 

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.reload();

    favFundList = [fund3,fund2,fund1,fund4,fund5];
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }

    cy.wait(1000);
    cy.go('back');    

    //select row from all funds grid and click delete
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {      
      cy.contains('tr',fund1).as('row');
    });
    cy.get('@row').within(() => {
      cy.get('[data-cy="fund-delete"]').click();
    });
    //confirm delete the fund
    cy.get('[data-cy="delete-ok"]').click();  
    cy.wait(2000);    
    

    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund5).click(); 

    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }
    cy.reload();

    favFundList = [fund5,fund3,fund2,fund4];
    for(var i = 0;i<favFundList.length;i++)
    {
      cy.get('[data-cy="recentfund-name"]').eq(i).contains(favFundList[i].toString());
    }    
  });  

  //TC 25
  it('it should verify add an existing investor in fund profile',() => { 
    fund1 =  addFundProfileInvestor();

    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Name")
    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Entity")
    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Type")
    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Commitment")
    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Counsel")
    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Notes")
    cy.get('[data-cy="fundprofile-investorgrid-header"]').contains("Side Letter")

  })

  //TC 26 add new investor in fund
  it('it should verify add an new investor in fund profile',() => { 
    fund1 = addFund();
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click();  
    cy.get('[data-cy="fundprofile-name"]').contains(fund1); 
    cy.get('[data-cy="fundprofile-menubar"]').within(() => {
      cy.contains('li','Add Investor').click()
    })

    cy.get('.ui-autocomplete .ui-autocomplete-input').type('NewInv');
    cy.get(':nth-child(3) > p-celleditor > .w-100').type('Entity1');
    cy.get(':nth-child(4) > p-celleditor > .w-100').type('Type1');
    cy.get(':nth-child(5) > p-celleditor > .w-100').type('Commitement1');
    cy.get(':nth-child(4) > p-celleditor > .w-100').type('Counce@law.com');
    cy.get(':nth-child(4) > p-celleditor > .w-100').type('Note Notes');
    cy.get('[data-cy="fundprofile-investor-save"]').click();

    //bug not saving new investor == need to uncomment
   /* cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
      cy.contains('tr','NewInv').as('row');        
      })
      cy.get('@row').within(() => {
       cy.contains('td','Type1')
       });*/
  });

  //TC 27 Edit fund investor
  it('it should verify edit investor in fund profile',() => { 
    var fundInvestor =  addFundProfileInvestor();  
    cy.get('[data-cy="fundprofile-name"]').contains(fundInvestor[0]);   
    
    
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
      cy.contains('tr',fundInvestor[1]).as('row');        
      })
      cy.wait(1000)
      cy.get('@row').within(() => {
        cy.get('[data-cy="fundprofile-investor-edit"]').click()
        cy.get(':nth-child(4) > p-celleditor > .w-100').type('type')
      });      
    cy.get('[data-cy="fundprofile-investor-save"]').click();
    });

  //TC 28 & 29 delete fund investor
  it('it should verify delte investor in fund profile',() => { 
    var fundInvestor =  addFundProfileInvestor();  
    cy.get('[data-cy="fundprofile-name"]').contains(fundInvestor[0]);       
    
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
      cy.contains('tr',fundInvestor[1]).as('row');        
      })
      cy.get('@row').within(() => {
        cy.get('[data-cy="fundprofile-investor-delete"]').click()
      });       
    cy.get('[data-cy="delete-cancel"]').click();  
    cy.get('@row').within(() => {
      cy.get('[data-cy="fundprofile-investor-delete"]').click()
    }); 
    cy.get('[data-cy="delete-ok"]').click();
    cy.get('.ui-table-scrollable-body-table').within(() =>{
      cy.get('.ui-table-tbody').should('not.contain',fundInvestor[1])
     });
    });

  //TC  30 dismiss edit fund profile investor
  it('it should verify dismiss edit fundprofileinvestor',() => { 
    var fundInvestor =  addFundProfileInvestor();  
    cy.get('[data-cy="fundprofile-name"]').contains(fundInvestor[0]);
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
      cy.contains('tr',fundInvestor[1]).as('row');        
      })
      cy.wait(1000)
      cy.get('@row').within(() => {
        cy.get('[data-cy="fundprofile-investor-edit"]').click()
      });      
    cy.get('[data-cy="fundprofile-investor-cancel"]').click();
    });
  
  //TC 31 dismiss adding investor to fund profile
  it('it should verify dismiss adding investor to fund profile',() => { 
    fund1 =  addFund();  
    
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click(); 
    cy.get('[data-cy="fundprofile-name"]').contains(fund1);   
    cy.wait(1000); 
    cy.get('[data-cy="fundprofile-menubar"]').within(() => {
      cy.contains('li','Add Investor').click()
    })
    cy.get('[data-cy="fundprofile-investor-cancel"]').click();    
  });

  //TC 39 route to fund from favorites funds display
  it('it should verify route to fund from favorites funds display',() => { 
    fund1 =  addFund(); 
    fund2 = addFund();     
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click(); 
    cy.wait(1000); 
    cy.get('[data-cy="fundprofile-name"]').contains(fund1);   
    cy.get('[data-cy="favfunds-list"]').within(() => {
      cy.get('[data-cy="favfund-name"]').contains(fund2).click();    
    })
    cy.get('[data-cy="fundprofile-name"]').contains(fund2);  
  });

  //TC 40 route to fund from recent funds display
  it('it should verify route to fund from favorites funds display',() => { 
    fund1 =  addFund(); 
    fund2 = addFund();     
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click(); 
    cy.wait(1000); 
    cy.get('[data-cy="fundprofile-name"]').contains(fund1);   
    cy.get('[data-cy="recentfunds-list"]').within(() => {
      cy.get('[data-cy="recentfund-name"]').contains(fund2).click();    
    })
    cy.get('[data-cy="recentfund-name"]').contains(fund2);  
  });

  //TC 41 unfavorite a fund from favorites funds list in display
  it('it should verify unfavorite fund from favoritesfunds list in display',() => { 
    //add funds
    fund1 =  addFund(); 
    fund2 = addFund();   

    //navigate to fund1
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click(); 
    cy.wait(1000);   
    cy.get('[data-cy="fundprofile-name"]').contains(fund1); 

    //unfavorite fund1
    cy.get('[data-cy="favfunds-list"]').within(() =>{
        cy.contains('div',fund1).within(() => {        
          cy.get('[data-cy="fund-unfavorite-icon"]').click();
        })
    })
    //verify unfavorite done   
    cy.get('[data-cy="favfunds-list"]').within(() => {
      cy.get('div').should('not.contain',fund1)   
    })
    //navigate to funds page
    cy.get('[data-cy="funds-component"]').click()
    cy.get('[data-cy="favorite-funds-grid"]').within(() =>{
      cy.get('tr').should('not.contain',fund1) 
    });
  });

  //TC 42 unfavorite a fund from recent funds list in display
  it('it should verify unfavorite fund from recentfunds list in display',() => { 

    //add funds
    fund1 =  addFund(); 

    //navigate to fund1
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fund1).click(); 
    cy.get('[data-cy="fundprofile-name"]').contains(fund1); 

    //unfavorite fund1
    cy.get('[data-cy="recentfunds-list"]').within(() =>{
        cy.contains('div',fund1).within(() => {        
        cy.get('[data-cy="fund-unfavorite-icon"]').click();
        })
      })
    cy.wait(2000)
    //verify unfavorite done 
    cy.get('[data-cy="recentfunds-list"]').within(() =>{
      cy.contains('div',fund1).within(() => { 
        cy.get('[data-cy="fund-favorite-icon"]').should('have.attr', 'title', 'Favorite')
        }); 
      })
    
    //navigate to funds page
    cy.get('[data-cy="funds-component"]').click()
    cy.get('[data-cy="favorite-funds-grid"]').within(() =>{
      cy.get('tr').should('not.contain',fund1) 
      })
    cy.get('[data-cy="all-funds-grid"]').within(() =>{
      cy.get('tr').should('contain',fund1) 
      });  
    });
});