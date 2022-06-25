const ex = document.getElementById('exercises');

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else 
    var exercises = {};

for(const [key, value] of Object.entries(exercises)) {
    var li = document.createElement("li");
    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function(){ delEx(key); } );
    li.textContent = key;
    li.appendChild(delBtn);
    ex.appendChild(li);
}

function delEx(key)
{
    delete exercises[key];
    localStorage.exercises = JSON.stringify(exercises);
    document.location.reload();
}