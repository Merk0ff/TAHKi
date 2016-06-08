function fopen(FileName)
{
    var str = "";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', FileName, false);
    xhr.send();
    str = xhr.responseText;
    return str;
}


function LoadModel(path, name)
{
    var manager = new THREE.LoadingManager();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( path );
    mtlLoader.load( name + ".mtl", function( materials ) {
        materials.preload();
        var loader = new THREE.OBJLoader( manager );
        loader.setMaterials(materials);
        loader.setPath( path );
        loader.load(  name + ".obj", function ( object ) {
            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                }
            } );
            scene.add( object );
        } );
    });
}
