async function loadPlayers() {

  const res = await fetch(`${API_URL}/players`);

  const players = await res.json();

  renderTop3(players.slice(0,3));

  renderRanking(players);

  document.getElementById("updateTime").innerHTML =
    "最后更新：" + new Date().toLocaleString();
}

function renderTop3(players){

  const container = document.getElementById("top3");

  container.innerHTML = "";

  players.forEach((p,index)=>{

    const div = document.createElement("div");

    div.className =
      "top-card " +
      (index===0 ? "first" : "");

    div.innerHTML = `
      <div class="rank">#${index+1}</div>
      <div class="nickname">${p.nickname}</div>
      <div>${p.number}</div>
      <div class="score">${p.score}</div>
    `;

    container.appendChild(div);
  });
}

function renderRanking(players){

  const list = document.getElementById("rankingList");

  list.innerHTML = "";

  players.forEach((p,index)=>{

    const div = document.createElement("div");

    div.className = "rank-item";

    div.innerHTML = `
      <div>#${index+1}</div>
      <div>${p.nickname}</div>
      <div>${p.number}</div>
      <div>${p.score}</div>
    `;

    list.appendChild(div);
  });
}

loadPlayers();

setInterval(loadPlayers, 5000);