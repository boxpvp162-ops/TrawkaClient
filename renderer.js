const $=id=>document.getElementById(id);
$("login").onclick=async()=>{ $("status").textContent="Logowanie Microsoft..."; const r=await window.api.login(); if(r.ok){$("user").textContent=r.name;$("profile").innerHTML=`<img class="skin" src="${r.skin}"><br>${r.name}<br><small>${r.uuid}</small>`;$("login").textContent="Zalogowano";$("status").textContent="Gotowe."; }else $("status").textContent="Błąd: "+r.error;};
$("play").onclick=async()=>{ $("status").textContent="Uruchamianie Minecraft..."; const r=await window.api.launch({version:$("version").value,ram:$("ram").value}); $("status").textContent=r.ok?"Minecraft został uruchomiony.":"Błąd: "+r.error;};
$("folder").onclick=()=>window.api.openFolder();
window.api.onUpdate(msg=>$("status").textContent=msg);
window.api.version().then(v=>document.title="TrawkaLauncher V4 • "+v);
