namespace SignalRSampleProject
{
    public static class SD
    {
        public const string one = "option1";
        public const string two = "option2";
        public const string three = "option3";

        public static Dictionary<string, int> VotingDemoDict;

        static SD()
        {
            VotingDemoDict = new Dictionary<string, int>();
            VotingDemoDict.Add(one, 0);
            VotingDemoDict.Add(two, 0);
            VotingDemoDict.Add(three, 0);
        }

    }
}
