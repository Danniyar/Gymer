const rot = document.getElementById('routines');

if(localStorage.hasOwnProperty("routines"))
    var routines = JSON.parse(localStorage.routines);
else 
    var routines = {};

for(const [key, value] of Object.entries(routines)) {
    var li = document.createElement("li");
    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener('click', function(){ editRot(key); })
    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(){ delEx(key); } );
    li.textContent = key;
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    rot.appendChild(li);
}

function delRot(key)
{
    delete routines[key];
    localStorage.routines = JSON.stringify(routiness);
    document.location.reload();
}

function editRot(key)
{
    window.location.href='./addRoutine.html?rot=' + key;
}