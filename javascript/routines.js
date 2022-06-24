const datalist = document.getElementById('routines');

if(localStorage.hasOwnProperty("routines"))
    var routines = JSON.parse(localStorage.routines);
else 
    var routines = [];

routines.forEach(function(item){
    var option = document.createElement('option');
    option.value = item[0];
    datalist.appendChild(option);
});

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
        document.getElementById(key).value = value;
    }
}