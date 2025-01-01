var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene =  function () {
    
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.2, 0.3, 0.5, 1); // RGBA values: Red, Green, Blue, Alpha
    var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(60), 500, new BABYLON.Vector3(0, 160, 0), scene);
    
    camera.lowerBetaLimit = 0.1; // Limite inferior de inclinação
    camera.upperBetaLimit = (Math.PI / 2) * 0.99; // Limite superior de inclinação
    camera.lowerRadiusLimit = 50; // Limite mínimo de zoom
    camera.upperRadiusLimit = 1000; // Limite máximo de zoom
    camera.wheelPrecision = 1; // Sensibilidade do scroll do mouse
    camera.panningSensibility = 30; // Sensibilidade de arrasto do mouse
    camera.attachControl(canvas, true); // Anexar controles ao canvas
    // camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    //desligando controles da camera do teclado
    camera.keysUp = [];
    camera.keysDown = [];
    camera.keysLeft = [];
    camera.keysRight = [];
    
    // Cria iluminação
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    // Reduzindo levemente a iluminação
    light.intensity = 0.7 ;
    
    // Adicione os eixos XYZ à cena
    var globalAxes = showAxis(scene);
    
    var importedMeshes = [];
    // Importando modelos STL
    // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Base.STL", scene, function (newMeshes) {
        BABYLON.SceneLoader.ImportMesh("", "https://drive.google.com/uc?export=download&id=11xf26LhumD7tMM-ZYkFRFHQ5nYh5GDPr", "base.STL", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = base;
        importedMesh.position.x = -60;
        importedMesh.position.y = 0;
        importedMesh.position.z = 60;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(-90);
        importedMesh.rotation.y = 0;
        importedMesh.rotation.z = 0;
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Waist.STL", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = waist;
        importedMesh.position.x = -48;
        importedMesh.position.y = -48;
        importedMesh.position.z = -40;
        importedMesh.rotation.x = 0;
        importedMesh.rotation.y = 0;
        importedMesh.rotation.z = 0;
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Arm%2001.STL", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm01;
        importedMesh.position.x = -28.5;
        importedMesh.position.y = -25.5;
        importedMesh.position.z = 0;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(-90);
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(90); 
        importedMesh.rotation.z = BABYLON.Tools.ToRadians(-90); 
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Arm%2002.STL", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm02;
        importedMesh.position.x = 25;
        importedMesh.position.y = 19.3;
        importedMesh.position.z = -13.5;
        importedMesh.rotation.x = 0; 
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(-90);
        importedMesh.rotation.z = BABYLON.Tools.ToRadians(-90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Arm%2003.STL", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm03;
        importedMesh.position.x = 11.6;
        importedMesh.position.y = 13.5;
        importedMesh.position.z = 0;
        importedMesh.rotation.x = 0;
        importedMesh.rotation.y = 0;
        importedMesh.rotation.z = BABYLON.Tools.ToRadians(180);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Gripper%20base.STL", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = grip;
        importedMesh.position.x = -14;
        importedMesh.position.y = 14;
        importedMesh.position.z = 28;
        importedMesh.rotation.x = 0;
        importedMesh.rotation.z = 0;
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); 
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });

    // Tratamento de redimensionamento da janela
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // Objetos auxiliares para posicionamento dos eixos
    var base = BABYLON.MeshBuilder.CreateBox("base", { width: 1, height: 1, depth: 1 }, scene);

    var servoWaist = BABYLON.MeshBuilder.CreateBox("servoWaist", { width: 1, height: 1, depth: 1 }, scene);
    servoWaist.rotation.x = BABYLON.Tools.ToRadians(-90)
    servoWaist.position.y = 96;
    servoWaist.parent = base;
    var servoWaistAxis = showAxis(scene,servoWaist);

    var waist = BABYLON.MeshBuilder.CreateBox("waist", { width: 1, height: 1, depth: 1 }, scene);
    waist.parent = servoWaist;
    
    var servo01 = BABYLON.MeshBuilder.CreateBox("servo01", { width: 1, height: 1, depth: 1 }, scene);
    servo01.position.y = -13.5;
    servo01.rotation.y = BABYLON.Tools.ToRadians(-90)
    servo01.rotation.z = BABYLON.Tools.ToRadians(-90)
    servo01.parent = waist;
    var servo01Axis = showAxis(scene,servo01)

    var arm01 = BABYLON.MeshBuilder.CreateBox("arm01", { width: 1, height: 1, depth: 1 }, scene);
    arm01.position.z = 3.5;
    arm01.parent = servo01;

    var servo02 = BABYLON.MeshBuilder.CreateBox("servo02", { width: 1, height: 1, depth: 1 }, scene);
    servo02.position.y = 120.3;
    servo02.position.z = 7.5;

    servo02.parent = arm01;
    var servo02Axis = showAxis(scene,servo02);

    var arm02 = BABYLON.MeshBuilder.CreateBox("arm02", { width: 1, height: 1, depth: 1 }, scene);
    arm02.rotation.z = BABYLON.Tools.ToRadians(180)  
    arm02.parent = servo02;

    var servo03 = BABYLON.MeshBuilder.CreateBox("servo03", { width: 1, height: 1, depth: 1 }, scene);
    servo03.position.x = -90;
    servo03.position.y = 5.7;
    servo03.rotation.y = BABYLON.Tools.ToRadians(-90)
    servo03.rotation.z = BABYLON.Tools.ToRadians(90)
    servo03.parent = arm02;
    var servo03Axis = showAxis(scene,servo03);

    var arm03 = BABYLON.MeshBuilder.CreateBox("arm03", { width: 1, height: 1, depth: 1 }, scene);
    arm03.parent = servo03;

    var servo04 = BABYLON.MeshBuilder.CreateBox("servo04", { width: 1, height: 1, depth: 1 }, scene);
    servo04.position.x = -4.6;
    servo04.position.y = 0;
    servo04.position.z = 28;
    servo04.rotation.x = BABYLON.Tools.ToRadians(-90)
    servo04.rotation.z = BABYLON.Tools.ToRadians(180)
    servo04.parent = arm03;
    var servo04Axis = showAxis(scene,servo04);

    var grip = BABYLON.MeshBuilder.CreateBox("grip", { width: 1, height: 1, depth: 1 }, scene);
    grip.parent = servo04;
    grip.rotation.z = BABYLON.Tools.ToRadians(180)  
    var gripAxis = showAxis(scene,grip);

    // Inicia a engine
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Controle manual pelo teclado
    var rotationSpeed = 0.03;
    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowLeft":
                waist.rotation.z -= rotationSpeed; 
                break;
            case "ArrowRight": 
                waist.rotation.z += rotationSpeed; 
                break;
            case "ArrowUp":
                arm01.rotation.z -= rotationSpeed;
                break;
            case "ArrowDown":
                arm01.rotation.z += rotationSpeed;
                break;
            case "w":
                arm02.rotation.z -= rotationSpeed;
                break;
            case "e":
                arm02.rotation.z += rotationSpeed;
                break;
            case "s":
                arm03.rotation.z -= rotationSpeed;
                break;
            case "d":
                arm03.rotation.z += rotationSpeed;
                break;
            case "x":
                grip.rotation.z -= rotationSpeed;
                break;
            case "z":
                grip.rotation.z += rotationSpeed;
                break;
        }
    });

    
    var GUI = BABYLON.GUI;
    // Instancia para GUI
    
    // GUI para os botoes
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    // let loadedGUI =  await advancedTexture.parseFromSnippetAsync("#CPGW6O#4");
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanel);

    // Inicialmente, definir visibilidade dos eixos como falsa
    var axesVisible = false;

    // Botao de Start/Stop
    var startStopButton = GUI.Button.CreateSimpleButton("startStopButton", "Start");
    startStopButton.paddingTop = "10px";
    startStopButton.width = "150px";
    startStopButton.height = "40px";
    startStopButton.color = "white";
    startStopButton.background = "green";
    startStopButton.onPointerUpObservable.add(function () {
        if (isRoutineRunning) {
            stopRoutine();
            startStopButton.textBlock.text = "Start";
            startStopButton.background = "green";
        } else {
            startRoutine();
            startStopButton.textBlock.text = "Stop";
            startStopButton.background = "red";
        }
    });
    UiPanel.addControl(startStopButton);

    var toggleAxisButton = GUI.Button.CreateSimpleButton("toggleAxisButton", "Toggle Axes");
    toggleAxisButton.paddingTop = "10px";
    toggleAxisButton.width = "150px";
    toggleAxisButton.height = "40px";
    toggleAxisButton.color = "white";
    toggleAxisButton.background = "blue";
    toggleAxisButton.onPointerUpObservable.add(function() {
        axesVisible = !axesVisible;
        toggleAxisVisibility(globalAxes, axesVisible);
        toggleAxisVisibility(servoWaistAxis, axesVisible);
        toggleAxisVisibility(servo01Axis, axesVisible);
        toggleAxisVisibility(servo02Axis, axesVisible);
        toggleAxisVisibility(servo03Axis, axesVisible);
        toggleAxisVisibility(servo04Axis, axesVisible);
        toggleAxisVisibility(gripAxis, axesVisible);

    });
    UiPanel.addControl(toggleAxisButton);

    var modelsVisible = true;
    var toggleModelsButton = GUI.Button.CreateSimpleButton("toggleModelsButton", "Toggle Models");
    toggleModelsButton.paddingTop = "10px";
    toggleModelsButton.width = "150px";
    toggleModelsButton.height = "40px";
    toggleModelsButton.color = "white";
    toggleModelsButton.background = "blue";
    toggleModelsButton.onPointerUpObservable.add(function() {
        modelsVisible = !modelsVisible;
        toggleModelsVisibility(importedMeshes,modelsVisible);
    });
    UiPanel.addControl(toggleModelsButton);

    var transparent = false;
    var toggleTransparencyButton = GUI.Button.CreateSimpleButton("toggleTransparencyButton", "Toggle Transparency");
    toggleTransparencyButton.paddingTop = "10px";
    toggleTransparencyButton.width = "150px";
    toggleTransparencyButton.height = "40px";
    toggleTransparencyButton.color = "white";
    toggleTransparencyButton.background = "blue";
    toggleTransparencyButton.onPointerUpObservable.add(function() {
        transparent = !transparent;
        toggleTransparency(importedMeshes,transparent);
    });
    UiPanel.addControl(toggleTransparencyButton);

    // Variavel que controla o estado da rotina
    var isRoutineRunning = false;

    // Iniciar a rotina
    function startRoutine() {
        if (!isRoutineRunning) {
            isRoutineRunning = true;
            performRoutine();
        }
    }

    // Parar a rotina
    function stopRoutine() {
        isRoutineRunning = false;
    }

    i = 0;

    passoRotacao = 0.02 //rad
    // Função que realiza a rotina
    function performRoutine() {
        if (isRoutineRunning) {
            if (i < 60) {
                waist.rotation.z += passoRotacao;
            }
            if (i < 60) {
                arm01.rotation.z -= passoRotacao;
            }
            if (i < 40) {
                arm02.rotation.z += passoRotacao;
            }
            if (i < 80) {
                arm03.rotation.z += passoRotacao;
            }
            if (i < 80) {
                grip.rotation.z -= passoRotacao;
            }


            if (i > 80 && i < 160) {
                waist.rotation.z -= passoRotacao;
            }
            if (i > 60 && i < 120) {
                arm01.rotation.z += passoRotacao;
            }
            if (i > 100 && i < 140) {
                arm02.rotation.z -= passoRotacao;
            }
            if (i > 40 && i < 110) {
                arm03.rotation.z -= passoRotacao;
            }
            if (i > 80 && i < 160) {
                grip.rotation.z += passoRotacao;
            }
            if (i > 180) {
                i = 0;
            }

            i++;
            // Intervalo em milissegundos entre os movimentos
            setTimeout(performRoutine, 50); 
            const newLabel = chart1.data.labels.length;
            addData(chart1, newLabel, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm01.rotation.z),BABYLON.Tools.ToDegrees(arm02.rotation.z),BABYLON.Tools.ToDegrees(arm03.rotation.z),BABYLON.Tools.ToDegrees(grip.rotation.z),0);
            addData(chart2, newLabel, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm01.rotation.z),BABYLON.Tools.ToDegrees(arm02.rotation.z),BABYLON.Tools.ToDegrees(arm03.rotation.z),BABYLON.Tools.ToDegrees(grip.rotation.z),0);
            addData(chart3, newLabel, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm01.rotation.z),BABYLON.Tools.ToDegrees(arm02.rotation.z),BABYLON.Tools.ToDegrees(arm03.rotation.z),BABYLON.Tools.ToDegrees(grip.rotation.z),0);

        }
    }

    return scene;
};
window.initFunction = async function () {

    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
})