import { addInvestorInFavorites,investorDeleteAPI} from '../support/util';
import { addInvestorInRecent} from '../support/util';
let investor1,fund2,fund3;

describe('Investors List Page', () => {
    beforeEach(function () {    
        cy.ntlm('https://localhost:44344','Manikanta.More','Chinnu@sirisep19','CORP');
        cy.visit('#/investors');
        cy.contains("All Investors");
        investorDeleteAPI();
    })

    //TC1 verify favorite investors grid columns
    it('1: it should verify funds favorite grid columns',() => {

        cy.get('[data-cy="investor-grid-headers"]').first().contains('Name');
        cy.get('[data-cy="investor-grid-headers"]').first().contains('Type');
        cy.get('[data-cy="investor-grid-headers"]').first().contains('Viewed');
    });

    //TC2 add investor in favorite investors grid

    it('2: it should add investor from favorites grid',() => {  
      //part 1 adding with full details
      investor1 = addInvestorInFavorites();

      //adding with only name

      investor1 = "Invest"+Math.random().toString().slice(2,6);

      cy.get('[data-cy="add-investor-button"]').first().click();
      cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
      cy.get('[data-cy="investor-save"]').click();
      cy.wait(2000);

      //verify fund added in favorites grid or not
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
          cy.contains('tr',investor1).within(function(){
            cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          });      
      });    
    
      //verify fund added in favorites grid or not
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.contains('tr',investor1).within(function(){
          cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          });      
      });

      
      //adding with only type
      var investortype = "type"+Math.random().toString().slice(2,6);

      cy.get('[data-cy="add-investor-button"]').first().click();
      cy.get(':nth-child(3) > p-celleditor > .w-100').type(investortype);
      cy.get('[data-cy="investor-save"]').click();
      cy.wait(2000);

      //verify fund added in favorites grid or not
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
          cy.contains('tr',investortype).within(function(){
              cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          });      
      });     
    
        //verify fund added in favorites grid or not
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
          cy.contains('tr',investortype).within(function(){
            cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          });      
        });

      //adding investor with empty name anf type
      cy.get('[data-cy="add-investor-button"]').first().click();
      cy.get('[data-cy="investor-save"]').click();
      cy.wait(2000);
      //verify fund added in favorites grid or not
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
          cy.contains('tr',investortype).within(function(){
          cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          });      
      });     

      //verify fund added in favorites grid or not
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
          cy.contains('tr',investortype).within(function(){
          cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
          });      
      });   
    });

    //TC3  edit investor in favorite investors grid
    it('3: it should edit investor from favorites grid',() => { 

        investor1 = addInvestorInFavorites();   
    
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
        cy.contains('tr',investor1).as('row');        
        })
        cy.get('@row').within(() => {
            cy.get('[data-cy="investor-edit"]').click()
            cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
            cy.get(':nth-child(2) > p-celleditor > .w-100').type('changed')
            cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
            cy.get(':nth-child(3) > p-celleditor > .w-100').type('type')
        });      

        cy.get('[data-cy="investor-save"]').click();
        cy.wait(1000);

        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
            cy.contains('tr','changed').as('row');
        })
        cy.get('@row').within(() => {
            cy.contains('td','type')
          });

        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
            cy.contains('tr','changed').as('row');
        })
        cy.get('@row').within(() => {
            cy.contains('td','type')
          });
    })

    //TC4 delete investor in favorite investors grid
    it('4: it should verify delete investor from favorites grid',() => {
        //add investor
        investor1 = addInvestorInFavorites();    

        //select row from all investors grid and click delete
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {      
        cy.contains('tr',investor1).as('row');
        });
        cy.get('@row').within(() => {
        cy.get('[data-cy="investor-delete"]').click();
        });

        //confirm delete the investor
        cy.get('[data-cy="delete-ok"]').click(); 

        //verify fund removed from favorites investors grid      
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).should('not.contain',investor1);

        //verify fund removed from all funds grid        
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).should('not.contain',investor1);
    });

    //TC5 dismiss add investor in favorite investors grid
    it('5: it should dismiss add investor from favorites grid',() => {
        //add investor
        investor1 = "Inv"+Math.random().toString().slice(2,8);
        var type =  "type"+Math.random().toString().slice(2,8);
    
        cy.get('[data-cy="add-investor-button"]').first().click();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
        cy.get(':nth-child(3) > p-celleditor > .w-100').type(type);
        cy.get('[data-cy="investor-cancel"]').click();
        cy.wait(2000);

        //verify fund removed from favorites investors grid      
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).should('not.contain',investor1);

        //verify fund removed from all funds grid        
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).should('not.contain',investor1);
    });

    //TC6 dismiss delete investor in favorite investors grid
    it('6: it should verify dismiss delete investor from favorites grid',() => {
        //add investor
        investor1 = addInvestorInFavorites();    

        //select row from all investors grid and click delete
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {      
        cy.contains('tr',investor1).as('row');
        });
        cy.get('@row').within(() => {
        cy.get('[data-cy="investor-delete"]').click();
        });

        //confirm delete the investor
        cy.get('[data-cy="delete-cancel"]').click();
        cy.wait(2000) 

        //verify fund removed from favorites investors grid      
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).should('contain',investor1);

        //verify fund removed from all funds grid        
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).should('contain',investor1);
    });

    //TC7  dismiss edit investor in favorite investors grid
    it('7: it should verify dismiss edit investor from favorites grid',() => { 

        investor1 = addInvestorInFavorites();   

        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
        cy.contains('tr',investor1).as('row');        
        })
        cy.get('@row').within(() => {
            cy.get('[data-cy="investor-edit"]').click()
        });       
        cy.wait(1000);       
        cy.get('[data-cy="investor-cancel"]').click();
    })

    //TC8 unfavorite investor in favorite investors grid

    it('8: it should verify unfavorite fund from favorite investors grid',() => { 
        investor1 = addInvestorInFavorites();
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
          cy.contains('tr',investor1).within(function(){
            cy.get('[data-cy="investor-unfavorite-icon"]').click();
          });
        });      
        cy.wait(1000);  
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).should('not.contain',investor1);   
        //verify fund as unfavorite in recent  investors  grid
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
          cy.contains('tr',investor1).within(function(){
            cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
          });       
        });    
      });

    //TC9  route to investor from favorite investors grid
    it('9: it should verify route to investor from favorites investors grid ',() => { 
        investor1 =  addInvestorInFavorites(); 
        cy.get('[data-cy="favorite-investors-grid"]')
        .find('tbody>tr').contains(investor1).click();  
        cy.get('[data-cy="investorprofile-name"]').contains(investor1);
        cy.go('back');

        cy.get('[data-cy="all-investors-grid"]')
        .find('tbody>tr').contains(investor1).click();  
        cy.get('[data-cy="investorprofile-name"]').contains(investor1);
        cy.go('back');
    });

     
    //TC10 verify viewed column updated or not in  favorite investors grid
    it('10: it should verify viewed column updated or not in favorites investors grid ',() => { 
        investor1 =  addInvestorInFavorites(); 
        const todaysDate = Cypress.moment().format('M/DD/YY');
        cy.get('[data-cy="favorite-investors-grid"]').contains('tr',investor1).within(() => {
            cy.get('[data-cy="investor-lastviewed"]').should('be.empty')
            });
        
        //data-cy="investor-lastviewed"
        cy.get('[data-cy="favorite-investors-grid"]')
        .find('tbody>tr').contains(investor1).click();  
        cy.get('[data-cy="investorprofile-name"]').contains(investor1);
        cy.go('back');
        cy.wait(2000)
        cy.get('[data-cy="favorite-investors-grid"]').contains('tr',investor1).within(() => {
            cy.get('[data-cy="investor-lastviewed"]').should('contain',todaysDate)     
            });

        if(cy.get('[data-cy="all-investors-grid"]').contains('tr',investor1))
        {
            cy.get('[data-cy="all-investors-grid"]').contains('tr',investor1).within(() => {
            cy.get('[data-cy="investor-lastviewed"]').should('contain',todaysDate)     
            });
        }        
    });

    //TC11 verify all investors gird columns
    it('11: it should verify verify all investors gird columns',() => {
        cy.get('[data-cy="investor-grid-headers"]').last().contains('Name');
        cy.get('[data-cy="investor-grid-headers"]').last().contains('Type');
        cy.get('[data-cy="investor-grid-headers"]').last().contains('Viewed');
    });

    //TC12 add investor in all investors gird
    it('12: it should add investor in all investors gird',() => {    
   
        //part 1 adding with full details
        investor1 = addInvestorInRecent();
    
        //adding with only name
    
        investor1 = "Invest"+Math.random().toString().slice(2,6);
    
        cy.get('[data-cy="add-investor-button"]').last().click();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
        cy.get('[data-cy="investor-save"]').click();
        cy.wait(2000);      
      
        //verify fund added in favorites grid or not
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
        cy.contains('tr',investor1).within(function(){
            cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
            });      
         });    
        
        //adding with only type
        var investortype = "type"+Math.random().toString().slice(2,6);
    
        cy.get('[data-cy="add-investor-button"]').last().click();
        cy.get(':nth-child(3) > p-celleditor > .w-100').type(investortype);
        cy.get('[data-cy="investor-save"]').click();
        cy.wait(2000);   
      
        //verify fund added in favorites grid or not
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
        cy.contains('tr',investortype).within(function(){
            cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
        });      
        });
    
        //adding investor with empty name anf type
        cy.get('[data-cy="add-investor-button"]').last().click();
        cy.get('[data-cy="investor-save"]').click();
        cy.wait(2000);     
    
         //verify fund added in favorites grid or not
         cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
            cy.contains('tr',investortype).within(function(){
            cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
            });      
         });   
    });
    
    //TC13 edit investor in all investors 
    it('13: it should edit investor in all investors gird',() => { 

        investor1 = addInvestorInRecent();   
    
        cy.get('[data-cy="all-investors-grid"]').within(() => {
        cy.contains('tr',investor1).as('row');        
        });
        cy.get('@row').within(() => {
            cy.get('[data-cy="investor-edit"]').click()
            cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
            cy.get(':nth-child(2) > p-celleditor > .w-100').type('changed')
            cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
            cy.get(':nth-child(3) > p-celleditor > .w-100').type('type')
        });      

        cy.get('[data-cy="investor-save"]').click();
        cy.wait(1000);

        cy.get('[data-cy="all-investors-grid"]').within(() => {
            cy.contains('tr','changed').as('row');
        })
        cy.get('@row').within(() => {
            cy.contains('td','type')
        });
    });

    //TC14 delete investor in all investors gird

    it('14: it should verify delete investor in all investors gird',() => {
        //add investor
        investor1 = addInvestorInRecent();   

        //select row from all investors grid and click delete
        cy.get('[data-cy="all-investors-grid"]').within(() => {      
        cy.contains('tr',investor1).as('row');
        });
        cy.get('@row').within(() => {
        cy.get('[data-cy="investor-delete"]').click();
        });

        //confirm delete the investor
        cy.get('[data-cy="delete-ok"]').click();

        //verify fund removed from all funds grid        
        cy.get('[data-cy="all-investors-grid"]').should('not.contain',investor1);
    });

    //TC15 dismiss adding investor in all investors grid
    it('15: it should dismiss adding investor in all investors grid',() => {
        //add investor
        investor1 = "Inv"+Math.random().toString().slice(2,8);
        var type =  "type"+Math.random().toString().slice(2,8);
    
        cy.get('[data-cy="add-investor-button"]').last().click();
        cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
        cy.get(':nth-child(3) > p-celleditor > .w-100').type(type);
        cy.get('[data-cy="investor-cancel"]').click();
        cy.wait(2000);

        //verify fund removed from favorites investors grid      
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).should('not.contain',investor1);

        //verify fund removed from all funds grid        
        cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).should('not.contain',investor1);
    });

     //TC16 dismiss delete investor in all investors gird

    it('16: it should verify delete investor in all investors gird',() => {
        //add investor
        investor1 = addInvestorInRecent();   

        //select row from all investors grid and click delete
        cy.get('[data-cy="all-investors-grid"]').within(() => {      
        cy.contains('tr',investor1).as('row');
        });
        cy.get('@row').within(() => {
        cy.get('[data-cy="investor-delete"]').click();
        });

        //confirm delete the investor
        cy.get('[data-cy="delete-cancel"]').click();

        //verify fund removed from all funds grid        
        cy.get('[data-cy="all-investors-grid"]').contains('tr',investor1);
    });

    //TC17  dismiss edit investor in all investors 
    it('17: it should dismiss edit investor in all investors gird',() => { 

          investor1 = addInvestorInRecent();   
      
          cy.get('[data-cy="all-investors-grid"]').within(() => {
          cy.contains('tr',investor1).as('row');        
          });
          cy.get('@row').within(() => {
              cy.get('[data-cy="investor-edit"]').click()
              cy.get(':nth-child(2) > p-celleditor > .w-100').clear();
              cy.get(':nth-child(2) > p-celleditor > .w-100').type('changed')
              cy.get(':nth-child(3) > p-celleditor > .w-100').clear();
              cy.get(':nth-child(3) > p-celleditor > .w-100').type('type')
          });      

          cy.get('[data-cy="investor-cancel"]').click();
          cy.wait(1000);

          cy.get('[data-cy="all-investors-grid"]').within(() => {
              cy.contains('tr',investor1).as('row');
          })
      });

    //TC18 unfavorite investor in all investors grid
    it('18: it should verify unfavorite fund from all investors grid',() => { 
          investor1 = addInvestorInFavorites();
          cy.get('[data-cy="all-investors-grid"]').within(() => {
            cy.contains('tr',investor1).within(function(){
              cy.get('[data-cy="investor-unfavorite-icon"]').click();
            });
          });      
          cy.wait(1000);           
          cy.get('[data-cy="all-favorites-grid"]').should('not.contain',investor1);  
          //verify fund as unfavorite in recent  investors  grid
          cy.get('[data-cy="all-investors-grid"]').within(() => {
            cy.contains('tr',investor1).within(function(){
              cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
            });       
          });             
      });
      
    //TC19 route to investor from all investors gird
    it('19:: it should verify route to investor from favorites investors grid ',() => { 
          investor1 =  addInvestorInRecent(); 
          cy.get('[data-cy="all-investors-grid"]')
          .find('tbody>tr').contains(investor1).click();  
          cy.get('[data-cy="investorprofile-name"]').contains(investor1);
          cy.go('back');
      });

      //TC20 verify viewed column updated or not in  all investors grid
      it('20: it should verify viewed column updated or not in all investors grid ',() => { 
          investor1 =  addInvestorInRecent(); 
          const todaysDate = Cypress.moment().format('M/DD/YY');
          cy.get('[data-cy="all-investors-grid"]').contains('tr',investor1).within(() => {
              cy.get('[data-cy="investor-lastviewed"]').should('be.empty')
              });

          cy.get('[data-cy="all-investors-grid"]')
          .find('tbody>tr').contains(investor1).click();  
          cy.get('[data-cy="investorprofile-name"]').contains(investor1);
          cy.go('back');
          cy.wait(2000)
          cy.get('[data-cy="all-investors-grid"]').contains('tr',investor1).within(() => {
              cy.get('[data-cy="investor-lastviewed"]').should('contain',todaysDate)     
            });

      });


    




});