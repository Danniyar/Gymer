const datalist = document.getElementById('routines');

if(localStorage.hasOwnProperty("routines"))
    var routines = JSON.parse(localStorage.routines);
else 
    var routines = [];

routines.forEach(function(item){
    var option = document.createElement('option');
    option.value = item[0];
    datalist.appendChild(option);
});