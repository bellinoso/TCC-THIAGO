var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

function showAxis(scene, parent) {

    size = 50

    var makeCylinder = function(name, color, rotation, position) {
        var cylinder = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: size,
            diameter: size * 0.04
        }, scene);
        var material = new BABYLON.StandardMaterial(name + "Mat", scene);
        material.diffuseColor = color;
        cylinder.material = material;
        cylinder.rotation = rotation;
        cylinder.position = position;
        cylinder.parent = parent;

        cylinder.isVisible = false; // Definir o cilindro como invisível
        return cylinder;
    };

    // Eixo X
    var axisX = makeCylinder("axisX", new BABYLON.Color3(1, 0, 0), 
        new BABYLON.Vector3(0, 0, Math.PI / 2), 
        new BABYLON.Vector3(size / 2, 0, 0));

    // Eixo Y
    var axisY = makeCylinder("axisY", new BABYLON.Color3(0, 1, 0), 
        new BABYLON.Vector3(0, 0, 0), 
        new BABYLON.Vector3(0, size / 2, 0));

    // Eixo Z
    var axisZ = makeCylinder("axisZ", new BABYLON.Color3(0, 0, 1), 
        new BABYLON.Vector3(Math.PI / 2, 0, 0), 
        new BABYLON.Vector3(0, 0, size / 2));

    // Retornar os eixos para controle de visibilidade
    return [axisX, axisY, axisZ];

}

function toggleAxisVisibility(axes, visible) {
    axes.forEach(function(axis) {
        axis.isVisible = visible;
    });
}

function toggleTransparency(importedMeshes,transparent) {
    importedMeshes.forEach(function(mesh) {
        if (transparent) {
            mesh.material.alpha = 0.7;
        }
        else {
            mesh.material.alpha = 1;
        }
    });
}

var importedMeshes = [];

function toggleModelsVisibility(importedMeshes,visible) {
    importedMeshes.forEach(function(mesh) {
        mesh.isVisible = visible;
    });
}

function normalizeAngle(angle) {
    let normalizedAngle = BABYLON.Tools.ToDegrees(angle) % 360;
    if (normalizedAngle < 0) {
      normalizedAngle += 360;
    }
    return normalizedAngle;
  }