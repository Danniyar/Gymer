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

for(const [key, value] of Object.entries(exercises)) {
    var option = document.createElement('option');
    option.value = key;
    datalist.appendChild(option);
}

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
    var li = document.createElement('li');

    var input = document.createElement('input');
    input.setAttribute('list', 'exercises');
    input.setAttribute('class', 'ex');
    input.setAttribute('id', 'ex' + count)
    if(ex != null)
        input.value = ex;

    var labelsets = document.createElement('label');
    labelsets.setAttribute('for','sets');
    labelsets.textContent = 'Sets:';
    var sets = document.createElement('input');
    sets.setAttribute('type','number');
    sets.setAttribute('id','sets' + count);
    sets.setAttribute('name','sets' + count);
    sets.setAttribute('value',s);
    sets.setAttribute('min','1');
    sets.setAttribute('step','1');
    sets.setAttribute("oninput","validity.valid||(value='');");

    var labelreps = document.createElement('label');
    labelreps.setAttribute('for','reps');
    labelreps.textContent = 'Reps:';
    var reps = document.createElement('input');
    reps.setAttribute('type','number');
    reps.setAttribute('id','reps' + count);
    reps.setAttribute('name','reps' + count);
    reps.setAttribute('value',r);
    reps.setAttribute('min','1');
    reps.setAttribute('step','1');
    reps.setAttribute("oninput","validity.valid||(value='');");

    var sep = document.createElement('input');
    sep.setAttribute('type','checkbox');
    sep.setAttribute('id','sep' + count);
    sep.setAttribute('name','sep' + count);
    var labelsep = document.createElement('label');
    labelsep.setAttribute('for','sep');
    labelsep.textContent = 'Count joints as separate rep  ';

    var deleteBtn = document.createElement('button');
    var localcount = count;
    deleteBtn.addEventListener('click', function(){ deleteEx(localcount); });
    deleteBtn.textContent = '-';

    li.appendChild(input);
    li.appendChild(labelsets);
    li.appendChild(sets);
    li.appendChild(labelreps);
    li.appendChild(reps);
    li.appendChild(sep);
    li.appendChild(labelsep);
    li.appendChild(deleteBtn);
    li.setAttribute('id', count)
    ul.appendChild(li);
    count++;
}

function deleteEx(id)
{
    document.getElementById(id).remove();
}

function is_valid_datalist_value(idDataList, inputValue) {
    var option = document.querySelector("#" + idDataList + " option[value='" + inputValue + "']");
    if (option != null) {
      return option.value.length > 0;
    }
    return false;
}

function addRot()
{
    if(rotName.value == '')
    {
        nametoast.className = "show";
        setTimeout(function(){ nametoast.className = nametoast.className.replace("show", ""); }, 3000);
        return;
    }
    var lis = ul.getElementsByTagName("li");
    if(lis.length == 0)
    {
        extoast.className = "show";
        setTimeout(function(){ extoast.className = extoast.className.replace("show", ""); }, 3000);
        return;
    }
    var rot = [];
    for(var a = 0; a < lis.length; a++)
    {
        if(!is_valid_datalist_value(datalist.id, document.getElementById('ex' + lis[a].id).value))
        {
            datatoast.className = "show";
            setTimeout(function(){ datatoast.className = datatoast.className.replace("show", ""); }, 3000);
            return;
        }
        var ex = [];
        ex.push(document.getElementById('ex' + lis[a].id).value);
        ex.push(document.getElementById('sets' + lis[a].id).value);
        ex.push(document.getElementById('reps' + lis[a].id).value);
        ex.push(document.getElementById('sep' + lis[a].id).checked);
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