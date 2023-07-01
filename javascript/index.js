var storage = {}
if(localStorage.hasOwnProperty('records'))
  storage.records = localStorage.records;
if(localStorage.hasOwnProperty('routines'))
  storage.routines = localStorage.routines;
if(localStorage.hasOwnProperty('exercises'))
  storage.exercises = localStorage.exercises;
if(localStorage.hasOwnProperty('stats'))
  storage.stats = localStorage.stats;
if(localStorage.hasOwnProperty('settings'))
  storage.settings = localStorage.settings;
if(localStorage.hasOwnProperty('dailyRoutines'))
  storage.dailyRoutines = localStorage.dailyRoutines;

document.getElementById("import").onchange = function(event) {
    event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

	// Setup the callback event to run when the file is read
	reader.onload = logFile;

	// Read the file
	reader.readAsText(file.files[0]);
};

function logFile (event) {
    console.log('a');
	let str = event.target.result;
	let json = JSON.parse(str);
    for (const [key, value] of Object.entries(json)) {
        localStorage[key] = JSON.stringify(value);
    }
}

const download = () => (
    Object.assign(document.createElement("a"), {
      href: `data:application/JSON, ${encodeURIComponent(
        JSON.stringify(
          Object.keys(storage).reduce(
            (obj, k) => ({ ...obj, [k]: JSON.parse(storage[k]) }),
            {}
          ),
          null,
          2
        )
      )}`,
      download: "GymerExport",
    }).click()
  )

function openform() {
  document.getElementById("popupForm").style.display = "block";
  document.getElementsByClassName("overlay")[0].style.display = "block";
}
function closeform() {
  document.getElementById("popupForm").style.display = "none";
  document.getElementsByClassName("overlay")[0].style.display = "none";
}