/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/


--:r .\SeedData\SeedData_Fund.sql
--:r .\SeedData\SeedData_Investor.sql


if NOT EXISTS(SELECT 1 FROM SearchSettings)
BEGIN
	INSERT SearchSettings(Algorithm1Weight,Algorithm2Weight,Algorithm3Weight,Algorithm1Threshold,Algorithm2Threshold,Algorithm3Threshold,WeightedThreshold,InheritThreshold,MslGroupingThreshold) VALUES(.2,.3,.5,.9,.7,.5,.4,.5,.5)
END
