const ul = document.getElementById('exercs');
const datalist = document.getElementById('exercises');
const datatoast = document.getElementById('datasnackbar');
const nametoast = document.getElementById('namesnackbar');
const extoast = document.getElementById('exsnackbar');
const rotName = document.getElementById('rotname');
var count = 0;

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else 
    var exercises = {};

function findGetParameter(parameterName) {
    var result = null, tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) 
            result = decodeURIComponent(tmp[1]);
    });
    return result;
}

var rotkey = findGetParameter('rot')
if(rotkey != null)
{
    var localrot = JSON.parse(localStorage.routines);
    var routine = localrot[rotkey];
    routine.forEach(function(item) {
        if(item[0] in exercises)
            addEx(item[0],item[1],item[2]);
        else 
            routine.splice(routine.indexOf(item), 1);
    });
    rotName.value = rotkey;
    localrot[rotkey] = routine;
    localStorage.routines = JSON.stringify(localrot);
}

function addEx(ex,s,r)
{
    ex = ex || null;
    s = s || 1;
    r = r || 1;
    var tr = document.createElement('tr');

    var th = document.createElement("th");
    var selecta = document.createElement('select');
    th.setAttribute('class', 'ex');
    selecta.setAttribute('id', 'ex' + count);
    th.appendChild(selecta)
    for(const [key, value] of Object.entries(exercises)) {
        var option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        selecta.appendChild(option);
    }
    if(ex != null)
        selecta.value = ex;

    var labelsets = document.createElement('th');
    labelsets.setAttribute('class','sets');
    var sets = document.createElement('input');
    sets.setAttribute('type','number');
    sets.setAttribute('id','sets' + count);
    sets.setAttribute('name','sets' + count);
    sets.setAttribute('value',s);
    sets.setAttribute('min','1');
    sets.setAttribute('step','1');
    sets.setAttribute("oninput","validity.valid||(value='');");
    labelsets.appendChild(sets);

    var labelreps = document.createElement('th');
    labelreps.setAttribute('class','reps');
    var reps = document.createElement('input');
    reps.setAttribute('type','number');
    reps.setAttribute('id','reps' + count);
    reps.setAttribute('name','reps' + count);
    reps.setAttribute('value',r);
    reps.setAttribute('min','1');
    reps.setAttribute('step','1');
    reps.setAttribute("oninput","validity.valid||(value='');");
    labelreps.appendChild(reps);

    var td = document.createElement('td');
    var deleteBtn = document.createElement('button');
    var localcount = count;
    deleteBtn.addEventListener('click', function(){ deleteEx(localcount); });
    deleteBtn.textContent = 'Delete';
    td.appendChild(deleteBtn);

    tr.appendChild(th);
    tr.appendChild(labelsets);
    tr.appendChild(labelreps);
    tr.appendChild(td);
    tr.setAttribute('id', count);
    tr.setAttribute("class","exercise");
    ul.appendChild(tr);
    count++;
}

function deleteEx(id)
{
    document.getElementById(id).remove();
}

function addRot()
{
    if(rotName.value == '')
    {
        nametoast.className = "show";
        setTimeout(function(){ nametoast.className = nametoast.className.replace("show", ""); }, 3000);
        return;
    }
    var trs = ul.getElementsByClassName("exercise");
    if(trs.length == 0)
    {
        extoast.className = "show";
        setTimeout(function(){ extoast.className = extoast.className.replace("show", ""); }, 3000);
        return;
    }
    var rot = [];
    for(var a = 0; a < trs.length; a++)
    {
        var ex = [];
        ex.push(document.getElementById('ex' + trs[a].id).value);
        ex.push(document.getElementById('sets' + trs[a].id).value);
        ex.push(document.getElementById('reps' + trs[a].id).value);
        rot.push(ex);
    }
    if(localStorage.hasOwnProperty("routines"))
        var routines = JSON.parse(localStorage.routines);
    else 
        var routines = {};
    routines[rotName.value] = rot;
    localStorage.routines = JSON.stringify(routines);
    window.location.href = './editRoutines.html';
}