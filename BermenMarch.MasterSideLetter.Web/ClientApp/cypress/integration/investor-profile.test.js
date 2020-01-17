import { addInvestorInFavorites,investorDeleteAPI} from '../support/util';
import { addInvestorInRecent} from '../support/util';
let investor1,investor2,investor3;

describe('Investors Profile Page', () => {
    beforeEach(function () {    
        cy.ntlm('https://localhost:44344','Manikanta.More','Chinnu@sirisep19','CORP');
        cy.visit('#/investors');
        cy.contains("All Investors");
        investorDeleteAPI();
    })

    //TC21  verify investor profile  display
    it('21: it should verify investor profile display',() => { 
      investor1 =  addInvestorInFavorites(); 
      cy.get('[data-cy="favorite-investors-grid"]')
      .find('tbody>tr').contains(investor1).click();      
      cy.get('[data-cy="investorprofile-title"]').contains('Investor Profile');
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);
      cy.get('[data-cy="favorite-title"]').contains('Favorite Investors');
      cy.get('[data-cy="recently-title"]').contains('Recently Viewed');
    });

    //open investor from favorite investors display in investor profile
    it('22: it should open investor from favorite investors display', () => {

      investor1 =  addInvestorInFavorites(); 
      investor2 =  addInvestorInFavorites();
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);      
      cy.get('[data-cy="fav-investor-link"]').contains(investor2).click();
      cy.get('[data-cy="investorprofile-name"]').contains(investor2);
    });

    //open an investor from all investors
    it('23: it should open investor from recenlty viewed investors', () => {

      investor1 =  addInvestorInRecent(); 
      investor2 =  addInvestorInRecent();
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 
      cy.go('back');   
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor2).click(); 
      cy.get('[data-cy="recent-investor-link"]').contains(investor1).click();
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);
    });

    //TC 24 verify recently viewed investors in investor-profile
    it('24: it should verify recently viewed investors in investor-profile',() => { 

      //create 3 investors
      investor1 = addInvestorInRecent(); 
      investor2 = addInvestorInRecent();
      investor3 = addInvestorInRecent();      

      //open investor1
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor1).click(); 
      cy.wait(1000) 
      //verify recntl investors in investor1
      cy.get('[data-cy="recent-investor-link"]').should('have.length', 0)     
      cy.go('back');
      //open investor2
      var recentInvestorList = [investor1]
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor2).click(); 
      cy.wait(1000)
      cy.get('[data-cy="recent-investor-link"]').should('have.length', 1)   
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="recent-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      } 

      //open investor3
      cy.go('back');
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor3).click(); 
      cy.wait(1000)
      cy.get('[data-cy="recent-investor-link"]').should('have.length', 2)  
      //verify recent  investors in investor3
      var recentInvestorList = [investor2,investor1]
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="recent-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      }      
      cy.get('[data-cy="recent-investor-link"]').contains(investor1).click();
      cy.wait(1000)
      cy.get('[data-cy="recent-investor-link"]').should('have.length',3)  
      //verify recent  investors in investor1
      var recentInvestorList = [investor3,investor2,investor1]
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="recent-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      }      
      cy.reload()
      var recentInvestorList = [investor1,investor3,investor2]
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="recent-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      } 

    });  

    //TC 25 verify favorite investors in investor-profile
    it('25: it should verify favorite investors in investor-profile',() => { 

      //create 3 investors
      investor1 = addInvestorInFavorites(); 
      investor2 = addInvestorInFavorites();
      investor3 = addInvestorInFavorites();
      var recentInvestorList = [investor1,investor2,investor3]

      //open investor1
      cy.get('[data-cy="favorite-investors-grid"]')
      .find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="fav-investor-link"]').should('have.length', 3)

      //verify fav investors in investor1
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="fav-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      }
        
      //open investor2
      cy.get('[data-cy="fav-investor-link"]').contains(investor2).click();
      cy.wait(1000)
      //verify fav investors in investor2
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="fav-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      }

      //open investor3
      cy.get('[data-cy="fav-investor-link"]').contains(investor3).click();
      cy.wait(1000)
      //verify fav investors in investor3
      for(var i = 0;i<recentInvestorList.length;i++)
      {
        cy.get('[data-cy="fav-investor-link"]').eq(i).contains(recentInvestorList[i].toString());
      }
    }); 

    //TC 26 select an investor as favorite from all investors
    it('26: it should select investor as favorite from all investors',() => { 

      //create 3 investors
      investor1 = addInvestorInRecent(); 
      investor2 = addInvestorInRecent();     

      //open investor1
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor1).click(); 
      cy.wait(1000) 
      cy.get('[data-cy="recent-investor-link"]').should('have.length', 0)      
      cy.get('[data-cy="fav-investor-link"]').should('have.length', 0)       
      cy.go('back');

      //open investor2
      var recentInvestorList = [investor1]
      cy.get('[data-cy="all-investors-grid"]').find('tbody>tr').contains(investor2).click(); 
      cy.wait(1000);

      cy.get('[data-cy="investorprofile-recent"]').within(() => {
        cy.contains('div',investor1).within(() => 
          {
            cy.get('[data-cy="investor-favorite-icon"]').click()
          })
      })

      cy.get('[data-cy="fav-investor-link"]').contains(investor1)  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-recent"]').within(() => {
        cy.contains('div',investor1).within(() => 
          {
            cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          })
      })

      cy.go('back');
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1);
      cy.get('[data-cy="all-investors-grid"]').within(() => {      
        cy.contains('tr',investor1).as('row');
      });
      cy.get('@row').within(() => {
        cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });
    });  


     //TC 27 unfavorite an investor from favorites investors list
     it('27: it should verify unfavorite investor in favorites investors',() => { 

      //create 2 investors
      investor1 = addInvestorInFavorites(); 
      investor2 = addInvestorInFavorites();

      //open investor1
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click(); 
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-favorites"]').within(() => {      
          cy.contains('div',investor1).as('investor');
        });
        cy.get('@investor').within(() => {
          cy.get('[data-cy="investor-unfavorite-icon"]').click()
      });
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-favorites"]').should('not.contain',investor1)
      cy.go('back');
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').should('not.contain',investor1)

      cy.get('[data-cy="all-investors-grid"]').within(() => {      
          cy.contains('tr',investor1).as('investor');
        });
        cy.get('@investor').within(() => {
          cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
      });

    });

    //TC 28 unfavorite an investor from recently viewed investors display
    it('28: it should verify unfavorite an investor from recently viewed investors display',() => { 

      //create 2 investors
      investor1 = addInvestorInFavorites(); 
      //open investor1
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click(); 
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-recent"]').within(() => {      
          cy.contains('div',investor1).as('investor');
        });
        //unfavorite investor
        cy.get('@investor').within(() => {
          cy.get('[data-cy="investor-unfavorite-icon"]').click()
      });
      cy.wait(1000)
      //verify investor not visible in favorites investors display
      cy.get('[data-cy="investorprofile-favorites"]').should('not.contain',investor1)

      //verify investor not visible in recent investors display
      cy.get('[data-cy="investorprofile-recent"]').within(() => {      
          cy.contains('div',investor1).as('investor');
        });
        cy.get('@investor').within(() => {
          cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
      });

      cy.go('back');
      //verify investor not visbile in favorites investors list component
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').should('not.contain',investor1)

      //verify investor not visbile as favorite in all investors in investors list component
      cy.get('[data-cy="all-investors-grid"]').within(() => {      
          cy.contains('div',investor1).as('investor');
        });
        cy.get('@investor').within(() => {
          cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
      });

    }); 


    //TC 29 add fund with full details ==Bug
    it('29: it should add fund with full detail',() => { 

      //create investor
      investor1 = addInvestorInFavorites(); 

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);           

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type('fundName');
      
      cy.get(':nth-child(3) > p-celleditor > .w-100').type('Entity1');    
      cy.get(':nth-child(4) > p-celleditor > .w-100').type('Sponsor1'); 
      cy.get(':nth-child(5) > p-celleditor > .w-100').type('BU1');         
      cy.get(':nth-child(6) > p-celleditor > .w-100').type('Strategy1');       
            
      cy.get(':nth-child(7) > p-celleditor > .w-100').type('2019');        
      cy.get(':nth-child(8) > p-celleditor > .w-100').type('139');        
      cy.get(':nth-child(9) > p-celleditor > .w-100').type('Commitment1');        
      cy.get(':nth-child(10) > p-celleditor > .w-100').type('Councel1@law.com');        
      cy.get(':nth-child(11) > p-celleditor > .w-100').type('NotesNotes'); 

      //save investor
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verification should be add

    }); 

    //TC 30 add fund with full details ==Bug
    it('30: it should Add fund with empty details',() => { 
      //create investor
      investor1 = addInvestorInFavorites(); 

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);           

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();
    });

    //TC 31 add an existing fund from the auto populate dropdown
    it('31: it should add an existing fund from the auto populate dropdown',() => { 

      //create investor
      investor1 = addInvestorInFavorites();

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 

      cy.get('[data-cy ="funds-component"]').click();

      var fundName = "Test"+Math.random().toString().slice(2,8);
      var sponsorName = "spon"+Math.random().toString().slice(2,8);
      var buName = "BU"+Math.random().toString().slice(2,8);
      var strategyName = "str"+Math.random().toString().slice(2,8);
      var year = '2019'
      var size = '65'
      cy.get('[data-cy="add-fund-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
      cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
      cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
      cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
      cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
      cy.get('[data-cy="fund-save"]').click();
      cy.go('back');
      cy.wait(1000)

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);

      cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verify fund added or not
      cy.contains('tr',fundName).eq(0).within(() => {

        cy.get('td').contains(sponsorName)
        cy.get('td').contains(buName)
        cy.get('td').contains(strategyName)
        cy.get('td').contains(year)
        cy.get('td').contains(size)
      })
    });

    //TC 32 dismiss adding fund to investor profile
    it('it should verify dismiss adding fund to investor profile',() => { 
      investor1 =  addInvestorInFavorites();  
      
      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click(); 
      cy.get('[data-cy="investorprofile-name"]').contains(investor1);   
      cy.wait(1000); 
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
        cy.contains('li','Add Fund').click()
      })
      cy.get('[data-cy="investorprofile-fund-cancel"]').click();    
    });

    //TC 33 edit the fund in investor profile
    it('33: it should edit the fund in investor profile',() => { 

      //create investor
      investor1 = addInvestorInFavorites();

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 

      cy.get('[data-cy ="funds-component"]').click();

      var fundName = "Test"+Math.random().toString().slice(2,8);
      var sponsorName = "spon"+Math.random().toString().slice(2,8);
      var buName = "BU"+Math.random().toString().slice(2,8);
      var strategyName = "str"+Math.random().toString().slice(2,8);
      var year = '2018'
      var size = '65'
      cy.get('[data-cy="add-fund-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
      cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
      cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
      cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
      cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
      cy.get('[data-cy="fund-save"]').click();
      cy.go('back');
      cy.wait(1000)

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);

      cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verify fund added or not
      cy.contains('tr',fundName).eq(0).within(() => {

        cy.get('td').contains(sponsorName)
        cy.get('td').contains(buName)
        cy.get('td').contains(strategyName)
        cy.get('td').contains(year)
        cy.get('td').contains(size)
      });

      //edit the fund
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
          cy.contains('tr',fundName).as('fund');        
          })
      
      cy.get("@fund").within(() => {
      cy.get('[data-cy="investorprofile-fund-edit"]').click({force : true}).within(()=> {
        fundName = "Test"+Math.random().toString().slice(2,8);
        sponsorName = "spon"+Math.random().toString().slice(2,8);
        buName = "BU"+Math.random().toString().slice(2,8);
        strategyName = "str"+Math.random().toString().slice(2,8);
        year = '2019'
        size = '76'

        cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
        cy.get(':nth-child(4) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(4) > p-celleditor > .w-100').type(sponsorName);
        cy.get(':nth-child(5) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(5) > p-celleditor > .w-100').type(buName); 
        
        cy.get(':nth-child(6) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(6) > p-celleditor > .w-100').type(strategyName);
        cy.get(':nth-child(7) > p-celleditor > .w-100').clear();
        cy.get(':nth-child(7) > p-celleditor > .w-100').type(year);
        cy.get(':nth-child(8) > p-celleditor > .w-100').clear();  
        cy.get(':nth-child(8) > p-celleditor > .w-100').type(size);
        })
        })
        
        cy.get('[data-cy="investorprofile-fund-save"]').click();
        //verify fund added or not
        cy.contains('tr',fundName).eq(0).within(() => {

            cy.get('td').contains(sponsorName)
            cy.get('td').contains(buName)
            cy.get('td').contains(strategyName)
            cy.get('td').contains(year)
            cy.get('td').contains(size)
        });
    });

    //TC 34 dismiss edit the fund in investor profile
    it('34: it should dismiss edit the fund in investor profile',() => { 

      //create investor
      investor1 = addInvestorInFavorites();

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 

      cy.get('[data-cy ="funds-component"]').click();

      var fundName = "Test"+Math.random().toString().slice(2,8);
      var sponsorName = "spon"+Math.random().toString().slice(2,8);
      var buName = "BU"+Math.random().toString().slice(2,8);
      var strategyName = "str"+Math.random().toString().slice(2,8);
      var year = '2019'
      var size = '87'
      cy.get('[data-cy="add-fund-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
      cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
      cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
      cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
      cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
      cy.get('[data-cy="fund-save"]').click();
      cy.go('back');
      cy.wait(1000)

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);

      cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verify fund added or not
      cy.contains('tr',fundName).eq(0).within(() => {

        cy.get('td').contains(sponsorName)
        cy.get('td').contains(buName)
        cy.get('td').contains(strategyName)
        cy.get('td').contains(year)
        cy.get('td').contains(size)
      });

      //delete the fund
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
          cy.contains('tr',fundName).as('fund');        
          })
      
      cy.get("@fund").within(() => {
      cy.get('[data-cy="investorprofile-fund-edit"]').click()
      });
      cy.get('[data-cy="investorprofile-fund-cancel"]').click()
    });

    //TC 35 delete the fund in investor profile
    it('35: it should delete the fund in investor profile',() => { 

      //create investor
      investor1 = addInvestorInFavorites();

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 

      cy.get('[data-cy ="funds-component"]').click();

      var fundName = "Test"+Math.random().toString().slice(2,8);
      var sponsorName = "spon"+Math.random().toString().slice(2,8);
      var buName = "BU"+Math.random().toString().slice(2,8);
      var strategyName = "str"+Math.random().toString().slice(2,8);
      var year = '2018'
      var size = '65'
      cy.get('[data-cy="add-fund-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
      cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
      cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
      cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
      cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
      cy.get('[data-cy="fund-save"]').click();
      cy.go('back');
      cy.wait(1000)

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);

      cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verify fund added or not
      cy.contains('tr',fundName).eq(0).within(() => {

        cy.get('td').contains(sponsorName)
        cy.get('td').contains(buName)
        cy.get('td').contains(strategyName)
        cy.get('td').contains(year)
        cy.get('td').contains(size)
      });

      //delete the fund
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
          cy.contains('tr',fundName).as('fund');        
          })
      
      cy.get("@fund").within(() => {
      cy.get('[data-cy="investorprofile-fund-delete"]').click()
      });
      cy.get('[data-cy="delete-ok"]').click()
    });

    

    //TC 36 dismiss delete the fund in investor profile
    it('36: it should dismiss delete the fund in investor profile',() => { 

      //create investor
      investor1 = addInvestorInFavorites();

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 

      cy.get('[data-cy ="funds-component"]').click();

      var fundName = "Test"+Math.random().toString().slice(2,8);
      var sponsorName = "spon"+Math.random().toString().slice(2,8);
      var buName = "BU"+Math.random().toString().slice(2,8);
      var strategyName = "str"+Math.random().toString().slice(2,8);
      var year = '2019'
      var size = '87'
      cy.get('[data-cy="add-fund-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
      cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
      cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
      cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
      cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
      cy.get('[data-cy="fund-save"]').click();
      cy.go('back');
      cy.wait(1000)

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);

      cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verify fund added or not
      cy.contains('tr',fundName).eq(0).within(() => {

        cy.get('td').contains(sponsorName)
        cy.get('td').contains(buName)
        cy.get('td').contains(strategyName)
        cy.get('td').contains(year)
        cy.get('td').contains(size)
      });

      //delete the fund
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
          cy.contains('tr',fundName).as('fund');        
          })
      
      cy.get("@fund").within(() => {
      cy.get('[data-cy="investorprofile-fund-edit"]').click()
      });
      cy.get('[data-cy="investorprofile-fund-cancel"]').click()
    });

     //TC 36 dismiss edit the fund in investor profile
     it('36: it should dismiss edit the fund in investor profile',() => { 

      //create investor
      investor1 = addInvestorInFavorites();

      cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
      cy.wait(1000)
      cy.get('[data-cy="investorprofile-name"]').contains(investor1); 

      cy.get('[data-cy ="funds-component"]').click();

      var fundName = "Test"+Math.random().toString().slice(2,8);
      var sponsorName = "spon"+Math.random().toString().slice(2,8);
      var buName = "BU"+Math.random().toString().slice(2,8);
      var strategyName = "str"+Math.random().toString().slice(2,8);
      var year = '2019'
      var size = '87'
      cy.get('[data-cy="add-fund-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
      cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
      cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
      cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
      cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
      cy.get('[data-cy="fund-save"]').click();
      cy.go('back');
      cy.wait(1000)

      //enter fund details
      cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
      })
      cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);

      cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
      })
      
      cy.get('[data-cy="investorprofile-fund-save"]').click();

      //verify fund added or not
      cy.contains('tr',fundName).eq(0).within(() => {

        cy.get('td').contains(sponsorName)
        cy.get('td').contains(buName)
        cy.get('td').contains(strategyName)
        cy.get('td').contains(year)
        cy.get('td').contains(size)
      });

      //delete the fund
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').within(() => {
          cy.contains('tr',fundName).as('fund');        
          })
      
      cy.get("@fund").within(() => {
      cy.get('[data-cy="investorprofile-fund-delete"]').click()
      });
      cy.get('[data-cy="delete-cancel"]').click()
  });


});
