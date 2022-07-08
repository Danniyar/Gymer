const selects = document.getElementsByTagName('select');

if(localStorage.hasOwnProperty("routines"))
    var routines = JSON.parse(localStorage.routines);
else 
    var routines = {};

for(var a = 0; a < selects.length; a++)
{
    for(const [key, value] of Object.entries(routines)) {
        var option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        selects[a].appendChild(option);
    }
}

function saveRoutine(object)
{
    if(localStorage.hasOwnProperty("dailyRoutines"))
        var dr = JSON.parse(localStorage.dailyRoutines);
    else
        var dr = {};
    dr[object.name] = object.value;
    localStorage.dailyRoutines = JSON.stringify(dr);
}

if(localStorage.hasOwnProperty("dailyRoutines"))
{
    var dr = JSON.parse(localStorage.dailyRoutines);
    for(const [key, value] of Object.entries(dr)) {
        if(value in routines)
            document.getElementsByName(key)[0].value = value;
        else 
            saveRoutine(document.getElementsByName(key)[0]);
        document.getElementById(key).addEventListener('click',function(){ window.location.href='./playRoutine.html?rot=' + value;});
        document.getElementsByName(key)[0].addEventListener('click', function(e){ e.stopPropagation(); });
    }
}