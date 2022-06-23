const ul = document.getElementById('exercs');

function addEx()
{
    console.log('a');
    var li = document.createElement('li');

    var input = document.createElement('input');
    input.setAttribute('list', 'exercises');
    input.setAttribute('class', 'ex');

    var labelsets = document.createElement('label');
    labelsets.setAttribute('for','sets');
    labelsets.textContent = 'Sets:';
    var sets = document.createElement('input');
    sets.setAttribute('type','number');
    sets.setAttribute('id','sets');
    sets.setAttribute('name','sets');
    sets.setAttribute('value','1');
    sets.setAttribute('min','1');
    sets.setAttribute('step','1');
    sets.setAttribute("oninput","validity.valid||(value='');");

    var labelreps = document.createElement('label');
    labelreps.setAttribute('for','reps');
    labelreps.textContent = 'Reps:';
    var reps = document.createElement('input');
    reps.setAttribute('type','number');
    reps.setAttribute('id','reps');
    reps.setAttribute('name','reps');
    reps.setAttribute('value','1');
    reps.setAttribute('min','1');
    reps.setAttribute('step','1');
    reps.setAttribute("oninput","validity.valid||(value='');");

    li.appendChild(input);
    li.appendChild(labelsets);
    li.appendChild(sets);
    li.appendChild(labelreps);
    li.appendChild(reps);
    ul.appendChild(li);
}