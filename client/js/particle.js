var particles = [];
function AddParticle(position, look, lifetime) {
    particles.push(new Particle("blue", position.clone(), look.clone(), lifetime));
}

function UpdatePatricles() {
    particles.forEach(function(part, i, array) {
        part.Update();
        if (part.dead) {
            scene.remove(part.particleSystem);
            delete particles[i];
        }
    });
}

function Particle(type, position, look, lifetime) {
    this.time = 0;
    this.dead = false;
    this.lifetime = lifetime * 50;
    this.particleCount = 30;
    this.particles = new THREE.Geometry();
    this.directions = [];
    var loader = new THREE.TextureLoader();
    var pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 3.0,
        map: loader.load(
            "./resources/textures/particles/" + type + "_particle.jpg"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    for (var i = 0; i < this.particleCount; i++) {
        this.directions.push(VecSet3(
            look.x * 2,// + Math.random() - 0.5,
            look.y * 2,// + Math.random() - 0.5,
            look.z * 2// + Math.random() - 0.5
        ));
        var particle = new THREE.Vector3(
            position.x + look.x * (i / 3 + 5),// + Math.random() * 0.05 - 0.025,
            position.y + look.y + 17.5,// + Math.random() * 0.05 - 0.025 + 18,
            position.z + look.z * (i / 3 + 5));// + Math.random() * 0.05 - 0.025);

        this.particles.vertices.push(particle);
    }

    this.particleSystem = new THREE.Points(
        this.particles,
        pMaterial);

    this.particleSystem.sortParticles = true;

    scene.add(this.particleSystem);
};

Particle.prototype.Update = function () {
    for (var i = 0; i < this.particleCount; i++)
        this.particles.vertices[i].add(this.directions[i].clone());
    this.particleSystem.geometry.verticesNeedUpdate = true;
    this.particleSystem.sortParticles = true;
    if (this.time++ >= this.lifetime)
        this.dead = true;
};