var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene =  function () {
    
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.2, 0.3, 0.5, 1); // RGBA values: Red, Green, Blue, Alpha
    var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(60), 500, new BABYLON.Vector3(0, 450, 0), scene);
    
    camera.lowerBetaLimit = 0.1; // Limite inferior de inclinação
    camera.upperBetaLimit = (Math.PI / 2) * 0.99; // Limite superior de inclinação
    camera.lowerRadiusLimit = 500; // Limite mínimo de zoom
    camera.radius= 1500;
    camera.upperRadiusLimit = 5000; // Limite máximo de zoom
    camera.wheelPrecision = 1; // Sensibilidade do scroll do mouse
    camera.panningSensibility = 30; // Sensibilidade de arrasto do mouse
    camera.attachControl(canvas, true); // Anexar controles ao canvas
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
    
///////////////////////////////////////////////////////////////////////////////////////////
///////IMPORTANDO E POSICIONANDO MODELOS
///////////////////////////////////////////////////////////////////////////////////////////


    var importedMeshes = [];
    // Importando modelos STL
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Base.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = base;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(90); 
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Waist.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = waist;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Arm1.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm1; 
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Arm2.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm2;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Wrist.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = wrist;
        importedMesh.rotation.z = BABYLON.Tools.ToRadians(-90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/ravendano014/roboticarm/main/models/", "Gripper%20base.STL", scene, function (newMeshes) {
    //     var importedMesh = newMeshes[0];
    //     importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
    //     importedMesh.parent = grip;
    //     importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
    //     importedMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); 
    //     importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    // });

    // Tratamento de redimensionamento da janela
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // Objetos auxiliares para posicionamento dos eixos
    var base = BABYLON.MeshBuilder.CreateBox("base", { width: 0.1, height: 0.1, depth: 0.1 }, scene);
    base.rotation.x = BABYLON.Tools.ToRadians(-90);
    var baseAxis = showAxis(scene,base);

    var servoWaist = BABYLON.MeshBuilder.CreateBox("servoWaist", { width: 0.1, height: 0.1, depth: 0.1 }, scene);
    servoWaist.position.z = 200;
    servoWaist.parent = base;
    var servoWaistAxis = showAxis(scene,servoWaist);

    var waist = BABYLON.MeshBuilder.CreateBox("waist", { width: 1, height: 1, depth: 1 }, scene);
    waist.parent = servoWaist;

    var servo01 = BABYLON.MeshBuilder.CreateBox("servo01", { width: 1, height: 1, depth: 1 }, scene);
    servo01.position.y = -100;
    servo01.position.z = 130;
    servo01.rotation.z = BABYLON.Tools.ToRadians(-90);
    servo01.rotation.y = BABYLON.Tools.ToRadians(-90);
    servo01.parent = waist;
    var servo01Axis = showAxis(scene,servo01)

    var arm1 = BABYLON.MeshBuilder.CreateBox("arm1", { width: 1, height: 1, depth: 1 }, scene);
    arm1.parent = servo01;

    var servo02 = BABYLON.MeshBuilder.CreateBox("servo02", { width: 1, height: 1, depth: 1 }, scene);
    servo02.position.y = 400;
    servo02.rotation.z = BABYLON.Tools.ToRadians(90);
    servo02.parent = arm1;
    var servo02Axis = showAxis(scene,servo02);

    var arm2 = BABYLON.MeshBuilder.CreateBox("arm2", { width: 1, height: 1, depth: 1 }, scene);
    arm2.parent = servo02;

    var servo03 = BABYLON.MeshBuilder.CreateBox("servo03", { width: 1, height: 1, depth: 1 }, scene);
    servo03.position.y = -250;
    servo03.rotation.x = BABYLON.Tools.ToRadians(90);
    servo03.parent = arm2;
    var servo03Axis = showAxis(scene,servo03);

    var wrist = BABYLON.MeshBuilder.CreateBox("wrist", { width: 1, height: 1, depth: 1 }, scene);
    wrist.parent = servo03;

    var servo04 = BABYLON.MeshBuilder.CreateBox("servo04", { width: 1, height: 1, depth: 1 }, scene);
    servo04.position.z = 125
    servo04.parent = wrist;
    var servo04Axis = showAxis(scene,servo04);

    var grip = BABYLON.MeshBuilder.CreateBox("grip", { width: 1, height: 1, depth: 1 }, scene);
    grip.parent = servo04;
    grip.rotation.z = BABYLON.Tools.ToRadians(180)  
    var gripAxis = showAxis(scene,grip);

    // Inicia a engine
    engine.runRenderLoop(function () {
        scene.render();
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
    
    // Painel para os sliders (lado direito)
    var UiPanelRight = new BABYLON.GUI.StackPanel();
    UiPanelRight.width = "220px";
    UiPanelRight.fontSize = "14px";
    UiPanelRight.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanelRight.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanelRight);

    // Painel para os botões (lado esquerdo)
    var UiPanelLeft = new BABYLON.GUI.StackPanel();
    UiPanelLeft.width = "220px";
    UiPanelLeft.fontSize = "14px";
    UiPanelLeft.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    UiPanelLeft.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanelLeft);

    var isUiPanelLeftVisible = false; // State to track visibility, initially minimized

    // Toggle button for UiPanelLeft
    var toggleUiPanelLeftButton = GUI.Button.CreateSimpleButton("toggleUiPanelLeftButton", "▶ Visibility options");
    toggleUiPanelLeftButton.paddingTop = "10px";
    toggleUiPanelLeftButton.width = "150px";
    toggleUiPanelLeftButton.height = "40px";
    toggleUiPanelLeftButton.color = "white";
    toggleUiPanelLeftButton.background = "gray";
    toggleUiPanelLeftButton.onPointerUpObservable.add(function () {
        isUiPanelLeftVisible = !isUiPanelLeftVisible;
        UiPanelLeft.children.forEach(function (child) {
            if (child !== toggleUiPanelLeftButton) {
                child.isVisible = isUiPanelLeftVisible;
                child.left = isUiPanelLeftVisible ? "20px" : "0px"; // Indent child buttons when visible
            }
        });
        toggleUiPanelLeftButton.textBlock.text = isUiPanelLeftVisible ? "▼ Visibility options" : "▶ Visibility options";
    });
    UiPanelLeft.addControl(toggleUiPanelLeftButton);

    // Initially hide child buttons
    UiPanelLeft.children.forEach(function (child) {
        if (child !== toggleUiPanelLeftButton) {
            child.isVisible = false;
        }
    });
    
    // Adicionando slider para waist.rotation.z
    var sliderWaistContainer = createSliderWithText(0, 360, 180, function (value) {
        waist.rotation.z = BABYLON.Tools.ToRadians(value+180);
    }, "Waist");
    UiPanelRight.addControl(sliderWaistContainer);
    
    // Adicionando slider para arm1.rotation.z
    var sliderArm1Container = createSliderWithText(0, 180, 90, function (value) {
        arm1.rotation.z = BABYLON.Tools.ToRadians(value-90);
    }, "Arm1");
    UiPanelRight.addControl(sliderArm1Container);
    
    // Adicionando slider para arm2.rotation.z
    var sliderArm2Container = createSliderWithText(-55, 235, 0, function (value) {
        // arm2.rotation.z = value * (Math.PI / 50) - Math.PI;
        arm2.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Arm2");
    UiPanelRight.addControl(sliderArm2Container);

    // Adicionando slider para wrist.rotation.z
    var sliderWristContainer = createSliderWithText(0, 100, 50, function (value) {
        wrist.rotation.z = value * (Math.PI / 50) - Math.PI;
    }, "Wrist");
    UiPanelRight.addControl(sliderWristContainer);


    function updateSliders() {
        sliderWaistContainer.children[1].children[0].value = ajustarAngulo(BABYLON.Tools.ToDegrees(waist.rotation.z)+180);
        sliderArm1Container.children[1].children[0].value = ajustarAngulo(BABYLON.Tools.ToDegrees(arm1.rotation.z)+90);
        sliderArm2Container.children[1].children[0].value = BABYLON.Tools.ToDegrees(arm2.rotation.z);
        sliderWristContainer.children[1].children[0].value = (wrist.rotation.z + Math.PI) * (50 / Math.PI);
    }
        // Adicionando a função de atualização ao observador onBeforeRenderObservable
    scene.onBeforeRenderObservable.add(function () {
        updateSliders();
    });

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
    UiPanelLeft.addControl(startStopButton);
    
    var toggleAxisButton = GUI.Button.CreateSimpleButton("toggleAxisButton", "Toggle Axes");
    toggleAxisButton.paddingTop = "10px";
    toggleAxisButton.width = "150px";
    toggleAxisButton.height = "40px";
    toggleAxisButton.color = "white";
    toggleAxisButton.background = "blue";
    toggleAxisButton.onPointerUpObservable.add(function() {
        axesVisible = !axesVisible;
        toggleAxisVisibility(baseAxis, axesVisible);
        toggleAxisVisibility(servoWaistAxis, axesVisible);
        toggleAxisVisibility(servo01Axis, axesVisible);
        toggleAxisVisibility(servo02Axis, axesVisible);
        toggleAxisVisibility(servo03Axis, axesVisible);
        toggleAxisVisibility(servo04Axis, axesVisible);
        // toggleAxisVisibility(gripAxis, axesVisible);
        
    });
    UiPanelLeft.addControl(toggleAxisButton);
    
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
    UiPanelLeft.addControl(toggleModelsButton);
    
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
    UiPanelLeft.addControl(toggleTransparencyButton);
    
    var toggleChartsButton = GUI.Button.CreateSimpleButton("toggleChartsButton", "Toggle Charts");
    toggleChartsButton.paddingTop = "10px";
    toggleChartsButton.width = "150px";
    toggleChartsButton.height = "40px";
    toggleChartsButton.color = "white";
    toggleChartsButton.background = "blue";
    toggleChartsButton.onPointerUpObservable.add(function() {
        toggleCharts()
    });
    UiPanelLeft.addControl(toggleChartsButton);

    // Add child buttons to UiPanelLeft
    UiPanelLeft.addControl(startStopButton);
    UiPanelLeft.addControl(toggleAxisButton);
    UiPanelLeft.addControl(toggleModelsButton);
    UiPanelLeft.addControl(toggleTransparencyButton);
    UiPanelLeft.addControl(toggleChartsButton);

    // Initially hide child buttons
    UiPanelLeft.children.forEach(function (child) {
        if (child !== toggleUiPanelLeftButton) {
            child.isVisible = false;
        }
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
                arm1.rotation.z -= rotationSpeed;
                break;
            case "ArrowDown":
                arm1.rotation.z += rotationSpeed;
                break;
            case "w":
                arm2.rotation.z -= rotationSpeed;
                break;
            case "e":
                arm2.rotation.z += rotationSpeed;
                break;
            case "s":
                wrist.rotation.z -= rotationSpeed;
                break;
            case "d":
                wrist.rotation.z += rotationSpeed;
                break;
            case "x":
                grip.rotation.z -= rotationSpeed;
                break;
            case "z":
                grip.rotation.z += rotationSpeed;
                break;
        }
    });

    
    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////SALVAR POSICIONAMENTO
    ///////////////////////////////////////////////////////////////////////////////////////////















    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////ROTINA MANUAL DEMO
    ///////////////////////////////////////////////////////////////////////////////////////////
    
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
                arm1.rotation.z -= passoRotacao;
            }
            if (i < 40) {
                arm2.rotation.z += passoRotacao;
            }
            if (i < 80) {
                wrist.rotation.z += passoRotacao;
            }
            if (i < 80) {
                grip.rotation.z -= passoRotacao;
            }


            if (i > 80 && i < 160) {
                waist.rotation.z -= passoRotacao;
            }
            if (i > 60 && i < 120) {
                arm1.rotation.z += passoRotacao;
            }
            if (i > 100 && i < 140) {
                arm2.rotation.z -= passoRotacao;
            }
            if (i > 40 && i < 110) {
                wrist.rotation.z -= passoRotacao;
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
            addData(chart1, newLabel/10, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm1.rotation.z),BABYLON.Tools.ToDegrees(arm2.rotation.z),BABYLON.Tools.ToDegrees(wrist.rotation.z),BABYLON.Tools.ToDegrees(grip.rotation.z),0);
            addData(chart2, newLabel/10, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm1.rotation.z),BABYLON.Tools.ToDegrees(arm2.rotation.z),BABYLON.Tools.ToDegrees(wrist.rotation.z),BABYLON.Tools.ToDegrees(grip.rotation.z),0);
            addData(chart3, newLabel/10, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm1.rotation.z),BABYLON.Tools.ToDegrees(arm2.rotation.z),BABYLON.Tools.ToDegrees(wrist.rotation.z),BABYLON.Tools.ToDegrees(grip.rotation.z),0);

        }
    }
///////////////////////////////////////////////////////////////////////////////////////////
///////FIM ROTINA DEMO
///////////////////////////////////////////////////////////////////////////////////////////
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