function renderScene() {
    requestAnimationFrame(renderScene);
    step += 0.04;
    light.position.x = -30 * Math.sin(step);
    light.position.z = 30 * Math.cos(step);
    light.lookAt(scene.position);
    renderer.render(scene, camera);
}