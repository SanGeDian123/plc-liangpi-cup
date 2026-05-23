async function loadAdmin(){

  const res = await fetch(`${API_URL}/players`);

  const players = await res.json();

  const list = document.getElementById("adminList");

  list.innerHTML = "";

  players.forEach(p=>{

    const div = document.createElement("div");

    div.className = "admin-item";

    div.innerHTML = `
      <span>${p.nickname}</span>
      <span>${p.score}</span>

      <button onclick="deletePlayer(${p.id})">
        删除
      </button>
    `;

    list.appendChild(div);
  });
}

async function addPlayer(){

  const nickname =
    document.getElementById("nickname").value;

  const number =
    document.getElementById("number").value;

  const score =
    document.getElementById("score").value;

  await fetch(`${API_URL}/players`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      nickname,
      number,
      score:Number(score)
    })
  });

  loadAdmin();
}

async function deletePlayer(id){

  await fetch(`${API_URL}/players/${id}`,{
    method:"DELETE"
  });

  loadAdmin();
}

loadAdmin();