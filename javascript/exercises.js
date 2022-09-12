const ex = document.getElementById('exercises');

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else 
    var exercises = {};

for(const [key, value] of Object.entries(exercises)) {
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute('class','ex');
    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener('click',function(){ window.location.href='./addExercise.html?ex=' + key;});
    editBtn.style = "width:100%; height:100%;";
    editBtn.style.backgroundColor = "rgb(0, 92, 167)";
    th.style.color = 'rgb(62, 168, 168)';

    var sep = document.createElement('input');
    sep.setAttribute('type','checkbox');
    sep.setAttribute('id','sep' + key);
    sep.setAttribute('name','sep' + key);
    sep.checked = exercises[key][0];
    sep.onchange = function(){ change(key); };
    sep.addEventListener('click', function(e){ e.stopPropagation(); } );
    var labelsep = document.createElement('th');
    labelsep.appendChild(sep);
    labelsep.setAttribute('class', 'ex');

    var button = document.createElement("td");
    button.setAttribute('class','ex');
    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(e){ e.stopPropagation(); delEx(key); } );
    delBtn.style = "width:100%; height:100%;";
    button.appendChild(editBtn);
    button.appendChild(delBtn);

    th.textContent = key + '   ';
    tr.appendChild(th);
    tr.appendChild(labelsep);
    tr.appendChild(button);
    ex.appendChild(tr);
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