var ElmStats = document.getElementById('stats');
var RepsStats = document.getElementById('allReps');

var slider = document.getElementById('slider');

if(localStorage.hasOwnProperty("stats"))
    var stats = JSON.parse(localStorage.stats);
else
    var stats = {};

noUiSlider.create(slider, {
    start: [0, Object.keys(stats).length],
    step: 1,
    connect: true,
    range: {
        'min': 0,
        'max': Object.keys(stats).length-1
    }
});
slider.noUiSlider.on('update.one', function () { 
    var val = slider.noUiSlider.get();
    document.getElementById('period').textContent = "Time Period: " + Object.keys(stats)[parseInt(val[0])] + '   -   ' +  Object.keys(stats)[parseInt(val[1])];
});

function apply()
{
    ElmStats.innerHTML = "";

    var s = Object.entries(stats);
    var val = slider.noUiSlider.get();
    
    var alltime = 0;
    var reps = {};
    
    for(var i = parseInt(val[0]); i < parseInt(val[1])+1; i++) {
        var key = s[i][0];
        var value = s[i][1];

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
        {
            ex.textContent += exs[a][0] + ": " + exs[a][1] + "   |   ";
            if(exs[a][0] in reps)
                reps[exs[a][0]] += exs[a][1];
            else 
                reps[exs[a][0]] = exs[a][1];
        }
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
    RepsStats.textContent = 'Overall Reps: | ';
    for(const [key, value] of Object.entries(reps)) {
        RepsStats.textContent += key + ": " + value + "   |   ";
    }
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

apply();
