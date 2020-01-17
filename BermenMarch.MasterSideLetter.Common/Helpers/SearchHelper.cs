using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Dynamic;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.Helpers
{
    public static class SearchHelper
    {
        public static string[] GetPhrases(string query)
        {
            var phrases = new List<string>();
            var inQuoteMode = false;
            var currentPhrase = new StringBuilder();
            foreach (var c in query)
            {
                if (!inQuoteMode && c == '"')
                {
                    if (currentPhrase.Length > 0)
                    {
                        phrases.AddRange(currentPhrase.ToString().Split(' '));
                        currentPhrase.Clear();
                    }

                    inQuoteMode = true;
                }
                else if (inQuoteMode && c == '"')
                {
                    phrases.Add(currentPhrase.ToString());
                    currentPhrase.Clear();
                    inQuoteMode = false;
                }
                else
                {
                    currentPhrase.Append(c);
                }
            }

            //catch the last phrase
            if (currentPhrase.Length > 0)
            {
                phrases.AddRange(currentPhrase.ToString().Split(' '));
            }

            return phrases.Where(s => !string.IsNullOrWhiteSpace(s)).Select(p => p.Trim()).ToArray();
        }


        public static void AppendSearchCondition(string targetText, List<string> columnsNames,PreparedQuery preparedQuery)
        {
            var allPhrases = GetPhrases(targetText);
            var isOrCondition = false;
            var phrases = new List<string>();
            var notPhrases = new List<string>();
            for (var p = 0; p < allPhrases.Length; p++)
            {
                var phrase = allPhrases[p];
                switch (phrase)
                {
                    case "AND":
                        continue;
                    case "OR":
                        isOrCondition = true;
                        continue;
                    case "NOT":
                        p++;
                        if (p >= allPhrases.Length) break;
                        notPhrases.Add(allPhrases[p]);
                        continue;
                    default:
                        phrases.Add(phrase);
                        break;
                }
            }

            if (phrases.Count > 0)
            {
                var conditions = columnsNames.ToDictionary(s => s, s => new StringBuilder());
                var index = 0;
                foreach (var phrase in phrases)
                {
                    var andOrOr = index == 0 ? "" : isOrCondition ? "OR" : "AND";
                    preparedQuery.AddParameter($"phrase{index}", phrase);
                    foreach (var columnName in conditions.Keys)
                    {
                        conditions[columnName].Append($" {andOrOr} isnull({columnName},'') like '%' + @phrase{index} + '%' ");
                    }

                    index++;
                }
                preparedQuery.Sql.Append(" AND (");
                var split = "";
                foreach (var condition in conditions.Values)
                {
                    preparedQuery.Sql.Append($"{split} ({condition})");
                    split = " OR ";
                }

                preparedQuery.Sql.Append(") ");
            }

            if (notPhrases.Count > 0)
            {
                var notConditions = columnsNames.ToDictionary(s => s, s => new StringBuilder());
                var notIndex = 0;
                foreach (var phrase in notPhrases)
                {
                    var andOrOr = notIndex == 0 ? "" : isOrCondition ? "OR" : "AND";
                    preparedQuery.AddParameter($"notPhrase{notIndex}", phrase);
                    foreach (var columnName in notConditions.Keys)
                    {
                        notConditions[columnName].Append($" {andOrOr} isnull({columnName},'') not like '%' + @notPhrase{notIndex} + '%' ");
                    }
                    notIndex++;
                }
                preparedQuery.Sql.Append(" AND (");
                var split = "";
                foreach (var notCondition in notConditions.Values)
                {
                    preparedQuery.Sql.Append($"{split} ({notCondition})");
                    split = " AND ";
                }
                preparedQuery.Sql.Append(") ");
            }
        }
    }

    public class PreparedQuery
    {
        public StringBuilder Sql;
        public dynamic Parameters;

        public PreparedQuery(SearchRequest request)
        {
            Sql = new StringBuilder();
            Parameters = new ExpandoObject();
            Parameters.TargetText = request.TargetText;
            Parameters.FundSearchLimit = request.FundSearchLimit;
            Parameters.InvestorSearchLimit = request.InvestorSearchLimit;
            Parameters.SideLetterSearchLimit = request.SideLetterSearchLimit;
            Parameters.ProvisionSearchLimit = request.ProvisionSearchLimit;
            Parameters.SearchCategory = request.SearchCategory;
            Parameters.FundValues = request.FundValues;
            Parameters.InvestorValues = request.InvestorValues;
            Parameters.SponsorValues = request.SponsorValues;
            Parameters.BusinessUnitValues = request.BusinessUnitValues;
            Parameters.StrategyValues = request.StrategyValues;
            Parameters.InvestorTypeValues = request.InvestorTypeValues;
            Parameters.ProvisionTypeValues = request.ProvisionTypeValues;
            Parameters.EntityValues = request.EntityValues;
            Parameters.CounselValues = request.CounselValues;
            Parameters.SizeMin = request.SizeMin;
            Parameters.SizeMax = request.SizeMax;
            Parameters.YearMin = request.YearMin;
            Parameters.YearMax = request.YearMax;
            Parameters.FundId = request.FundId;
            Parameters.InvestorId = request.InvestorId;
            Parameters.FundInvestorIds = request.FundInvestorIds;
            Parameters.AggregateSizeMin = request.AggregateSizeMin;
            Parameters.AggregateSizeMax = request.AggregateSizeMax;
            Parameters.CommitmentMin = request.CommitmentMin;
            Parameters.CommitmentMax = request.CommitmentMax;
            Parameters.UserName = request.UserName;
        }

        public void AddParameter(string name, object value)
        {
            (Parameters as IDictionary<string, object>)?.Add(name, value);
        }
    }


}
