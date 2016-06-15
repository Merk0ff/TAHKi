var particles = [];
function AddParticle(position, look, lifetime) {
    var i = 0;
    while (particles[i] != undefined)
        i++;
    particles[i] = new Particle("blue", position, look, lifetime);
}

function UpdatePatricles() {
    for (var i = 0; i < particles.length; i++) {
        if (particles[i] != undefined) {
            particles[i].Update();
            if (particles[i].dead)
                delete particles[i];
        }
    }
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
        size: 2,
        map: loader.load(
            "./resources/textures/particles/" + type + "_particle.jpg"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    for (var i = 0; i < this.particleCount; i++) {
        this.directions.push(VecSet3(
            look.x * 2 + Math.random() / 100 - 0.005,
            look.y * 2 + Math.random() / 100 - 0.005,
            look.z * 2 + Math.random() / 100 - 0.005
        ));
        var particle = new THREE.Vector3(
            position.x + look.x + Math.random() * 0.05 - 0.025,
            position.y + look.x + Math.random() * 0.05 - 0.025 + 18,
            position.z + look.z + Math.random() * 0.05 - 0.025);

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
    if (this.time++ >= this.lifetime)
        this.dead = true;
};