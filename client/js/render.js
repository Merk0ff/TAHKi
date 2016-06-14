function renderScene() {
    stats.begin();
    Update();
    UpdateKeyboard();
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
    stats.end();
}