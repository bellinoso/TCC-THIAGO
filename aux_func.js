function ajustarAngulo(angulo) {
    return ((angulo % 360) + 360) % 360;
}

// Função para criar um slider com um campo de texto
function createSliderWithText(min, max, initialValue, onChange, labelText) {
    var container = new BABYLON.GUI.StackPanel();
    container.isVertical = true;
    container.height = "50px";
    container.width = "220px";

    var label = new BABYLON.GUI.TextBlock();
    label.text = labelText;
    label.height = "20px";
    label.color = "white";
    label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    container.addControl(label);

    var sliderContainer = new BABYLON.GUI.StackPanel();
    sliderContainer.isVertical = false;
    sliderContainer.height = "30px";
    sliderContainer.width = "220px";

    var slider = new BABYLON.GUI.Slider();
    slider.minimum = min;
    slider.maximum = max;
    slider.value = initialValue;
    slider.height = "20px";
    slider.width = "150px";
    slider.color = "white";
    slider.background = "gray";
    slider.onValueChangedObservable.add(function (value) {
        inputText.text = value.toFixed(2);
        onChange(value);
    });

    var inputText = new BABYLON.GUI.InputText();
    inputText.width = "60px"; // Aumentando a largura da caixa de texto
    inputText.text = initialValue.toFixed(2);
    inputText.color = "white";
    inputText.background = "gray";
    inputText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    inputText.onBlurObservable.add(function () {
        var value = parseFloat(inputText.text);
        if (!isNaN(value) && value >= min && value <= max) {
            slider.value = value;
            onChange(value);
        } else {
            inputText.text = slider.value.toFixed(2);
        }
    });

    sliderContainer.addControl(slider);
    sliderContainer.addControl(inputText);
    container.addControl(sliderContainer);

    return container;
}

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

function showAxis(scene, parent) {

    // size = 200

    // var makeCylinder = function(name, color, rotation, position) {
    //     var cylinder = BABYLON.MeshBuilder.CreateCylinder(name, {
    //         height: size,
    //         diameter: size * 0.04
    //     }, scene);
    //     var material = new BABYLON.StandardMaterial(name + "Mat", scene);
    //     material.diffuseColor = color;
    //     cylinder.material = material;
    //     cylinder.rotation = rotation;
    //     cylinder.position = position;
    //     cylinder.parent = parent;

    //     cylinder.isVisible = false; // Definir o cilindro como invisível
    //     return cylinder;
    // };

    // // Eixo X
    // var axisX = makeCylinder("axisX", new BABYLON.Color3(1, 0, 0), 
    //     new BABYLON.Vector3(0, 0, Math.PI / 2), 
    //     new BABYLON.Vector3(size / 2, 0, 0));

    // // Eixo Y
    // var axisY = makeCylinder("axisY", new BABYLON.Color3(0, 1, 0), 
    //     new BABYLON.Vector3(0, 0, 0), 
    //     new BABYLON.Vector3(0, size / 2, 0));

    // // Eixo Z
    // var axisZ = makeCylinder("axisZ", new BABYLON.Color3(0, 0, 1), 
    //     new BABYLON.Vector3(Math.PI / 2, 0, 0), 
    //     new BABYLON.Vector3(0, 0, size / 2));

    // // Retornar os eixos para controle de visibilidade
    // return [axisX, axisY, axisZ];

    var axesViewer = new BABYLON.Debug.AxesViewer(scene, 100);
    if (parent) {
        axesViewer.xAxis.parent = parent;
        axesViewer.yAxis.parent = parent;
        axesViewer.zAxis.parent = parent;
    }
    return axesViewer;

}

// function toggleAxisVisibility(axes, visible) {
//     axes.forEach(function(axis) {
//         axis.dispose()
//     });
// }

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