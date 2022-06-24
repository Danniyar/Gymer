const rot = document.getElementById('routines');

var routines = JSON.parse(localStorage.routines);

for(var a = 0; a < routines.length; a++)
{
    var li = document.createElement("li");
    var delBtn = document.createElement("button");
    var index = a;
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(){ delRot(index); } );
    li.textContent = routines[a][0].toString();
    li.appendChild(delBtn);
    rot.appendChild(li);
}

function delRot(index)
{
    routines.splice(index, 1);
    localStorage.exercises = JSON.stringify(exercises);
    document.location.reload();
}