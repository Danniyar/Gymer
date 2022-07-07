const ex = document.getElementById('exercises');

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else 
    var exercises = {};

for(const [key, value] of Object.entries(exercises)) {
    var li = document.createElement("li");

    var sep = document.createElement('input');
    sep.setAttribute('type','checkbox');
    sep.setAttribute('id','sep' + key);
    sep.setAttribute('name','sep' + key);
    sep.checked = exercises[key][0];
    sep.onchange = function(){ change(key); };
    var labelsep = document.createElement('label');
    labelsep.setAttribute('for','sep');
    labelsep.textContent = 'Count joints as separate rep     ';

    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(){ delEx(key); } );
    li.textContent = key + '   ';
    li.appendChild(sep);
    li.appendChild(labelsep);
    li.appendChild(delBtn);
    ex.appendChild(li);
}

function delEx(key)
{
    if(localStorage.hasOwnProperty("records"))
    {
        var records = JSON.parse(localStorage.records);
        if(key in records)
            delete records[key];
        localStorage.records = JSON.stringify(records);
    }
    delete exercises[key];
    localStorage.exercises = JSON.stringify(exercises);
    document.location.reload();
}

function change(key)
{
    exercises[key][0] = document.getElementById('sep' + key).checked;
    localStorage.exercises = JSON.stringify(exercises);
    document.location.reload();
}