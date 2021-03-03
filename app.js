var fs = require('fs');
const { ipcRenderer } = require('electron');

var audio = new Audio('assets/sounds/click.mp3');
var video = document.getElementById('camera')
var flash = document.getElementById('flash')
var url = ""

navigator.mediaDevices.getUserMedia({video: true})
.then(function(stream){
  video.srcObject = stream;
}).catch((err)=>{
  console.log(err)
});

document.getElementById("click").addEventListener("click", ()=>{
  take_img().then(download)
})


function take_img(){
  audio.play()
  flash.classList.add('active')
  setTimeout(() => {
    flash.classList.remove('active')
  }, 500);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0,0);
  return new Promise((res, rej)=>{
    canvas.toBlob(res);
  });
}

function download(blob){
  const reader = new FileReader();
  reader.onloadend=()=>{
    var name = "Image"
    var int = 0
    var filenames = []
    if(fs.existsSync(url+'/'+name+'.png')){
      fs.readdirSync(url).forEach((file)=>{
        file = file.slice(0, -4)
        filenames.push(file)
      });
      int = parseInt(filenames[filenames.length - 1].slice(-1))
      if(int>0){int+=1}
      else{int = 1}
      name+=int
    }
    fs.writeFile(url+'/'+name+'.png', new Uint8Array(reader.result), ()=>{});
  }
  reader.readAsArrayBuffer(blob);
}
ipcRenderer.send("pics_dir_init")
ipcRenderer.on("pics_dir", function(e, item){
  url = item.split('\\').join('/') + '/Camera'

  if(!fs.existsSync(url)){
    fs.mkdirSync(url);
  }
})