window.addEventListener('DOMContentLoaded', function() {
    // All the following code is entered here.

    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);


    var createScene = function() {
        var scene = new BABYLON.Scene(engine);

        //scene.clearColor = new BABYLON.Color3.White();

        /*var box = BABYLON.Mesh.CreateBox("Box", 2.0, scene);
        //var box2 = BABYLON.Mesh.CreateBox("Box2", 4.0, scene);

        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.keysUp.push(90);
        camera.keysDown.push(83);
        camera.keysRight.push(68);
        camera.keysLeft.push(81);

        camera.acceleration = 0.0005;
        camera.speed = 2;*/

        /*var rotateCamera = new BABYLON.ArcRotateCamera("arcCam",
            BABYLON.Tools.ToRadians(45),
            BABYLON.Tools.ToRadians(45),
            20.0, box.position, scene);
        rotateCamera.attachControl(canvas, true);
        rotateCamera.keysUp.push(38);
        rotateCamera.keysDown.push(40);
        rotateCamera.keysRight.push(39);
        rotateCamera.keysLeft.push(37);*/

        BABYLON.SceneLoader.Append("scenes/", "scene.gltf", scene, function(scene) {
            // Create a default arc rotate camera and light.
            scene.createDefaultCameraOrLight(true, true, true);

            // The default camera looks at the back of the asset.
            // Rotate the camera by 180 degrees to the front of the asset.
            scene.activeCamera.alpha += Math.PI;
        });

        return scene;
    }

    var scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });
});