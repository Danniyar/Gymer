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
    if(Object.keys(stats).length > 0)
        document.getElementById('period').textContent = "Time Period: " + Object.keys(stats)[parseInt(val[0])] + '   -   ' +  Object.keys(stats)[parseInt(val[1])];
});

function apply()
{
    ElmStats.innerHTML = "<tr><th>Date</th><th>Routine Name</th><th>Exercises Done</th><th>Time Spent</th><th>Action</th></tr>";

    var s = Object.entries(stats);
    var val = slider.noUiSlider.get();
    
    var alltime = 0;
    var reps = {};
    
    for(var i = parseInt(val[1]); i >= parseInt(val[0]); i--) {
        const key = s[i][0];
        var value = s[i][1];

        var rotname = value[0];
        var exs = value[1];
        var time = value[2];

        var tr = document.createElement("tr");
        tr.setAttribute('class', 'st');

        var info = document.createElement('th');
        info.textContent = key;
        info.style.color = 'rgb(211, 211, 67)';
        info.setAttribute('class', 'st');

        var nm = document.createElement('th');
        nm.textContent = rotname;
        nm.style.color = 'rgb(62, 168, 168)';
        nm.setAttribute('class', 'st');

        var tm = document.createElement('th');
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
        tm.setAttribute('class', 'st');

        var ex = document.createElement('th');
        ex.setAttribute('class', 'st');
        ex.textContent = "|   "
        for(var a = 0; a < exs.length; a++)
        {
            ex.textContent += exs[a][0] + ": " + exs[a][1] + "   |   ";
            if(exs[a][0] in reps)
                reps[exs[a][0]] += exs[a][1];
            else 
                reps[exs[a][0]] = exs[a][1];
        }
        ex.style.color = 'rgb(77, 223, 77)';

        var delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.addEventListener('click', function(e){ e.stopPropagation(); delSt(key); } );
        delBtn.style = "width:100%; height:100%;"
        var but = document.createElement('td');
        but.setAttribute('class', 'st');
        but.appendChild(delBtn);

        tr.appendChild(info);
        tr.appendChild(nm);
        tr.appendChild(ex);
        tr.appendChild(tm);
        tr.appendChild(but);
        ElmStats.appendChild(tr);
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

if(Object.keys(stats).length > 0)
    apply();
