using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.DataAccess;
using BermenMarch.MasterSideLetter.Common.DiffMatchPatch;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.Helpers
{
    public static class ProvisionComparison
    {

        public static async Task InheritProvisionTypesAsync(List<int> provisionIds, string connectionString)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(connectionString))
            {
                var searchSettings = await dataAccess.GetSearchSettingsAsync();
                var provisions = (await dataAccess.GetProvisionsAsync(provisionIds)).ToList();
                var currentScores = provisions.ToDictionary(p => p, p => new ProvisionTypeScore());
                foreach (var allProvision in dataAccess.GetFilteredProvisions(null, true))
                {
                    Parallel.ForEach(provisions.Where(p => p.Id != allProvision.Id && currentScores[p].Score < 1), provision =>
                    {
                        var score = provision.Content == allProvision.Content ? 1 : GetProvisionScore(searchSettings, provision.Content, allProvision.Content);

                        if (score >= searchSettings.InheritThreshold && score > currentScores[provision].Score)
                        {
                            currentScores[provision].ProvisionType = allProvision.ProvisionType;
                            currentScores[provision].Score = score;
                        }
                    });
                }

                //update inherited tags in db
                foreach (var pair in currentScores)
                {
                    var provision = pair.Key;
                    var score = pair.Value;
                    if (score.Score > 0 && provision.ProvisionType != score.ProvisionType)
                    {
                        provision.ProvisionType = score.ProvisionType;
                        provision.IsProvisionTypeInherited = true;
                        await dataAccess.UpdateProvisionAsync(provision);
                    }
                }
            }
        }

        public static async Task<IEnumerable<Provision>> PrecedentSearchAsync(SearchRequest request, string connectionString)
        {
            if (request == null || request.IsEmpty())
            {
                return null;
            }
            using (var dataAccess = new MasterSideLetterDataAccess(connectionString))
            {
                var searchSettings = await dataAccess.GetSearchSettingsAsync();
                var provisionHits = new List<Provision>();
                var currentScores = new[] { 0d, 0d, 0d, 0d };
                //var currentScore = 0d;
                var currentContent = "";

                
                foreach (var provision in dataAccess.GetFilteredProvisions(request))
                {
                    if (provision.Content != currentContent)
                    {
                        currentContent = provision.Content;
                        currentScores = currentContent == request.TargetText ? new[] { 1d, 1d, 1d, 1d } : GetProvisionScores(searchSettings, request.TargetText, currentContent);
                    }

                    if (currentScores[0] >= searchSettings.WeightedThreshold ||
                        currentScores[1] >= searchSettings.Algorithm1Threshold ||
                        currentScores[2] >= searchSettings.Algorithm2Threshold ||
                        currentScores[3] >= searchSettings.Algorithm3Threshold)
                    {
                        provision.HtmlContent = GetProvisionDifferences(request.TargetText, currentContent);
                        provision.MatchScore = currentScores[0];
                        provisionHits.Add(provision);
                    }
                }
                return provisionHits;
            }
        }

        private class ProvisionTypeScore
        {
            public string ProvisionType;
            public double Score;

            public ProvisionTypeScore(string provisionType = null, double score = 0)
            {
                ProvisionType = provisionType;
                Score = score;
            }
        }

        private static readonly CustomDiffMatchPatch Dmp = new CustomDiffMatchPatch();

        public static double GetProvisionScore(SearchSettings settings, string source, string target)
        {
            return GetProvisionScores(settings, source, target)[0];
        }


        public static double[] GetProvisionScores(SearchSettings settings, string source, string target)
        {
            var scores = new double[4];

            if (!string.IsNullOrWhiteSpace(source))
            {
                var sourceWordCount = source.Split().Length;
                var targetWordCount = target.Split().Length;
                var diffs = Dmp.diff_wordMode(source, target);
                Dmp.diff_cleanupSemantic(diffs);
                var matches = diffs.Where(d => d.operation == Operation.EQUAL).Select(d => d.text.Trim().Split().Length).Where(m => m > 1).ToList();
                if (matches.Count == 0)
                {
                    return scores;
                }
                scores[1] = Algorithm1(sourceWordCount, targetWordCount, matches);
                scores[2] = Algorithm2(sourceWordCount, targetWordCount, matches);
                scores[3] = Algorithm3(sourceWordCount, targetWordCount, matches);
                scores[0] = scores[1] * settings.Algorithm1Weight + scores[2] * settings.Algorithm2Weight + scores[3] * settings.Algorithm3Weight;

            }
            return scores;
        }


        private static double Algorithm1(int s1WordCount, int s2WordCount, List<int> matches)
        {
            return 6.0d * matches.Sum() / (Math.Max(s1WordCount, s2WordCount) + 5.0d * Math.Min(s1WordCount, s2WordCount));
        }

        private static double Algorithm2(int s1WordCount, int s2WordCount, List<int> matches)
        {
            if (s1WordCount < 3 || s2WordCount < 3)
            {
                return 0;
            }
            var matchCount = matches.Where(match => match >= 3).Sum(match => match - 2);
            return 6.0d * matchCount / (Math.Max(s1WordCount - 2, s2WordCount - 2) + 5.0d * Math.Min(s1WordCount - 2, s2WordCount - 2));
        }

        private static double Algorithm3(int s1WordCount, int s2WordCount, List<int> matches)
        {
            var wordCountTotal = matches.Where(match => match >= 3).Sum(match => match * match);
            return Math.Sqrt(6.0d * Math.Sqrt(wordCountTotal) / (Math.Max(s1WordCount, s2WordCount) + 5.0d * Math.Min(s1WordCount, s2WordCount)));
        }

        public static string GetProvisionDifferences(string source, string target)
        {
            var diffs = Dmp.diff_wordMode(source, target);
            Dmp.diff_cleanupSemantic(diffs);
            var html = Dmp.diff_prettyHtml(diffs);
            return html;
        }
    }
}
