function renderScene() {
    stats.begin();
    Update();
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
    stats.end();
}