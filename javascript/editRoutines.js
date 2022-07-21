const rot = document.getElementById('routines');

if(localStorage.hasOwnProperty("routines"))
    var routines = JSON.parse(localStorage.routines);
else 
    var routines = {};

for(const [key, value] of Object.entries(routines)) {
    var li = document.createElement("li");
    li.setAttribute('class','rot');
    li.addEventListener('click', function(){ editRot(key); })
    li.style.color = 'yellow';
    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(e){e.stopPropagation(); delRot(key); } );
    li.textContent = key;
    li.appendChild(delBtn);
    rot.appendChild(li);
}

function delRot(key)
{
    if(localStorage.hasOwnProperty("settings"))
    {
        var settings = JSON.parse(localStorage.settings);
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