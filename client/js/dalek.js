/* Constructor of 'Dalek' */
function Dalek(type) {
    this.Speed = 1.0;
    this.Look = new THREE.Vector3(0, 0, this.Speed);
    this.RelativeCam = new THREE.Vector3(0, 0, 0);
    this.Light = new THREE.SpotLight(0xff0000, 1, 300, 0.8, 0.8);
    this.Light.position.set(1, 1, 1);
    this.Light.castShadow = true;
    this.Light.shadow.mapSize.width = 1024;
    this.Light.shadow.mapSize.height = 1024;
    this.LightTarget = new THREE.Object3D();
    this.LightTarget.position = new THREE.Vector3(0, 0, 0);
    this.Light.target = this.LightTarget;
    this.LightHelper = new THREE.SpotLightHelper(this.Light);
    if (type == "red")
        this.Model = model_red.clone();
    else if (type == "blue")
        this.Model = model_blue.clone();
    scene.add(this.Model);
    scene.add(this.Light);
    scene.add(this.LightTarget);
    //scene.add(this.LightHelper);
}

Dalek.prototype.SetPosition = function (new_position) {
    this.Model.position.x = new_position.x;
    this.Model.position.z = new_position.y;
};

Dalek.prototype.GetPosition = function () {
    return VecSet2(this.Model.position.x, this.Model.position.z);
};

Dalek.prototype.SetCamera = function () {
    switch (CameraMode) {
        case 0:
            this.RelativeCam.x = -this.Look.x;
            this.RelativeCam.z = -this.Look.z;
            this.RelativeCam.y = CamAY;
            this.RelativeCam.multiplyScalar(CamL);
            camera.position.copy(this.Model.position.clone().add(this.RelativeCam));
            camera.lookAt(this.Model.position.clone().add(new THREE.Vector3(0, 10, 0)));
            break;
        case 1:
            this.RelativeCam.x = this.Look.x * 0.2;
            this.RelativeCam.z = this.Look.z * 0.2;
            this.RelativeCam.y = 18;
            //this.RelativeCam.multiplyScalar(CamL);
            camera.position.copy(this.Model.position.clone().add(this.RelativeCam));
            camera.lookAt(camera.position.clone().add(this.Look));
            break;
    }
};

Dalek.prototype.Rotate = function (angle) {
    this.Model.rotation.y += angle;
    this.Look.x = this.Speed * Math.sin(this.Model.rotation.y);
    this.Look.z = this.Speed * Math.cos(this.Model.rotation.y);
};


Dalek.prototype.SetRotate = function (angle) {
    this.Model.rotation.y = angle;
    this.Look.x = this.Speed * Math.sin(this.Model.rotation.y);
    this.Look.z = this.Speed * Math.cos(this.Model.rotation.y);
};

Dalek.prototype.Update = function () {
    this.Light.position.copy(this.Model.position.clone().add(new THREE.Vector3(this.Look.x * 9, 17, 9 * this.Look.z)));
    this.LightTarget.position.copy(this.Light.position.clone().add(this.Look));
    this.LightHelper.update();
};

Dalek.prototype.SetLight = function (state) {
    this.Light.visible = state;
};

Dalek.prototype.ToggleLight = function () {
    this.Light.visible = !this.Light.visible;
    mydata.light = this.Light.visible;
    socket.emit("SwichLight", mydata);
};

/* Funcitons */
Dalek.prototype.Move = function () {
    var Newposition = this.Model.position.clone().add(this.Look);
    if (DetectCollision(collision_map, 5, Newposition.x, this.Model.position.z))
        this.Model.position.x += this.Look.x;
    if (DetectCollision(collision_map, 5, this.Model.position.x, Newposition.z))
        this.Model.position.z += this.Look.z;
    $("#debug").html("X:" + this.Model.position.x + "<br/>Z:" + this.Model.position.z);
};
