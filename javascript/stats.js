var ElmStats = document.getElementById('stats');

if(localStorage.hasOwnProperty("stats"))
    var stats = JSON.parse(localStorage.stats);
else
    var stats = {};

var alltime = 0;

for(const [key, value] of Object.entries(stats)) {
    var rotname = value[0];
    var exs = value[1];
    var time = value[2];

    var li = document.createElement("li");
    li.setAttribute('class', 'st');

    var info = document.createElement('label');
    info.textContent = key + "   ";
    info.style.color = 'yellow';

    var nm = document.createElement('label');
    nm.textContent = rotname + "   ";
    nm.style.color = 'cyan';

    var tm = document.createElement('label');
    var hours = Math.floor(time/3600);
    var minutes = Math.floor(time/60)-(hours*60);
    var seconds = time%60;
    if(seconds < 10)
        seconds = '0' + seconds;
    if(hours < 10)
        hours = '0' + hours;
    if(minutes < 10)
        minutes = '0' + minutes;
    tm.textContent = hours + ":" + minutes + ":" + seconds;

    var ex = document.createElement('label');
    ex.textContent = "|   "
    for(var a = 0; a < exs.length; a++)
        ex.textContent += exs[a][0] + ": " + exs[a][1] + "   |   ";
    ex.style.color = 'lime';

    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(e){ e.stopPropagation(); delSt(key); } );

    li.appendChild(info);
    li.appendChild(nm);
    li.appendChild(tm);
    li.appendChild(document.createElement('br'));
    li.appendChild(ex);
    li.appendChild(delBtn);
    ElmStats.appendChild(li);
    alltime += time;
}

function delSt(key)
{
    delete stats[key];
    localStorage.stats = JSON.stringify(stats);
    document.location.reload();
}

function reset()
{
    stats = {};
    localStorage.stats = JSON.stringify(stats);
    document.location.reload();
}

var hours = Math.floor(alltime/3600);
var minutes = Math.floor(alltime/60)-(hours*60);
var seconds = alltime%60;
if(seconds < 10)
    seconds = '0' + seconds;
if(hours < 10)
    hours = '0' + hours;
if(minutes < 10)
    minutes = '0' + minutes;
document.getElementById('allTime').textContent = "Overall Time Exercising: " + hours + ":" + minutes + ":" + seconds;