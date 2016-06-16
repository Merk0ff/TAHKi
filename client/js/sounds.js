var ctx;
var mainVolume;
var shoot_sound = {};
function SoundInit(Path) {
// Detect if the audio context is supported.
    window.AudioContext = (
        window.AudioContext ||
        window.webkitAudioContext ||
        null
    );

    if (!AudioContext) {
        throw new Error("AudioContext not supported!");
    }

// Create a new audio context.
    ctx = new AudioContext();

// Create a AudioGainNode to control the main volume.
    mainVolume = ctx.createGain();
// Connect the main volume node to the context destination.
    mainVolume.connect(ctx.destination);

// Load a sound file using an ArrayBuffer XMLHttpRequest.
    var request = new XMLHttpRequest();
    request.open("GET", Path, true);
    request.responseType = "arraybuffer";
    request.onload = function (e) {

        // Create a buffer from the response ArrayBuffer.
        ctx.decodeAudioData(this.response, function onSuccess(buffer) {
            shoot_sound = buffer;
        }, function onFailure() {
            alert("Decoding the audio buffer failed");
        });
    };
    request.send();

};

function Sound(objectMatrix) {

// Create an object with a sound source and a volume control.
    this.source = ctx.createBufferSource();
    this.volume = ctx.createGain();

// Connect the sound source to the volume control.
    this.source.connect(this.volume);

    this.panner = ctx.createPanner();
// Instead of hooking up the volume to the main volume, hook it up to the panner.
    this.volume.connect(this.panner);
// And hook up the panner to the main volume.
    this.panner.connect(mainVolume);

// Make the sound source loop.
    this.source.loop = false;

    // Make the sound source use the buffer and start playing it.
    this.source.buffer = this.buffer = shoot_sound;


    var p = new THREE.Vector3();
    p.setFromMatrixPosition(objectMatrix);
    this.panner.setPosition(p.x, p.y, p.z);
    camera.updateMatrixWorld();
    var c = new THREE.Vector3();
    c.setFromMatrixPosition(camera.matrixWorld);

// And copy the position over to the listener.
    ctx.listener.setPosition(c.x, c.y, c.z);
    
    this.source.start(ctx.currentTime);
};

/*
Sound.prototype.SetPosition = function(objectMatrix)
{
};
*/