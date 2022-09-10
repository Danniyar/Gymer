const videoElement = document.getElementsByClassName('input_video')[0];
const cameraOptions = document.querySelector('.video-options>select');
const container = document.getElementsByClassName('container')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const exName = document.getElementById('exercise');
const rotName = document.getElementById('routine');
const reps = document.getElementById('reps');
const sets = document.getElementById('sets');
const delayBtn = document.getElementById('delay');
const startBtn = document.getElementById('pauseBtn');
const resetCheck = document.getElementById('resetset');
const resetExCheck = document.getElementById('resetex');
var constraints = { width: 1280, height: 720, frameRate: { min: 30 } };
var ids = [];
var counting = false;
var dropdown = false;
var separate = false;
var kdangle = [];
var repangle = [];
var pass = [];
var kd = [];
var count = 0;
var defaultreps = 0;
var defaultsets = 0;
var sessionTime = Date.now();
var finished = false;
var stat = [];

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else
    var exercises = {};

if(localStorage.hasOwnProperty("settings"))
    var settings = JSON.parse(localStorage.settings);
else
{
    var settings = {};
    settings['routines'] = {};
}

if(localStorage.hasOwnProperty("stats"))
    var stats = JSON.parse(localStorage.stats);
else
    var stats = {};

function findGetParameter(parameterName) {
    var result = null, tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName)
            result = decodeURIComponent(tmp[1]);
    });
    return result;
}
var rotkey = findGetParameter('rot')

if(rotkey in settings['routines'])
{
  delayBtn.value = settings['routines'][rotkey][0];
  resetCheck.checked = settings['routines'][rotkey][1];
  resetExCheck.checked = settings['routines'][rotkey][2];
}

delayBtn.onchange = function(){ settingsChange(); };
resetCheck.onchange = function(){ settingsChange(); };
resetExCheck.onchange = function(){ settingsChange(); };

function nextEx()
{
    var localrot = JSON.parse(localStorage.routines);
    var routine = localrot[rotkey];
    if(routine != undefined)
      var item = routine[count];
    if(item != undefined && !(item[0] in exercises))
      routine.splice(routine.indexOf(item), 1);
    if(routine == undefined || count >= routine.length)
    {
      var time = Math.round((Date.now()-sessionTime)/1000);
      var hours = Math.floor(time/3600);
      var minutes = Math.floor(time/60)-(hours*60);
      var seconds = time%60;
      if(seconds < 10)
        seconds = '0' + seconds;
      if(hours < 10)
        hours = '0' + hours;
      if(minutes < 10)
        minutes = '0' + minutes;
      document.getElementById('sessionTime').textContent = "Session Time: " + hours + ":" + minutes + ":" + seconds;

      var today = new Date();
      var m = String(today.getMinutes()).padStart(2, '0');
      var hh = String(today.getHours()).padStart(2, '0');
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy + ' - ' + hh + ":" + m;
      stats[today] = [rotkey, stat, time];
      localStorage.stats = JSON.stringify(stats);

      openTheForm();
      return;
    }
    kdangle = [];
    repangle = [];
    pass = [];
    kd = [];
    ids = [];
    if(item[0] in exercises)
    {
      for(var a = 1; a < exercises[item[0]].length; a++)
      {
        ids.push(exercises[item[0]][a][0]);
        kd.push(false);
        var diff = Math.abs(exercises[item[0]][a][1]-exercises[item[0]][a][2])/3;
        var firstAngle = exercises[item[0]][a][3];
        if(Math.abs(exercises[item[0]][a][1]-firstAngle) > Math.abs(exercises[item[0]][a][2]-firstAngle))
        {
          repangle.push(exercises[item[0]][a][1]-diff);
          kdangle.push(exercises[item[0]][a][2]+diff);
        }
        else 
        {
          repangle.push(exercises[item[0]][a][2]+diff);
          kdangle.push(exercises[item[0]][a][1]-diff);
        }
        pass.push(false);
      }
      rotName.textContent = rotkey;
      exName.textContent = item[0];
      sets.textContent = item[1];
      reps.textContent = item[2];
      separate = exercises[item[0]][0];
      defaultsets = item[1];
      defaultreps = item[2];

      stat.push([item[0], 0]);
    }
    if(resetExCheck.checked)
    {
      startBtn.textContent = 'Start';
      startBtn.style.backgroundColor = 'rgb(53, 156, 53)';
      counting = false;
      dropdown = false;
    }
    localrot[rotkey] = routine;
    localStorage.routines = JSON.stringify(localrot);
}

cameraOptions.addEventListener("change", function(){ cameraSelect(); } );

window.addEventListener("resize", (e) => {
  canvasElement.width = videoElement.offsetWidth;
  canvasElement.height = videoElement.offsetHeight;
}, false);

function startPress()
{
  if(!counting)
  {
    dropdown = true;
    startDelayTime = Date.now();
    setTimeout(function(){ counting = true; dropdown = false; startBtn.textContent = 'Stop'; startBtn.style.backgroundColor = 'rgb(163, 64, 64)';}, parseFloat(delayBtn.value)*1000);
  }
  else
  {
    startBtn.textContent = 'Start';
    startBtn.style.backgroundColor = 'rgb(53, 156, 53)';
    counting = false;
  }
}
function setPress()
{
  reps.textContent = defaultreps;
  stat[stat.length-1][1] = (defaultsets-sets.textContent)*defaultreps;
}
function exPress()
{
  sets.textContent = defaultsets;
  reps.textContent = defaultreps;
  stat[stat.length-1][1] = 0;
}
function skipPress()
{
  count++;
  nextEx();
}
function skipSetPress()
{
  sets.textContent = parseInt(sets.textContent)-1;
  reps.textContent = defaultreps;
  if(sets.textContent == 0)
  {
    count++;
    nextEx();
  }
}
function settingsChange()
{
  settings['routines'][rotkey] = [delayBtn.value,resetCheck.checked,resetExCheck.checked];
  localStorage.settings = JSON.stringify(settings);
}
function openTheForm() {
  document.getElementById("popupForm").style.display = "block";
  document.getElementsByClassName("overlay")[0].style.display = "block";
  finished = true;
}
function closeTheForm() {
  window.location.href = './routines.html';
}

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  showLandmarks = [];
  showConnections = [];
  landmarksPosition = {};
  for(var a = 0; a < ids.length; a++)
  {
    var id = ids[a];
    if(counting && !finished)
    {
      var x1 = results.poseLandmarks[id[0]].x, y1 = results.poseLandmarks[id[0]].y, z1 = results.poseLandmarks[id[0]].z;
      var x2 = results.poseLandmarks[id[1]].x, y2 = results.poseLandmarks[id[1]].y, z2 = results.poseLandmarks[id[1]].z;
      var x3 = results.poseLandmarks[id[2]].x, y3 = results.poseLandmarks[id[2]].y, z3 = results.poseLandmarks[id[2]].z;
      var angle = (Math.atan2(y3-y2, x3-x2)-Math.atan2(y1-y2,x1-x2)) * (180/Math.PI);
      if(angle < 0)
        angle += 360;
      if(angle > 180)
        angle = 360-angle;
      if(angle < 30)
        angle = 30;
      //console.log(angle,parseInt(rangles[a][0]),parseInt(rangles[a][1]));
      if(kdangle[a] > repangle[a])
      {
        if(angle <= repangle[a] && kd[a])
          pass[a] = true;
        else
          pass[a] = false;
        if(angle >= kdangle[a])
          kd[a] = true;
      }
      else 
      {
        if(angle >= repangle[a] && kd[a])
          pass[a] = true;
        else
          pass[a] = false;
        if(angle <= kdangle[a])
          kd[a] = true;
      }
      //canvasCtx.fillText(angle.toString(), x2*canvasElement.clientWidth - 50, y2*canvasElement.clientHeight + 20);
    }
    for(var b = 0; b < 3; b++)
    {
      if(showLandmarks.includes(results.poseLandmarks[id[b]]) == false)
      {
        showLandmarks.push(results.poseLandmarks[id[b]]);
        landmarksPosition[id[b]] = showLandmarks.length-1;
      }
    }
    showConnections.push([landmarksPosition[id[0]], landmarksPosition[id[1]]]);
    showConnections.push([landmarksPosition[id[1]], landmarksPosition[id[2]]]);
  }
  var totalpass = false;
  if(separate && pass.includes(true))
    totalpass = true;
  else if(!separate && !pass.includes(false))
    totalpass = true;
  if(counting && totalpass)
  {
    reps.textContent = parseInt(reps.textContent)-1;
    if(reps.textContent == 0)
    {
      sets.textContent = parseInt(sets.textContent)-1;
      reps.textContent = defaultreps;
      if(resetCheck.checked)
      {
        startBtn.textContent = 'Start';
        startBtn.style.backgroundColor = 'rgb(53, 156, 53)';
        counting = false;
      }
    }
    stat[stat.length-1][1] += 1;
    if(sets.textContent == 0)
    {
      count++;
      nextEx();
    }
    for(var i = 0; i < pass.length; i++)
    {
      pass[i] = false;
      kd[i] = false;
    }
  }
  if(dropdown)
  {
    canvasCtx.font = '100px sans-serif';
    delayTime = Math.round(delayBtn.value-(Date.now()-startDelayTime)/1000);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillText(delayTime.toString(),canvasElement.width/2,canvasElement.height/2,100);
  }
  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, showLandmarks, showConnections,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, showLandmarks,
                {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();
}
const getCameraSelection = async () => {
  await navigator.mediaDevices.getUserMedia({audio: true, video: true});   
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
  constraints['deviceId'] = { exact: cameraOptions.value };
  start(constraints);
};
function cameraSelect()
{
  constraints['deviceId'] = { exact: cameraOptions.value };
  start(constraints);
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

async function start(constraints)
{
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: constraints})
      .then(function (stream) {
        videoElement.srcObject = stream;
        update();
      })
      .catch(function (err) {
        console.log(err);
    });
  }
}
async function update() {
  if(videoElement.readyState >= 3)
    await pose.send({image: videoElement});
  requestAnimationFrame(update);
}
getCameraSelection();

canvasElement.width = videoElement.offsetWidth;
canvasElement.height = videoElement.offsetHeight;
nextEx();