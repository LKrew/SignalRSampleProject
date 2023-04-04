using Microsoft.AspNetCore.SignalR;

namespace SignalRSampleProject.Hubs
{
    public class VotingDemoHub : Hub
    {
        public Dictionary<string, int> GetRaceStatus()
        {
            return SD.VotingDemoDict;
        }
    }
}
