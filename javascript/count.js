const videoElement = document.getElementsByClassName('input_video')[0];
const cameraOptions = document.querySelector('.video-options>select');
const container = document.getElementsByClassName('container')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const exName = document.getElementById('exercise');
const reps = document.getElementById('reps');
const sets = document.getElementById('sets');
var constraints = { width: 1280, height: 720, frameRate: { min: 30 } };
var ids = [];
var counting = true;
var prevAngle = [];
var upAngle = [];
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
        upAngle.push(0);
      }
      exName.textContent = item[0];
      sets.textContent = item[1];
      reps.textContent = item[2];
      defaultreps = item[2];
    }
    else 
      routine.splice(routine.indexOf(item), 1);
    localrot[rotkey] = routine;
    localStorage.routines = JSON.stringify(localrot);
}

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
    var pass = false;
    if(parseInt(angle) > parseInt(prevAngle[a]) && prevAngle[a] != 1000)
        upAngle[a] += angle-prevAngle[a];
    else if(angle < prevAngle[a])
    {
        if(parseInt(upAngle[a]) >= parseInt(exercises[exName.textContent][a][1])/2)
        {
          pass = true;
        }
        else 
          pass = false;
        upAngle[a] = 0;
    }
    prevAngle[a] = angle;
    //canvasCtx.fillText(angle.toString(), x2*canvasElement.clientWidth - 50, y2*canvasElement.clientHeight + 20);
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
  if(pass)
  {
    reps.textContent = parseInt(reps.textContent)-1;
    if(reps.textContent == 0)
    {
      sets.textContent = parseInt(sets.textContent)-1;
      reps.textContent = defaultreps;
    }
    if(sets.textContent == 0)
    {
      count++;
      nextEx();
    }
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