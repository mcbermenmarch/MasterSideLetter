using System;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Collections.Generic;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.Text.RegularExpressions;
using BermenMarch.MasterSideLetter.Common.Model;
using BermenMarch.MasterSideLetter.Common.DiffMatchPatch;
using BermenMarch.MasterSideLetter.Common.IFilter;
using BermenMarch.MasterSideLetter.Common.Properties;


namespace BermenMarch.MasterSideLetter.Common.Helpers
{
    public static class DocumentHelper
    {
        private static readonly CustomDiffMatchPatch Dmp = new CustomDiffMatchPatch();

        public static List<string> ExtractDocxParagraphs(Stream readStream)
        {
            var results = new List<string>();
            var wordPackage = Package.Open(readStream, FileMode.Open, FileAccess.Read);

            using (var wordDocument = WordprocessingDocument.Open(wordPackage))
            {
                results.AddRange(
                    from paragraph
                        in wordDocument.MainDocumentPart.Document.Body.OfType<Paragraph>()
                    where !string.IsNullOrWhiteSpace(paragraph.InnerText)
                    select FormatParagraphText(paragraph.InnerText)
                );
                return results;
            }
        }

        public static List<string> ExtractDocParagraphs(Stream readStream)
        {
            //write the stream to a temp file
            var tmp = Path.GetTempFileName();
            var fileName = tmp + ".doc";
            File.Move(tmp, fileName);
            using (var fileStream = File.Create(fileName))
            {
                readStream.Seek(0, SeekOrigin.Begin);
                readStream.CopyTo(fileStream);
                fileStream.Close();
            }

            var results = new List<string>();
            using (var reader = new FilterReader(fileName))
            {
                using (var stringReader = new StringReader(reader.ReadToEnd()))
                {
                    var nextLine = stringReader.ReadLine();
                    while (nextLine != null)
                    {
                        if (!string.IsNullOrWhiteSpace(nextLine))
                        {
                            results.Add(FormatParagraphText(nextLine));
                        }

                        nextLine = stringReader.ReadLine();
                    }
                }
            }
            File.Delete(fileName);
            return results;
        }

        private static string FormatParagraphText(string paragraphText)
        {
            if(paragraphText == null)
            {
                return null;
            }
            var text = paragraphText.Trim();
            if (text.StartsWith("("))
            {
                //find the end parenthesis
                var endIndex = text.IndexOf(")", StringComparison.Ordinal);
                if (endIndex > 0)
                {
                    var heading = text.Substring(1, endIndex-1).Trim();
                    if (heading.Length == 1 || int.TryParse(heading, out _) || heading.IsRomanNumeral())
                    {
                        text = text.Substring(endIndex + 1);
                    }
                }
            }
            else if (Regex.IsMatch(text, @"^\d+\.") || Regex.IsMatch(text, @"^[a-zA-Z]+\."))
            {
                var heading = text.Substring(0, text.IndexOf('.')).Trim();
                if (heading.Length == 1 || int.TryParse(heading, out _) || heading.IsRomanNumeral())
                {
                    text = text.Substring(text.IndexOf('.') + 1);
                }
            }
            return text.Trim();
        }

        public static MemoryStream GenerateMasterSideLetterDocument(SearchSettings searchSettings,MasterSideLetterContent masterSideLetter)
        {
            //grab the template from assembly resources
            var template = Resources.template;
            //copy the template to a new stream
            var stream = new MemoryStream();
            stream.Write(template, 0, template.Length);
            using (var doc = WordprocessingDocument.Open(stream, true))
            {
                //add numbering definition
                var numberingPart = doc.MainDocumentPart.AddNewPart<NumberingDefinitionsPart>("numberingDefinitionId");
                numberingPart.Numbering =
                    new Numbering(
                        new AbstractNum(
                            new Level(
                                new StartNumberingValue {Val = 1},
                                new NumberingFormat {Val = NumberFormatValues.Decimal},
                                new LevelText {Val = "%1."},
                                new ParagraphProperties { Indentation = new Indentation { Hanging = "720",Left = "720"} }
                            )
                        ) {AbstractNumberId = 1},
                        new NumberingInstance(
                            new AbstractNumId {Val = 1}
                        ) {NumberID = 1}
                    );

                var body = doc.MainDocumentPart.Document.Body;
                //find the title and subtitle
                var paragraphs = body.Elements<Paragraph>().Take(2).ToList();
                paragraphs[0].GetFirstChild<Run>().GetFirstChild<Text>().Text = masterSideLetter.Fund.Name;
                paragraphs[1].GetFirstChild<Run>().GetFirstChild<Text>().Text = masterSideLetter.Fund.SponsorName;


                body.AppendChild(new Paragraph(
                    new ParagraphProperties {ParagraphStyleId = new ParagraphStyleId {Val = "Heading1"}},
                    new Run(new Text("Investor List"))
                ));

                //insert the investors table
                var table = body.AppendChild(
                    new Table(
                        new TableProperties(
                            new TableStyle { Val = "TableGrid" },
                            new TableWidth { Type = TableWidthUnitValues.Auto, Width = "0" },
                            new TableLook
                            {
                                Val = "04A0",
                                FirstRow = OnOffValue.FromBoolean(true),
                                LastRow = OnOffValue.FromBoolean(false),
                                FirstColumn = OnOffValue.FromBoolean(true),
                                LastColumn = OnOffValue.FromBoolean(false),
                                NoHorizontalBand = OnOffValue.FromBoolean(false),
                                NoVerticalBand = OnOffValue.FromBoolean(true)
                            }
                        ),
                        new TableGrid(
                            new GridColumn { Width = "4045" },
                            new GridColumn { Width = "3330" },
                            new GridColumn { Width = "1975" }
                        )
                    )
                );
                //table header row
                table.AppendChild(
                    new TableRow(
                        new TableRowProperties(new TableRowHeight { Val = 288 }),
                        CreateCell("Investor Name", "4045", "E7E6E6", "Strong"),
                        CreateCell("Entity", "3330", "E7E6E6", "Strong"),
                        CreateCell("Commitment", "1975", "E7E6E6", "Strong", JustificationValues.Right)
                    )
                );

                //table rows
                foreach (var fundInvestor in masterSideLetter.FundInvestors)
                {
                    table.AppendChild(
                        new TableRow(new TableRowProperties(new TableRowHeight { Val = 288 }),
                            CreateCell(fundInvestor.InvestorName, "4045"),
                            CreateCell(fundInvestor.Entity, "3330"),
                            CreateCell($"{fundInvestor.Commitment:c0}", "1975", null, null, JustificationValues.Right)
                        )
                    );
                }
                body.AppendChild(CreatePageBreak());

                //insert the Provision Type Sections
                var footnoteId = 1;

                var provisionTypeSectionNumber = 0;
                foreach (var provisionTypeSection in masterSideLetter.ProvisionTypeSections)
                {
                    provisionTypeSectionNumber++;
                    if (provisionTypeSection != masterSideLetter.ProvisionTypeSections[0])
                    {
                        body.AppendChild(CreatePageBreak());
                    }

                    body.AppendChild(new Paragraph(
                        new ParagraphProperties { ParagraphStyleId = new ParagraphStyleId { Val = "Heading1" } },
                        new Run(
                            new Text($"{provisionTypeSection.ProvisionType}")
                        )
                    ));

                    //create a score matrix
                    var scores = new Dictionary<MasterSideLetterContent.ProvisionSection, Dictionary<MasterSideLetterContent.ProvisionSection, double>>();
                    foreach (var provisionSectionA in provisionTypeSection.ProvisionSections)
                    {
                        scores.Add(provisionSectionA, new Dictionary<MasterSideLetterContent.ProvisionSection, double>());
                        foreach (var provisionSectionB in provisionTypeSection.ProvisionSections)
                        {
                            if (provisionSectionA == provisionSectionB) continue;
                            var score = ProvisionComparison.GetProvisionScore(searchSettings, provisionSectionA.Content, provisionSectionB.Content);
                            if (score >= searchSettings.MslGroupingThreshold)
                            {
                                scores[provisionSectionA].Add(provisionSectionB, score);
                            }
                        }
                    }

                    var used = new List<MasterSideLetterContent.ProvisionSection>();
                    foreach (var pair in scores.OrderByDescending(p=>p.Key.FundInvestors.Count).ThenByDescending(p => p.Value.Count).ThenByDescending(p => p.Value.Sum(s => s.Value)))
                    {
                        if (!used.Contains(pair.Key))
                        {
                            used.Add(pair.Key);
                            var contentParagraph = body.AppendChild(new Paragraph(
                                new ParagraphProperties(new NumberingProperties(new NumberingLevelReference { Val = 0 }, new NumberingId { Val = provisionTypeSectionNumber }))));
                            contentParagraph.AppendChild(new Run(new Text($"{pair.Key.Content}")));

                            var footnoteReference = new FootnoteReference { Id = footnoteId };
                            var footnoteReferenceRun = new Run(new RunProperties(new VerticalTextAlignment { Val = VerticalPositionValues.Superscript }));
                            footnoteReferenceRun.AppendChild(footnoteReference);
                            contentParagraph.AppendChild(footnoteReferenceRun);

                            var fundInvestorNames = string.Join("; ", pair.Key.FundInvestors.Select(fi => fi.InvestorName).Distinct().OrderBy(n => n));
                            doc.MainDocumentPart.FootnotesPart.Footnotes.AppendChild(
                                new Footnote(
                                        new Paragraph(
                                            new Run(
                                                new RunProperties(
                                                    new VerticalTextAlignment { Val = VerticalPositionValues.Superscript }
                                                ),
                                                new FootnoteReferenceMark()
                                            ),
                                            new Run(new Text(" " + fundInvestorNames) { Space = SpaceProcessingModeValues.Preserve })
                                        )
                                    )
                                    { Id = footnoteId }
                            );
                            footnoteId++;
                        }

                        foreach (var scoredPair in pair.Value.OrderByDescending(p=>p.Value))
                        {
                            if (!used.Contains(scoredPair.Key))
                            {
                                used.Add(scoredPair.Key);
                                var contentParagraph = body.AppendChild(new Paragraph(
                                    new ParagraphProperties(new NumberingProperties(new NumberingLevelReference { Val = 0 }, new NumberingId { Val = provisionTypeSectionNumber }))));
                                var diffs = Dmp.diff_wordMode(pair.Key.Content, scoredPair.Key.Content);
                                Dmp.diff_cleanupSemantic(diffs);
                                foreach (var diff in diffs)
                                {
                                    if (diff.operation == Operation.EQUAL)
                                    {
                                        contentParagraph.AppendChild(new Run(new Text($"{diff.text}") {Space = SpaceProcessingModeValues.Preserve}));
                                    }
                                    else if (diff.operation == Operation.INSERT)
                                    {
                                        contentParagraph.AppendChild(new Run(new RunProperties(new Color {Val = "FF0000"}), new Text($"{diff.text}") {Space = SpaceProcessingModeValues.Preserve}));
                                    }
                                }

                                var footnoteReference = new FootnoteReference { Id = footnoteId };
                                var footnoteReferenceRun = new Run(new RunProperties(new VerticalTextAlignment { Val = VerticalPositionValues.Superscript }));
                                footnoteReferenceRun.AppendChild(footnoteReference);
                                contentParagraph.AppendChild(footnoteReferenceRun);

                                var fundInvestorNames = string.Join("; ", scoredPair.Key.FundInvestors.Select(fi => fi.InvestorName).Distinct().OrderBy(n => n));
                                doc.MainDocumentPart.FootnotesPart.Footnotes.AppendChild(
                                    new Footnote(
                                            new Paragraph(
                                                new Run(
                                                    new RunProperties(
                                                        new VerticalTextAlignment { Val = VerticalPositionValues.Superscript }
                                                    ),
                                                    new FootnoteReferenceMark()
                                                ),
                                                new Run(new Text(" " + fundInvestorNames) { Space = SpaceProcessingModeValues.Preserve }) 
                                            )
                                            
                                        )
                                        { Id = footnoteId }
                                );
                                footnoteId++;
                            }
                        }
                    }
                }
            }

            return stream;
        }
        private static TableCell CreateCell(string text, string width = null, string backgroundColor = null, string style = null, JustificationValues? justifyContent = null)
        {
            var cell = new TableCell();
            var properties = cell.AppendChild(new TableCellProperties());
            if (width != null)
            {
                properties.AppendChild(new TableCellWidth {Width = width, Type = TableWidthUnitValues.Dxa});
            }
            if (backgroundColor != null)
            {
                properties.AppendChild(new Shading
                {
                    Color = "auto",
                    Fill = backgroundColor,
                    Val = ShadingPatternValues.Clear
                });
            }
            var paragraph = cell.AppendChild(new Paragraph());
            var paragraphProperties = paragraph.AppendChild(new ParagraphProperties());
            if (justifyContent.HasValue)
            {
                paragraphProperties.AppendChild(new Justification {Val = JustificationValues.Right});
            }
            
            if (style != null)
            {
                paragraph.AppendChild(new ParagraphProperties
                {
                    ParagraphStyleId = new ParagraphStyleId {Val = style}
                });
            }
            var run = paragraph.AppendChild(new Run());
            if (style != null)
            {
                run.AppendChild(new RunProperties
                {
                    RunStyle = new RunStyle {Val = style}
                });
            }
            
            run.AppendChild(new Text(text));
            return cell;
        }

        private static Paragraph CreatePageBreak()
        {
            return new Paragraph(new Run(new Break {Type = BreakValues.Page}));
        }

    }
}

