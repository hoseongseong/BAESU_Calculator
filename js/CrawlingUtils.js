const RIOT_API_KEY = "RGAPI-e97a9f45-057e-40ff-b034-726675352d7e";
const MATCH_REGION = 'asia';



btn = document.getElementById("testbutton");
btn.addEventListener("click",() => {
    const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/pvq19oJzUdX0yme82JT6vQqYSjwzJbthmZnj_PodzNE0rc1t5mJXItSTr5SUrVVWQEsVQNsvWeedkA`;

    const result = axios.get(url, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }).catch((Error) => {
        console.log(Error);
    })
    console.log(result);
})