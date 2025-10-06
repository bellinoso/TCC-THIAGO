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

    var axesViewer = new BABYLON.Debug.AxesViewer(scene, 100);
    if (parent) {
        axesViewer.xAxis.parent = parent;
        axesViewer.yAxis.parent = parent;
        axesViewer.zAxis.parent = parent;
    }
    return axesViewer;

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


function printMatrixToDataTab(mesh) {
    const matrix = mesh.getWorldMatrix().toArray();
    // Transpor a matriz 4x4
    let transposed = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            transposed[i * 4 + j] = matrix[j * 4 + i];
        }
    }
    let html = '<table border="1" style="border-collapse:collapse;text-align:center;">';
    for (let i = 0; i < 4; i++) {
        html += '<tr>';
        for (let j = 0; j < 4; j++) {
            html += `<td>${transposed[i * 4 + j].toFixed(2)}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    document.querySelector('#tab-data').innerHTML = `
        <div style="padding:20px;">
            <b>Matriz de transformação global:</b><br><br>
            ${html}
        </div>
    `;
}
