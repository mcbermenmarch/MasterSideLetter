using System;
using System.Collections.Generic;
using System.Text;

namespace BermenMarch.MasterSideLetter.Common.DiffMatchPatch
{
    class CustomDiffMatchPatch : diff_match_patch
    {
        public List<Diff> diff_wordMode(string text1, string text2)
        {
            var a = diff_linesToWords($"{text1}",$"{text2}");
            var lineText1 = a[0] as string;
            var lineText2 = a[1] as string;
            var lineArray = a[2] as List<string>;
            var diffs = diff_main(lineText1, lineText2, false);
            diff_charsToLines(diffs, lineArray);
            return diffs;
        }

        /**
 * Split two texts into a list of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param text1 First string.
 * @param text2 Second string.
 * @return Three element Object array, containing the encoded text1, the
 *     encoded text2 and the List of unique strings.  The zeroth element
 *     of the List of unique strings is intentionally blank.
 */
        protected Object[] diff_linesToWords(string text1, string text2)
        {
            List<string> lineArray = new List<string>();
            Dictionary<string, int> lineHash = new Dictionary<string, int>();
            // e.g. linearray[4] == "Hello\n"
            // e.g. linehash.get("Hello\n") == 4

            // "\x00" is a valid character, but various debuggers don't like it.
            // So we'll insert a junk entry to avoid generating a null character.
            lineArray.Add(string.Empty);

            // Allocate 2/3rds of the space for text1, the rest for text2.
            string chars1 = diff_linesToCharsMungeX(text1, lineArray, lineHash, 40000);
            string chars2 = diff_linesToCharsMungeX(text2, lineArray, lineHash, 65535);
            return new Object[] { chars1, chars2, lineArray };
        }


        /**
 * Split a text into a list of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param text String to encode.
 * @param lineArray List of unique strings.
 * @param lineHash Map of strings to indices.
 * @param maxLines Maximum length of lineArray.
 * @return Encoded string.
 */
        private readonly char[] _lineEndChars = {' ', '\t', '\n', '.', ',', ';', ':', '"', '“', '”'};
        private string diff_linesToCharsMungeX(string text, List<string> lineArray,
            Dictionary<string, int> lineHash, int maxLines)
        {

            int lineStart = 0;
            int lineEnd = -1;
            string line;
            StringBuilder chars = new StringBuilder();
            // Walk the text, pulling out a Substring for each line.
            // text.split('\n') would would temporarily double our memory footprint.
            // Modifying text would create many large strings to garbage collect.
            while (lineEnd < text.Length - 1)
            {
                lineEnd = text.IndexOfAny(_lineEndChars, lineStart);
                if (lineEnd == -1)
                {
                    lineEnd = text.Length - 1;
                }
                line = text.JavaSubstring(lineStart, lineEnd + 1);

                if (lineHash.ContainsKey(line))
                {
                    chars.Append(((char)(int)lineHash[line]));
                }
                else
                {
                    if (lineArray.Count == maxLines)
                    {
                        // Bail out at 65535 because char 65536 == char 0.
                        line = text.Substring(lineStart);
                        lineEnd = text.Length;
                    }
                    lineArray.Add(line);
                    lineHash.Add(line, lineArray.Count - 1);
                    chars.Append(((char)(lineArray.Count - 1)));
                }
                lineStart = lineEnd + 1;
            }
            return chars.ToString();
        }

    }
}
