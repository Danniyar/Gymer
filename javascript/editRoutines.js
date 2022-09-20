const rot = document.getElementById('routines');

if(localStorage.hasOwnProperty("routines"))
    var routines = JSON.parse(localStorage.routines);
else 
    var routines = {};

for(const [key, value] of Object.entries(routines)) {
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute('class','rot');
    var editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.addEventListener('click', function(){ editRot(key); })
    th.style.color = 'rgb(211, 211, 67)';

    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(e){e.stopPropagation(); delRot(key); } );
    editBtn.style = "width:100%; height:100%;";
    delBtn.style = "width:100%; height:100%;";
    editBtn.style.backgroundColor = "rgb(0, 92, 167)";

    th.textContent = key;

    var td = document.createElement("td");
    td.appendChild(editBtn);
    td.appendChild(delBtn);

    tr.appendChild(th);
    tr.appendChild(td);

    rot.appendChild(tr);
}

function delRot(key)
{
    if(localStorage.hasOwnProperty("settings"))
    {
        var settings = JSON.parse(localStorage.settings);
        if(settings.hasOwnProperty('routines') && settings['routines'].hasOwnProperty(key))
            delete settings['routines'][key];
        localStorage.settings = JSON.stringify(settings);
    }
    delete routines[key];
    localStorage.routines = JSON.stringify(routines);
    document.location.reload();
}

function editRot(key)
{
    window.location.href='./addRoutine.html?rot=' + key;
}