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
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute('class', 'ex');
    var button = document.createElement("button");
    button.textContent = "Start";
    button.addEventListener('click', function(){ window.location.href='./playExercise.html?ex=' + key; } );
    button.style = "width:100%; height:100%;"
    var record = '0';
    if(records.hasOwnProperty(key))
        record = records[key];
    th.style.color = 'rgb(62, 168, 168)';
    th.textContent = key;

    var rec = document.createElement('th');
    rec.textContent = record;
    rec.style.color = 'rgb(211, 211, 67)';
    rec.setAttribute('class', 'ex');

    var but = document.createElement('td');
    but.setAttribute('class','ex');
    but.appendChild(button);

    tr.appendChild(th);
    tr.appendChild(rec);
    tr.appendChild(but);

    ex.appendChild(tr);
}