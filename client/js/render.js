function renderScene()
{
    Update();
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}