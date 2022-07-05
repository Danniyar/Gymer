const ex = document.getElementById('exercises');

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else 
    var exercises = {};

if(localStorage.hasOwnProperty("records"))
    var records = JSON.parse(localStorage.records);
else 
    var records = {};

for(const [key, value] of Object.entries(exercises)) {
    var li = document.createElement("li");
    var playBtn = document.createElement("button");
    playBtn.textContent = "Start";
    playBtn.addEventListener('click', function(){ window.location.href='./playExercise.html?ex=' + key; } );
    var record = '0';
    if(records.hasOwnProperty(key))
        record = records[key];
    li.textContent = key + '( Current Record: ' + record + ' )     ';
    li.appendChild(playBtn);
    ex.appendChild(li);
}