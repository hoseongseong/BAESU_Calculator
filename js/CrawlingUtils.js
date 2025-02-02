// ***********CHANGE VALUE****************

const woo_default = 0.98
const lee_default = 1.04
const jeon_default = 2.1
const jang_default = 1.2
const ryu_default = 1.26

const games_default = 50

const rate_default = 0.01
const depth_default = 6

// ***********CHANGE VALUE****************
var RIOT_API_KEY = "RGAPI-3c3be1c5-ebec-4cc8-863f-c7f2c8df3040"

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
  let link = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/vz0QxPAT6XxGCCrP63bMAlfTM_kAB8nEozegrW7zw4CFp1u7SDiOfpsGvTbc5Kjs44GOF-8ihEfRYQ/ids?type=normal&start=0&count=100&api_key=` + RIOT_API_KEY
  let response = await fetch(link)
  await response.json().then(async games => {
    for (var id of games) {
        getMatchInfo(id)
        if (idx > games_default) return;
        await sleep(500)
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
    if (game.info.gameMode != "ARAM" || game.info.gameDuration < 200) {
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
const calButton = document.getElementById("calButton")
const ctx = document.getElementById('myChart').getContext('2d');

document.getElementById('wooRate').value = woo_default
document.getElementById('leeRate').value = lee_default
document.getElementById('jeonRate').value = jeon_default
document.getElementById('jangRate').value = jang_default
document.getElementById('ryuRate').value = ryu_default

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['승수', '지훈', '지윤', '호성', '승희'],
        datasets: [{
            label: '꼴등 횟수',
            data: [
                0,
                0,
                0,
                0,
                0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            datalabels: {
                color: 'black',
                font: {
                    weight: 'bold',
                    size: 14
                },
                anchor: 'end',
                align: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

getButton.addEventListener("click",async () => {
    idx = 0;
    RIOT_API_KEY = document.getElementById('API').value
    notice.innerHTML = "Data 가져오는 중"
    await getMatchHistory()
    notice.innerHTML = "Data 가져오기 완료. 가져온 게임 수 : " + (idx + 1) 
})

calButton.addEventListener("click",async () => {
    if (idx==0) {
        notice.innerHTML = "Data 부터 가져와주세요"
    } else {
        notice.innerHTML = "자동으로 배수를 계산 중"
        await autoRate()
        notice.innerHTML = "자동 배수 계산 완료"
    }
})

setButton.addEventListener("click", () => {
    draw()
});

function draw() {
    const wooRate = parseFloat(document.getElementById('wooRate').value)
    const leeRate = parseFloat(document.getElementById('leeRate').value)
    const jeonRate = parseFloat(document.getElementById('jeonRate').value)
    const jangRate = parseFloat(document.getElementById('jangRate').value)
    const ryuRate = parseFloat(document.getElementById('ryuRate').value)

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
        drawChart(wooCnt, leeCnt, jeonCnt, jangCnt, ryuCnt)
    }
}

function drawChart(wr, lr, jr, jjr, rr) {
    console.log("UPDATE")
    myChart.data.datasets[0].data = [wr, lr, jr, jjr, rr]
    myChart.update();
}

var min = 1000000;
var best = [0, 0, 0, 0, 0]

function autoRate() {
    const wooRate = parseFloat(document.getElementById('wooRate').value)
    const leeRate = parseFloat(document.getElementById('leeRate').value)
    const jeonRate = parseFloat(document.getElementById('jeonRate').value)
    const jangRate = parseFloat(document.getElementById('jangRate').value)
    const ryuRate = parseFloat(document.getElementById('ryuRate').value)

    const rates = [wooRate, leeRate, jeonRate, jangRate, ryuRate]

    min = 1000000
    best = [wooRate, leeRate, jeonRate, jangRate, ryuRate]
    calculate(rates)
    bt(rates, 0)
    console.log("finsith")
    console.log(best)
    document.getElementById('wooRate').value = best[0]
    document.getElementById('leeRate').value = best[1]
    document.getElementById('jeonRate').value = best[2]
    document.getElementById('jangRate').value = best[3]
    document.getElementById('ryuRate').value = best[4]

    draw()
}

function bt(rates, depth) {
    calculate(rates)
    if (depth >= depth_default) return;
    for(var i=0;i<5;i++) {
        rates[i] += rate_default
        bt(rates, depth+1)

        rates[i] -= rate_default
        rates[i] -= rate_default
        bt(rates, depth+1)
        
        rates[i] += rate_default
    }
}

function calculate(rates) {
    var cnt = [0, 0, 0, 0, 0]
    for (var i = 0;i < idx;i++) {
        var game = rawData[i];
        var wooResult = game.woo * rates[0]
        var leeResult = game.lee * rates[1]
        var jeonResult = game.jeon * rates[2]
        var jangResult = game.jang * rates[3]
        var ryuResult = game.ryu * rates[4]

        var minResult = Math.min(wooResult, leeResult, jeonResult, jangResult, ryuResult)

        if (minResult == wooResult) {
            cnt[0]++;
        } else if (minResult == leeResult) {
            cnt[1]++;
        } else if (minResult == jeonResult) {
            cnt[2]++;
        } else if (minResult == jangResult) {
            cnt[3]++;
        } else if (minResult == ryuResult) {
            cnt[4]++;
        }
    }
    var val = std(cnt)
    if(val < min) {
        min = val
        best[0] = rates[0]
        best[1] = rates[1]
        best[2] = rates[2]
        best[3] = rates[3]
        best[4] = rates[4]
        console.log("UPDATE")
        console.log(min)
        console.log(best)
    }
}

function std(numbers) {
    const n = numbers.length;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / n;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }
