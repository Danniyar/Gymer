const ex = document.getElementById('exercises');

var exercises = JSON.parse(localStorage.exercises);

for(var a = 0; a < exercises.length; a++)
{
    console.log(a);
    var li = document.createElement("li");
    var delBtn = document.createElement("button");
    var index = a;
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(){ delEx(index); } );
    li.textContent = exercises[a][0].toString();
    li.appendChild(delBtn);
    ex.appendChild(li);
}

function delEx(index)
{
    exercises.splice(index, 1);
    localStorage.exercises = JSON.stringify(exercises);
    document.location.reload();
}