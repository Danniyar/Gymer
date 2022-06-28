const videoElement = document.getElementsByClassName('input_video')[0];
const cameraOptions = document.querySelector('.video-options>select');
const container = document.getElementsByClassName('container')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const exName = document.getElementById('exercise');
const reps = document.getElementById('reps');
const sets = document.getElementById('sets');
const delayBtn = document.getElementById('delay');
const startBtn = document.getElementById('pauseBtn');
var constraints = { width: 1280, height: 720, frameRate: { min: 30 } };
var ids = [];
var counting = false;
var dropdown = false;
var rangles = [];
var prevAngle = [];
var kd = []
var count = 0;
var defaultreps = 0;

if(localStorage.hasOwnProperty("exercises"))
    var exercises = JSON.parse(localStorage.exercises);
else 
    var exercises = {};
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
function nextEx()
{
    var localrot = JSON.parse(localStorage.routines);
    var routine = localrot[rotkey];
    var item = routine[count];
    if(item[0] in exercises)
    {
      for(var a = 0; a < exercises[item[0]].length; a++)
      {
        ids.push(exercises[item[0]][a][0]);
        prevAngle.push(1000);
        kd.push(false);
        rangles.push([exercises[item[0]][a][1]-30,exercises[item[0]][a][2]+30])
      }
      exName.textContent = item[0];
      sets.textContent = item[1];
      reps.textContent = item[2];
      defaultreps = item[2];
    }
    else 
      routine.splice(routine.indexOf(item), 1);
    startBtn.textContent = 'Start';
    counting = false;
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
    setTimeout(function(){ counting = true; dropdown = false; startBtn.textContent = 'Stop'; }, parseFloat(delayBtn.value)*1000);
  }
  else
  {
    startBtn.textContent = 'Start';
    counting = false;
  }
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
    if(counting)
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
      var pass = false;
      console.log(angle,parseInt(rangles[a][0]),parseInt(rangles[a][1]));
      if(angle < prevAngle[a])
      {
          if(parseInt(prevAngle[a]) >= parseInt(rangles[a][0]) && kd[a])
          {
            pass = true;
            kd[a] = false;
          }
          else if(parseInt(angle) <= parseInt(rangles[a][1]))
          {
            kd[a] = true;
            pass = false;
          }
      } 
      prevAngle[a] = angle;
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
    showConnections.push([landmarksPosition[id[0]],landmarksPosition[id[1]]]);
    showConnections.push([landmarksPosition[id[1]],landmarksPosition[id[2]]]);
  }
  if(counting && pass)
  {
    reps.textContent = parseInt(reps.textContent)-1;
    if(reps.textContent == 0)
    {
      sets.textContent = parseInt(sets.textContent)-1;
      reps.textContent = defaultreps;
      startBtn.textContent = 'Start';
      counting = false;
    }
    if(sets.textContent == 0)
    {
      count++;
      nextEx();
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