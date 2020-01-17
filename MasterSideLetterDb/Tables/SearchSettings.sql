CREATE TABLE [dbo].[SearchSettings]
(
	Algorithm1Weight FLOAT NOT NULL CONSTRAINT DF_SearchSettings_Algorithm1Weight DEFAULT 0.2,
	Algorithm2Weight FLOAT NOT NULL CONSTRAINT DF_SearchSettings_Algorithm2Weight DEFAULT 0.3,
	Algorithm3Weight FLOAT NOT NULL CONSTRAINT DF_SearchSettings_Algorithm3Weight DEFAULT 0.5,
	Algorithm1Threshold FLOAT NOT NULL CONSTRAINT DF_SearchSettings_Algorithm1Threshold DEFAULT 0.9,
	Algorithm2Threshold FLOAT NOT NULL CONSTRAINT DF_SearchSettings_Algorithm2Threshold DEFAULT 0.7,
	Algorithm3Threshold FLOAT NOT NULL CONSTRAINT DF_SearchSettings_Algorithm3Threshold DEFAULT 0.5,
	WeightedThreshold FLOAT NOT NULL CONSTRAINT DF_SearchSettings_WeightedThreshold DEFAULT 0.4,
	InheritThreshold FLOAT NOT NULL CONSTRAINT DF_SearchSettings_InheritThreshold DEFAULT 0.5,
	MslGroupingThreshold FLOAT NOT NULL CONSTRAINT DF_SearchSettings_MslGroupingThreshold DEFAULT 0.5,

)
