export function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function addFund() {
    
    var fundName = "Test"+Math.random().toString().slice(2,8);
    var sponsorName = "spon"+Math.random().toString().slice(2,8);
    var buName = "BU"+Math.random().toString().slice(2,8);
    var strategyName = "str"+Math.random().toString().slice(2,8);

    var year = getRandomArbitrary(2016,2020);

    var size = getRandomArbitrary(12,120);

    cy.get('[data-cy="add-fund-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type(fundName);
    cy.get(':nth-child(3) > p-celleditor > .w-100').type(sponsorName);
    cy.get(':nth-child(4) > p-celleditor > .w-100').type(buName);    
    cy.get(':nth-child(5) > p-celleditor > .w-100').type(year);
    cy.get(':nth-child(6) > p-celleditor > .w-100').type(size);
    cy.get(':nth-child(7) > p-celleditor > .w-100').type(strategyName);
    cy.get('[data-cy="fund-save"]').click();
    cy.wait(2000);
    //verify fund added in favorites grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
        cy.contains('tr',fundName).within(function(){
          cy.get('[data-cy="fund-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
        });      
      });     
  
      //verify fund added in favorites grid or not
      cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
        cy.contains('tr',fundName).within(function(){
          cy.get('[data-cy="fund-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
        });      
      }); 

    return fundName;
}

export function fundDeleteAPI()
{
  cy.request('GET','https://localhost:44344')
  cy.request('GET','https://localhost:44344//api/fund').then(
    response => {        
        var myObjStr = JSON.stringify(response.body);
        var jsonObj = JSON.parse(myObjStr);
        if(jsonObj.length>0)
        {
          for(var i=0 ;i<jsonObj.length;i++)
          {
            cy.request('DELETE','https://localhost:44344//api/fund/'+jsonObj[i].id)
          }
        }          
    })
}

export function addFundProfileInvestor()
{
    //create fund
    var fundName = addFund();
    //open fund
    cy.get('[data-cy="favorite-funds-grid"]')
    .find('tbody>tr').contains(fundName).click();  
    cy.get('[data-cy="fundprofile-name"]').contains(fundName);   
    //click on add investor
    var invName = addInvestor();
    cy.go('back');
    cy.wait(2000);

    //enter investor details
    cy.get('[data-cy="fundprofile-menubar"]').within(() => {
      cy.contains('li','Add Investor').click()
    })
    cy.get('.ui-autocomplete .ui-autocomplete-input').type(invName);
    cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', invName).click()
    })

    //save investor
    cy.get('[data-cy="fundprofile-investor-save"]').click();
    cy.wait(2000)

    return [fundName,invName];
}

export function addInvestorInFavorites()
{
    var investor1 = "Inv"+Math.random().toString().slice(2,8);
    var type =  "type"+Math.random().toString().slice(2,8);

    cy.get('[data-cy="add-investor-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
    cy.get(':nth-child(3) > p-celleditor > .w-100').type(type);
    cy.get('[data-cy="investor-save"]').click();
    cy.wait(2000);

    
    //verify fund added in favorites grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(0).within(() => {
      cy.contains('tr',investor1).within(function(){
        cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });      
    });     

    //verify fund added in recent  grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(1).within(() => {
      cy.contains('tr',investor1).within(function(){
        cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });      
    });

    return investor1;
}

export function addInvestorInRecent()
{
    var investor1 = "Inv"+Math.random().toString().slice(2,8);
    var type =  "type"+Math.random().toString().slice(2,8);

    cy.get('[data-cy="add-investor-button"]').last().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
    cy.get(':nth-child(3) > p-celleditor > .w-100').type(type);
    cy.get('[data-cy="investor-save"]').click();
    cy.wait(2000);   

    //verify fund not added in favorites grid or not    
    cy.get('[data-cy="all-favorites-grid"]').should('not.contain',investor1);
    //verify fund added in recent  grid or not
    cy.get('[data-cy="all-investors-grid"]').within(() => {
      cy.contains('tr',investor1).within(function(){
        cy.get('[data-cy="investor-favorite-icon"]').should('have.attr', 'title', 'Favorite')
      });      
    });

    return investor1;
}


export function investorDeleteAPI()
{
  cy.request('GET','https://localhost:44344')
  cy.request('GET','https://localhost:44344//api/investor').then(
    response => {        
        var myObjStr = JSON.stringify(response.body);
        var jsonObj = JSON.parse(myObjStr);
        if(jsonObj.length>0)
        {
          for(var i=0 ;i<jsonObj.length;i++)
          {
            cy.request('DELETE','https://localhost:44344//api/investor/'+jsonObj[i].id)
          }
        }          
    })
}

export function addInvestorProfileFund(investoName)
{
    //create investor
    var investor1 = addInvestorInFavorites();
    //open fund
    cy.get('[data-cy="favorite-investors-grid"]').find('tbody>tr').contains(investor1).click();  
    cy.get('[data-cy="investorprofile-name"]').contains(investor1);   
    //click on add fund
    var fundName = addFund();
    cy.go('back');
    cy.wait(1000);

    //enter fund details
    cy.get('[data-cy="investorprofile-menubar"]').within(() => {
      cy.contains('li','Add Fund').click()
    })
    cy.get('.ui-autocomplete .ui-autocomplete-input').type(fundName);
    cy.get('.ui-autocomplete-panel .ui-autocomplete-items').within(()=> {
      cy.contains('li', fundName).click()
    })

    //save investor
    cy.get('[data-cy="investorprofile-fund-save"]').click();
    cy.wait(2000)

    return [invName,fundName];
}


//
export function homeaddInvestorInFavorites()
{
    var investor1 = "Inv"+Math.random().toString().slice(2,8);
    var type =  "type"+Math.random().toString().slice(2,8);

    cy.get('[data-cy="add-investor-button"]').first().click();
    cy.get(':nth-child(2) > p-celleditor > .w-100').type(investor1);
    cy.get(':nth-child(3) > p-celleditor > .w-100').type(type);
    cy.get('[data-cy="investor-save"]').click();
    cy.wait(2000);

    
    //verify fund added in favorites grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(2).within(() => {
      cy.contains('tr',investor1).within(function(){
        cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });      
    });     

    //verify fund added in recent  grid or not
    cy.get('.ui-table-scrollable-body-table > .ui-table-tbody').eq(3).within(() => {
      cy.contains('tr',investor1).within(function(){
        cy.get('[data-cy="investor-unfavorite-icon"]').should('have.attr', 'title', 'Unfavorite')
      });      
    });

    return investor1;
}
