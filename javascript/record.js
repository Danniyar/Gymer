document.getElementById("right_hip").addEventListener('click', function() { joint_clicked(document.getElementById("right_hip"),[12,24,26]); }, false);
document.getElementById("left_hip").addEventListener('click', function() { joint_clicked(document.getElementById("left_hip"),[11,23,25]); }, false);
document.getElementById("right_shoulder").addEventListener('click', function() { joint_clicked(document.getElementById("right_shoulder"),[14,12,24]); }, false);
document.getElementById("left_shoulder").addEventListener('click', function() { joint_clicked(document.getElementById("left_shoulder"),[13,11,23]); }, false);
document.getElementById("right_forearm").addEventListener('click', function() { joint_clicked(document.getElementById("right_forearm"),[12,14,16]); }, false);
document.getElementById("left_forearm").addEventListener('click', function() { joint_clicked(document.getElementById("left_forearm"),[11,13,15]); }, false);
document.getElementById("right_knee").addEventListener('click', function() { joint_clicked(document.getElementById("right_knee"),[24,26,28]); }, false);
document.getElementById("left_knee").addEventListener('click', function() { joint_clicked(document.getElementById("left_knee"),[23,25,27]); }, false);

const videoElement = document.getElementsByClassName('input_video')[0];
const cameraOptions = document.querySelector('.video-options>select');
const container = document.getElementsByClassName('container')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const recBtn = document.getElementById('recBtn');
const delayBtn = document.getElementById('delay');
const lengthBtn = document.getElementById('length');
const exName = document.getElementById('exname');
const datatoast = document.getElementById('datasnackbar');
const nametoast = document.getElementById('namesnackbar');
var constraints = { width: 1280, height: 720, frameRate: { min: 30 } };
var ids = [];
var recording = false;
var counting = false;
var running = false;
var startTime = Math.floor(Date.now()/100);
var prevTime = Math.floor(Date.now()/100);
var data = {};
var startDelayTime = Date.now;
var delayTime = '';

if(localStorage.hasOwnProperty("settings"))
    var settings = JSON.parse(localStorage.settings);
else
    var settings = {};

if('record' in settings)
{
  delayBtn.value = settings['record'][0];
  lengthBtn.value = settings['record'][1];
}

function findGetParameter(parameterName) {
    var result = null, tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName)
            result = decodeURIComponent(tmp[1]);
    });
    return result;
}
var exkey = findGetParameter('ex')
if(exkey != null)
  exName.value = exkey;

delayBtn.onchange = function(){ settingsChange(); };
lengthBtn.onchange = function(){ settingsChange(); };

cameraOptions.addEventListener("change", function(){ cameraSelect(); } );

window.addEventListener("resize", (e) => {
  canvasElement.width = videoElement.offsetWidth;
  canvasElement.height = videoElement.offsetHeight;
}, false);

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  curTime = Math.floor(Date.now()/100)-startTime;
  showLandmarks = [];
  showConnections = [];
  landmarksPosition = {};
  for(var a = 0; a < ids.length; a++)
  {
    var id = ids[a];
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
    if((id[1] in data) == false)
      data[id[1]] = [];
    if(curTime != prevTime)
      data[id[1]].push([curTime*0.1,angle]);
    //canvasCtx.fillText(angle.toString(), x2*canvasElement.clientWidth - 50, y2*canvasElement.clientHeight + 20);
    for(var b = 0; b < 3; b++)
    {
      if(showLandmarks.includes(results.poseLandmarks[id[b]]) == false)
      {
        showLandmarks.push(results.poseLandmarks[id[b]]);
        landmarksPosition[id[b]] = showLandmarks.length-1;
        showLandmarks[landmarksPosition[id[b]]].x = 1-showLandmarks[landmarksPosition[id[b]]].x;
      }
    }
    showConnections.push([landmarksPosition[id[0]],landmarksPosition[id[1]]]);
    showConnections.push([landmarksPosition[id[1]],landmarksPosition[id[2]]]);
  }
  if(counting)
  {
    canvasCtx.font = '100px sans-serif';
    delayTime = Math.round(delayBtn.value-(Date.now()-startDelayTime)/1000);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillText(delayTime.toString(),canvasElement.width/2,canvasElement.height/2,100);
  }
  else if(recording)
  {
    canvasCtx.fillStyle = "lime";
    canvasCtx.fillText((curTime/10).toString(),canvasElement.width/2-40,canvasElement.height/2,1000);
  }
  if(curTime >= parseFloat(lengthBtn.value)*10 && recording)
    stopRec();
  prevTime = startTime;
  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, showLandmarks, showConnections,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, showLandmarks,
                {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();
}
function settingsChange()
{
  settings['record'] = [delayBtn.value, lengthBtn.value];
  localStorage.settings = JSON.stringify(settings);
}
function recPress()
{
  if(!recording)
  {
    counting = true;
    startDelayTime = Date.now();
    setTimeout(function(){ startRec(); }, parseFloat(delayBtn.value)*1000);
  }
  else if(Math.floor(Date.now()/100)-startTime >= 10)
    stopRec();
}
function startRec()
{
  counting = false;
  recording = true;
  recBtn.textContent = "Stop";
  recBtn.style.backgroundColor = 'rgb(163, 64, 64)';
  startTime = Math.floor(Date.now()/100);
  prevTime = Math.floor(Date.now()/100);
  data = {};
}
function stopRec()
{
  recBtn.textContent = "Record";
  recBtn.style.backgroundColor = 'rgb(53, 156, 53)';
  recording = false;
}
function addRec()
{
  var ex = [];
  if(Object.keys(data).length == 0)
  {
    datatoast.className = "show";
    setTimeout(function(){ datatoast.className = datatoast.className.replace("show", ""); }, 3000);
    return;
  }
  if(exName.value == '')
  {
    nametoast.className = "show";
    setTimeout(function(){ nametoast.className = nametoast.className.replace("show", ""); }, 3000);
    return;
  }
  ex.push(false);
  for(var a = 0; a < ids.length; a++)
  {
    rec = data[ids[a][1]];
    var firstAngle = rec[0][1];
    rec.sort(function(a, b) { return a[1] - b[1]; });
    var maxDeg = rec[rec.length-1][1];
    var minDeg = rec[0][1];
    ex.push([ids[a], maxDeg, minDeg, firstAngle]);
  }
  if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
  else 
    var exercises = {};
  exercises[exName.value] = ex;
  localStorage.exercises = JSON.stringify(exercises);
  window.location.href = './exercises.html';
}
function joint_clicked(btn, id)
{
  if(btn.textContent == "+" && !recording)
  {
    btn.style.background = "rgb(53, 156, 53)";
    btn.textContent = "-";
    ids.push(id);
  }
  else if(!recording)
  {
    btn.style.background = "rgb(163, 64, 64)";
    btn.textContent = "+";
    ids = ids.filter(function(e) { return e[1] !== id[1] });
  }
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