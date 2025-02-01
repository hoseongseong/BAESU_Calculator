const RIOT_API_KEY = "RGAPI-fc77da10-bd5a-441c-af4e-92cd606b75f1"

const woo = [ "PZDqLhMk5aLhT0YWnSn1yOZnTZ5a1hy4VdKq_jgslTDFhvpIgRrCQHvNIojlkDN0qGxGYEBmMWqs1A" ,
    "aimWpFSEwMQDNjJKk1MOWSIkFR5dBixBiE3fL1SRnDO4y-iub8pk19jSQseN4oCvuqxdzEdpaCAC5Q"
]

const lee = [ "CnhJr_-9D2F1TWrpPcOphLFr3zMrn86C3zHgsOjPLnxvHeX9WyKRpdwds1fqftYX0WnNEtXzkJ3QZA" ,
    "2si1Rf-yHDvSmM3jDrmsZjnCCAiw3IlcPO7QlYg4IqSOakUkImmNdSqzK4sbRH8PJAWoAUyWPzpsyg"
]

const jang = [ "pvq19oJzUdX0yme82JT6vQqYSjwzJbthmZnj_PodzNE0rc1t5mJXItSTr5SUrVVWQEsVQNsvWeedkA" ,
    "XDm5eud8f_8rIxRk0b8Gn-Zy4OVoHaSBmT9DTFEnYqFuoajOOuPjmNwUsC2MDQI5wVqeiE9o7r7bfw"
]

const ryu = [ "dFV7M7O4hq6cIRJVwXrog5iZRUFuPiV7movVMlTcMjisRIMzwhw7VqY9cXYEe_NAHeDtnKDlbllGpA" ,
    "zMNYvuqD5E5cIF92hF8-5F522Ct95R0icfoUdXEWJ4MIIxgfoz4N2FCKWyI20x75wSiAOHVi9DEKRw"
]

const jeon = [ "vz0QxPAT6XxGCCrP63bMAlfTM_kAB8nEozegrW7zw4CFp1u7SDiOfpsGvTbc5Kjs44GOF-8ihEfRYQ" ]

async function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec));
} 

class deal {
    constructor() {
        this.woo = 0;
        this.lee = 0;
        this.jang = 0;
        this.ryu = 0;
        this.jeon = 0;
    }
}

var rawData = Array.from({length:50})
var idx = 0;

async function getMatchHistory() {
  console.log("getMatchHistory")
  // find by jeon
  let link = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/vz0QxPAT6XxGCCrP63bMAlfTM_kAB8nEozegrW7zw4CFp1u7SDiOfpsGvTbc5Kjs44GOF-8ihEfRYQ/ids?type=normal&start=0&count=100&api_key=` + RIOT_API_KEY
  let response = await fetch(link)
  await response.json().then(async games => {
    for (var id of games) {
        getMatchInfo(id)
        if (idx > 50) return;
        await sleep(1000)
      }
  })
}

async function getMatchInfo(id) {
  let link = 'https://asia.api.riotgames.com/lol/match/v5/matches/' + id + '?api_key=' + RIOT_API_KEY
  let response = await fetch(link)
  await response.json().then(async game => {
    let isValid = isValidMatch(game)
    if (isValid) {
        console.log("getMatchInfo idx " + idx + " " +id)
        rawData[idx++] = getDamage(game)
    }
  })
}

function getDamage(game) {
    let match = new deal()
    console.log("getDamage")
    var members = game.info.participants
    for (var member of members) {
        var id = member.puuid
        if(woo.includes(id)) {
            match.woo = member.totalDamageDealtToChampions
        } else if(lee.includes(id)) {
            match.lee = member.totalDamageDealtToChampions
        } else if(jang.includes(id)) {
            match.jang = member.totalDamageDealtToChampions
        } else if(ryu.includes(id)) {
            match.ryu = member.totalDamageDealtToChampions
        } else if(jeon.includes(id)) {
            match.jeon = member.totalDamageDealtToChampions
        }
    }
    console.log(match)
    return match;
}

function isValidMatch(game) {
    console.log(game.info.gameMode)
    if (game.info.gameMode != "ARAM") {
        return false
    }
    var members = game.metadata.participants
    var cnt = 0;
    for (var id of members) {
        if(woo.includes(id)) {
            cnt++;
        } else if(lee.includes(id)) {
            cnt++;
        } else if(jang.includes(id)) {
            cnt++;
        } else if(ryu.includes(id)) {
            cnt++;
        } else if(jeon.includes(id)) {
            cnt++;
        }
    }
    return cnt >= 5
}

const getButton = document.getElementById("getButton")
const notice = document.getElementById("notice")
const setButton = document.getElementById("setButton")

getButton.addEventListener("click",async () => {
    idx = 0;
    notice.innerHTML = "Data 가져오는 중"
    await getMatchHistory()
    notice.innerHTML = "Data 가져오기 완료. 가져온 게임 수 : " + (idx + 1) 
})

setButton.addEventListener("click", () => {
    const wooRate = parseFloat(document.getElementById('wooRate').value);
    const leeRate = parseFloat(document.getElementById('leeRate').value);
    const jeonRate = parseFloat(document.getElementById('jeonRate').value);
    const jangRate = parseFloat(document.getElementById('jangRate').value);
    const ryuRate = parseFloat(document.getElementById('ryuRate').value);

    const wooCount = parseFloat(document.getElementById('result-woo').value);
    const leeCount = parseFloat(document.getElementById('result-lee').value);
    const jeonCount = parseFloat(document.getElementById('result-jeon').value);
    const jangCount = parseFloat(document.getElementById('result-jang').value);
    const ryuCount = parseFloat(document.getElementById('result-ryu').value);

    var wooCnt = 0
    var leeCnt = 0
    var jeonCnt = 0
    var jangCnt = 0
    var ryuCnt = 0
  
    if (idx==0) {
        notice.innerHTML = "Data 부터 가져와주세요"
    } else {
        for (var i = 0;i < idx;i++) {
            var game = rawData[i];
            var wooResult = game.woo * wooRate
            var leeResult = game.lee * leeRate
            var jeonResult = game.jeon * jeonRate
            var jangResult = game.jang * jangRate
            var ryuResult = game.ryu * ryuRate

            var minResult = Math.min(wooResult, leeResult, jeonResult, jangResult, ryuResult)

            if (minResult == wooResult) {
                wooCnt++;
            } else if (minResult == leeResult) {
                leeCnt++;
            } else if (minResult == jeonResult) {
                jeonCnt++;
            } else if (minResult == jangResult) {
                jangCnt++;
            } else if (minResult == ryuResult) {
                ryuCnt++;
            }
        }
        wooCount.innerHTML = wooCnt
        leeCount.innerHTML = leeCnt
        jeonCount.innerHTML = jeonCnt
        jangCount.innerHTML = jangCnt
        ryuCount.innerHTML = ryuCnt
    }
});

