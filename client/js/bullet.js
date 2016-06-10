function Bullet(position, direction)
{
    this.direction = VecSet3(direction.x, 0, direction.y);
    this.Model = model_bull.clone();
    this.Model.position.x = position.x;
    this.Model.position.z = position.y;
    this.Light = new THREE.PointLight(0xff0000, 2, 30);
    this.Light.position.copy(this.Model.position);
    scene.add(this.Light);
    scene.add(this.Model);
};

Bullet.prototype.Update = function()
{
    this.Model.position.add(this.direction);
    this.Light.position.copy(this.Model.position);
};

Bullet.prototype.IsAlive = function()
{
    return DetectSimpleCollision(collision_map, this.Model.position.x, this.Model.position.z);
};

Bullet.prototype.Destroy = function()
{
    scene.remove(this.Model);
    scene.remove(this.Light);
};

function BulletLaunch(position, direction)
{
    EntityAdd(new Bullet(position, direction));
}
