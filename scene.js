var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

const DH = [
  // [alpha(deg), a, d, theta(deg)]
  [90, 100, 330, 0],
  [0,  400,   0, 0],
  [-90,  0,   0, 0],
  [90,   0, 375, 0],
  [-90,  0,   0, 0],
  [0,    0, 200, 0]
];

var createScene =  function () {
    var scene = new BABYLON.Scene(engine);

    // O BABYLON.JS não usa a convenção de sistema de coordenadas Z-up do CAD
    // Necessario o comando abaixo para respeitar a regra da mao direita.
    scene.useRightHandedSystem = true
    
    
    scene.clearColor = new BABYLON.Color4(0.2, 0.3, 0.5, 1); // RGBA values: Red, Green, Blue, Alpha
    var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(60), 500, new BABYLON.Vector3(0, 0, 450), scene);
    
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
    camera.upVector = new BABYLON.Vector3(0, 0, 1);  // Definindo Z como cima
    // Cria iluminação
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, 1), scene);
    
    // Reduzindo levemente a iluminação
    light.intensity = 0.7 ;
    
    // Adicione os eixos XYZ à cena
    // var globalAxes = showAxis(scene);
    
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
        // importedMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        importedMesh.rotation.z = BABYLON.Tools.ToRadians(90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Arm1.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm1; 
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Arm2.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = arm2;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(-90);
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
        importedMesh.position.z = 250;
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Hand_v2.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = hand;
        importedMesh.rotation.x = BABYLON.Tools.ToRadians(-90);
        importedMesh.rotation.y = BABYLON.Tools.ToRadians(-90);
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); 
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });
    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/bellinoso/TCC-THIAGO/main/Modelos/", "Claw.stl", scene, function (newMeshes) {
        var importedMesh = newMeshes[0];
        importedMesh.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        importedMesh.parent = claw;
        importedMesh.position.z = 75
        importedMesh.material = new BABYLON.StandardMaterial("importedMeshMaterial", scene);
        importedMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        importedMeshes.push(importedMesh); // Adicionar à lista de modelos importados
    });

    // Tratamento de redimensionamento da janela
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // Objetos auxiliares para posicionamento dos eixos
    // Os eixos são criados por meio de objetos auxiliares invisiveis. Depois disso, os modelos são parented a esses objetos. 
    // (fazendo eventuais ajustes de rotacao para alinhar o eixo do CAD)

    var base = BABYLON.MeshBuilder.CreateBox("base", { width: 0.1, height: 0.1, depth: 0.1 }, scene);
    var servoWaist = BABYLON.MeshBuilder.CreateBox("servoWaist", { width: 0.1, height: 0.1, depth: 0.1 }, scene);
    servoWaist.position.z = 200;
    servoWaist.parent = base;
    
    var waist = BABYLON.MeshBuilder.CreateBox("waist", { width: 1, height: 1, depth: 1 }, scene);
    waist.parent = servoWaist;

    var servo01 = BABYLON.MeshBuilder.CreateBox("servo01", { width: 1, height: 1, depth: 1 }, scene);
    servo01.position.x = 100;
    servo01.position.z = 130;
    servo01.rotation.x = BABYLON.Tools.ToRadians(90);
    servo01.parent = waist;
    
    var arm1 = BABYLON.MeshBuilder.CreateBox("arm1", { width: 1, height: 1, depth: 1 }, scene);
    arm1.parent = servo01;
    
    var servo02 = BABYLON.MeshBuilder.CreateBox("servo02", { width: 1, height: 1, depth: 1 }, scene);
    servo02.position.x = 400;
    servo02.parent = arm1;
    
    var arm2 = BABYLON.MeshBuilder.CreateBox("arm2", { width: 1, height: 1, depth: 1 }, scene);
    arm2.parent = servo02;
    
    var servo03 = BABYLON.MeshBuilder.CreateBox("servo03", { width: 1, height: 1, depth: 1 }, scene);
    servo03.rotation.x = BABYLON.Tools.ToRadians(-90);
    servo03.parent = arm2;
    
    var wrist = BABYLON.MeshBuilder.CreateBox("wrist", { width: 1, height: 1, depth: 1 }, scene);
    wrist.parent = servo03;
    
    var servo04 = BABYLON.MeshBuilder.CreateBox("servo04", { width: 1, height: 1, depth: 1 }, scene);
    servo04.position.z = 375
    servo04.rotation.x = BABYLON.Tools.ToRadians(90);
    servo04.parent = wrist;
    
    var hand = BABYLON.MeshBuilder.CreateBox("hand", { width: 1, height: 1, depth: 1 }, scene);
    hand.parent = servo04;
    
    var servo05 = BABYLON.MeshBuilder.CreateBox("servo05", { width: 1, height: 1, depth: 1 }, scene);

    servo05.rotation.x = BABYLON.Tools.ToRadians(-90);
    servo05.parent = hand;
    
    var claw = BABYLON.MeshBuilder.CreateBox("claw", { width: 1, height: 1, depth: 1 }, scene);
    claw.parent = servo05;

    var actuator = BABYLON.MeshBuilder.CreateBox("actuator", { width: 1, height: 1, depth: 1 }, scene);
    actuator.position.z = 200
    actuator.parent = claw; 

///////////////////////////////////////////////////////////////////////////////////////////
/////// Posicionamento inicial
///////////////////////////////////////////////////////////////////////////////////////////
    // Inicia a engine
    engine.runRenderLoop(function () {
        scene.render();
    });

    var waistIni = BABYLON.Tools.ToRadians(180);
    var arm1Ini = BABYLON.Tools.ToRadians(90);
    var arm2Ini = BABYLON.Tools.ToRadians(0);
    var wristIni = BABYLON.Tools.ToRadians(180);
    var handIni = BABYLON.Tools.ToRadians(0);
    var clawIni = BABYLON.Tools.ToRadians(0);

    waist.rotation.z = waistIni;
    arm1.rotation.z = arm1Ini;
    arm2.rotation.z = arm2Ini;
    wrist.rotation.z = wristIni;
    hand.rotation.z = handIni;
    claw.rotation.z = clawIni;

    var actuatorIniX = actuator.getAbsolutePosition().x;
    var actuatorIniY = actuator.getAbsolutePosition().y;
    var actuatorIniZ = actuator.getAbsolutePosition().z;

    console.log("Posição inicial do atuador: ", actuatorIniX, actuatorIniY, actuatorIniZ);

    
///////////////////////////////////////////////////////////////////////////////////////////
/////// GUI
///////////////////////////////////////////////////////////////////////////////////////////
    var GUI = BABYLON.GUI;
    // Instancia para GUI
    
    // GUI para os botoes
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanel);
    
    
    // Painel para os botões (lado esquerdo)
    var UiPanelLeft = new BABYLON.GUI.StackPanel();
    UiPanelLeft.width = "220px";
    UiPanelLeft.fontSize = "14px";
    UiPanelLeft.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    UiPanelLeft.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanelLeft);
    
    // Botao de Start/Stop
    var startDemoButton = GUI.Button.CreateSimpleButton("startDemoButton", "Start Demo");
    startDemoButton.paddingTop = "10px";
    startDemoButton.width = "150px";
    startDemoButton.height = "40px";
    startDemoButton.color = "white";
    startDemoButton.background = "green";
    startDemoButton.onPointerUpObservable.add(function () {
        if (isDemoRunning) {
            stopDemo();
            startDemoButton.textBlock.text = "Start Demo";
            startDemoButton.background = "green";
        } else {
            startDemo();
            startDemoButton.textBlock.text = "Stop Demo";
            startDemoButton.background = "red";
        }
    });
    UiPanelLeft.addControl(startDemoButton);

    // Botao de Start/Stop
    var startStopButton = GUI.Button.CreateSimpleButton("startStopButton", "Start Program");
    startStopButton.paddingTop = "10px";
    startStopButton.width = "150px";
    startStopButton.height = "40px";
    startStopButton.color = "white";
    startStopButton.background = "green";
    startStopButton.onPointerUpObservable.add(function () {
        if (isRoutineRunning) {
            stopRoutine();
            startStopButton.textBlock.text = "Start Program";
            startStopButton.background = "green";
        } else {
            startRoutine();
            startStopButton.textBlock.text = "Stop Program  ";
            startStopButton.background = "red";
        }
    });
    UiPanelLeft.addControl(startStopButton);
    

    // Inicialmente, definir visibilidade dos eixos como falsa
    var toggleAxisButton = GUI.Button.CreateSimpleButton("toggleAxisButton", "Toggle Axes");
    var axesVisible = false;
    var servo01Axis = null;
    var servo02Axis = null;  
    var servo03Axis = null;
    var servo04Axis = null;
    var servo05Axis = null;
    toggleAxisButton.paddingTop = "10px";
    toggleAxisButton.width = "150px";
    toggleAxisButton.height = "40px";
    toggleAxisButton.color = "white";
    toggleAxisButton.background = "blue";
    toggleAxisButton.onPointerUpObservable.add(function() {
        axesVisible = !axesVisible;
        if (axesVisible) {
            baseAxis = showAxis(scene,base);
            servo01Axis = showAxis(scene,servo01);
            servo02Axis = showAxis(scene,servo02);
            servo03Axis = showAxis(scene,servo03);
            servo04Axis = showAxis(scene,servo04);
            servo05Axis = showAxis(scene,servo05);
            actuatorAxis = showAxis(scene,actuator);
        }
        if (!axesVisible) {
            if (baseAxis) { baseAxis.dispose(); baseAxis = null; }
            if (servo01Axis) { servo01Axis.dispose(); servo01Axis = null; }
            if (servo02Axis) { servo02Axis.dispose(); servo02Axis = null; }
            if (servo03Axis) { servo03Axis.dispose(); servo03Axis = null; }
            if (servo04Axis) { servo04Axis.dispose(); servo04Axis = null; }
            if (servo05Axis) { servo05Axis.dispose(); servo05Axis = null; }
            if (actuatorAxis) { actuatorAxis.dispose(); actuatorAxis = null; }
        }
    });
    UiPanelLeft.addControl(toggleAxisButton);

    // Lista de pontos de posicionamento
    var pontos = [];
    // Função para adicionar um novo ponto à lista
    function adicionarPonto() {
        
        const ponto = {
            waist: waist.rotation.z,
            arm1: arm1.rotation.z,
            arm2: arm2.rotation.z,
            wrist: wrist.rotation.z,
            hand: hand.rotation.z,
            claw: claw.rotation.z,
            x: actuator.getAbsolutePosition().x,
            y: actuator.getAbsolutePosition().y,
            z: actuator.getAbsolutePosition().z,
            indicador : BABYLON.MeshBuilder.CreateSphere("pontoEsfera", { diameter: 15 }, scene)
        };

        ponto.indicador.position = new BABYLON.Vector3(ponto.x, ponto.y, ponto.z);
        var mat = new BABYLON.StandardMaterial("matEsfera", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0, 0); // vermelho
        ponto.indicador.material = mat;
        
        pontos.push(ponto);

    }

    var addPointButton = GUI.Button.CreateSimpleButton("addPointButton", "Add Point");
    addPointButton.paddingTop = "10px";
    addPointButton.width = "150px";
    addPointButton.height = "40px";
    addPointButton.color = "white";
    addPointButton.background = "blue";
    addPointButton.onPointerUpObservable.add(function() {
        adicionarPonto();
    });
    UiPanelLeft.addControl(addPointButton);

    //Adiciona os botões ao UiPanelLeft
    UiPanelLeft.addControl(startDemoButton);
    UiPanelLeft.addControl(toggleAxisButton);
    
    // Painel para os sliders (lado direito)
    var UiPanelRight = new BABYLON.GUI.StackPanel();
    UiPanelRight.width = "220px";
    UiPanelRight.fontSize = "14px";
    UiPanelRight.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanelRight.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanelRight);

    var servoSlidersContainer = new BABYLON.GUI.StackPanel();
    servoSlidersContainer.width = "220px";
    servoSlidersContainer.isVisible = true; // Começa visível

    var ikControlsContainer = new BABYLON.GUI.StackPanel();
    ikControlsContainer.width = "220px";
    ikControlsContainer.isVisible = false; // Começa oculto
    
    // Botão para alternar entre os menus
    var toggleMenuButton = BABYLON.GUI.Button.CreateSimpleButton("toggleMenuButton", "Alternar Menu");
    toggleMenuButton.width = "150px";
    toggleMenuButton.height = "40px";
    toggleMenuButton.color = "white";
    toggleMenuButton.background = "purple";
    toggleMenuButton.onPointerUpObservable.add(function () {
        servoSlidersContainer.isVisible = !servoSlidersContainer.isVisible;
        ikControlsContainer.isVisible = !ikControlsContainer.isVisible;
        toggleMenuButton.textBlock.text = servoSlidersContainer.isVisible ? "Ir para Cinemática Reversa" : "Ir para Servos";
        updateSliders();
    });
    UiPanelRight.addControl(toggleMenuButton);
    
        UiPanelRight.addControl(servoSlidersContainer);
        UiPanelRight.addControl(ikControlsContainer);
    
    var isUpdating = false; 
    function updateSliders() {
        if (servoSlidersContainer.isVisible) {
            isUpdating = true;
            sliderWaistContainer.children[1].children[0].value = ajustarAngulo(BABYLON.Tools.ToDegrees(waist.rotation.z));
            sliderArm1Container.children[1].children[0].value = ajustarAngulo(BABYLON.Tools.ToDegrees(arm1.rotation.z));
            sliderArm2Container.children[1].children[0].value = BABYLON.Tools.ToDegrees(arm2.rotation.z);
            sliderWristContainer.children[1].children[0].value = ajustarAngulo(BABYLON.Tools.ToDegrees(wrist.rotation.z));
            sliderHandContainer.children[1].children[0].value = BABYLON.Tools.ToDegrees(hand.rotation.z);
            sliderClawContainer.children[1].children[0].value = ajustarAngulo(BABYLON.Tools.ToDegrees(claw.rotation.z));
            isUpdating = false;
        }
        if (ikControlsContainer.isVisible) {
            isUpdating = true;
            sliderIKXContainer.children[1].children[0].value = actuator.getAbsolutePosition().x;
            sliderIKYContainer.children[1].children[0].value = actuator.getAbsolutePosition().y;
            sliderIKZContainer.children[1].children[0].value = actuator.getAbsolutePosition().z;
            sliderIKRollContainer.children[1].children[0].value = BABYLON.Tools.ToDegrees(getRoll(actuator));
            sliderIKPitchContainer.children[1].children[0].value = BABYLON.Tools.ToDegrees(getPitch(actuator));
            sliderIKYawContainer.children[1].children[0].value = BABYLON.Tools.ToDegrees(getYaw(actuator));
            isUpdating = false;
        }
    }
    // Adicionando a função de atualização ao observador onBeforeRenderObservable
    scene.onBeforeRenderObservable.add(function () {
        // updateSliders();
        printMatrixToDataTab(actuator)
    });
    
    // Adicionando slider para waist.rotation.z
    var sliderWaistContainer = createSliderWithText(0, 360, BABYLON.Tools.ToDegrees(waistIni), function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        waist.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Servo1");
    servoSlidersContainer.addControl(sliderWaistContainer);
    
    // Adicionando slider para arm1.rotation.z
    var sliderArm1Container = createSliderWithText(0, 180, BABYLON.Tools.ToDegrees(arm1Ini), function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        arm1.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Servo2");
    servoSlidersContainer.addControl(sliderArm1Container);
    
    // Adicionando slider para arm2.rotation.z
    var sliderArm2Container = createSliderWithText(-240, 61, BABYLON.Tools.ToDegrees(arm2Ini), function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        arm2.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Servo3");
    servoSlidersContainer.addControl(sliderArm2Container);
    
    // Adicionando slider para wrist.rotation.z
    var sliderWristContainer = createSliderWithText(0, 360, BABYLON.Tools.ToDegrees(wristIni), function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        wrist.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Servo4");
    servoSlidersContainer.addControl(sliderWristContainer);
    
    // Adicionando slider para hand.rotation.z
    var sliderHandContainer = createSliderWithText(-90, 90, BABYLON.Tools.ToDegrees(handIni), function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        hand.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Servo5");
    servoSlidersContainer.addControl(sliderHandContainer);
    
    var sliderClawContainer = createSliderWithText(0, 360, BABYLON.Tools.ToDegrees(clawIni), function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        claw.rotation.z = BABYLON.Tools.ToRadians(value);
    }, "Servo6");
    servoSlidersContainer.addControl(sliderClawContainer);
    
    var sliderIKXContainer = createSliderWithText(-1500, 1500, actuatorIniX, function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        // Chama a função de cinemática inversa e atualiza as juntas
        const T06 = T_fromMesh(actuator);
        T06[0][3] = value;
        var angles = inverse_kinematics(DH,T06,[waist.rotation.z, arm1.rotation.z, arm2.rotation.z, wrist.rotation.z, hand.rotation.z, claw.rotation.z]);
        if (Array.isArray(angles) && angles.length === 6) {
            waist.rotation.z = angles[0];
            arm1.rotation.z = angles[1];
            arm2.rotation.z = angles[2];
            wrist.rotation.z = angles[3];
            hand.rotation.z = angles[4];
            claw.rotation.z = angles[5];
        }
    }, "Posição X");
    ikControlsContainer.addControl(sliderIKXContainer);

    var sliderIKYContainer = createSliderWithText(-1500, 1500, actuatorIniY, function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        // Chama a função de cinemática inversa e atualiza as juntas
        const T06 = T_fromMesh(actuator);
        T06[1][3] = value;
        var angles = inverse_kinematics(DH,T06,[waist.rotation.z, arm1.rotation.z, arm2.rotation.z, wrist.rotation.z, hand.rotation.z, claw.rotation.z]);
        if (Array.isArray(angles) && angles.length === 6) {
            waist.rotation.z = angles[0];
            arm1.rotation.z = angles[1];
            arm2.rotation.z = angles[2];
            wrist.rotation.z = angles[3];
            hand.rotation.z = angles[4];
            claw.rotation.z = angles[5];
        }
    }, "Posição Y");
    ikControlsContainer.addControl(sliderIKYContainer);

    var sliderIKZContainer = createSliderWithText(0, 2000,actuatorIniZ, function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        // Chama a função de cinemática inversa e atualiza as juntas
        const T06 = T_fromMesh(actuator);
        T06[2][3] = value;
        var angles = inverse_kinematics(DH,T06,[waist.rotation.z, arm1.rotation.z, arm2.rotation.z, wrist.rotation.z, hand.rotation.z, claw.rotation.z]);
        if (Array.isArray(angles) && angles.length === 6) {
            waist.rotation.z = angles[0];
            arm1.rotation.z = angles[1];
            arm2.rotation.z = angles[2];
            wrist.rotation.z = angles[3];
            hand.rotation.z = angles[4];
            claw.rotation.z = angles[5];
        }
    }, "Posição Z");
    ikControlsContainer.addControl(sliderIKZContainer);

    var sliderIKRollContainer = createSliderWithText(-180, 180, 0, function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        // Chama a função de cinemática inversa e atualiza as juntas
        var T06 = T_fromMesh(actuator);
        T06 = setRoll(T06, BABYLON.Tools.ToRadians(value));
        var angles = inverse_kinematics(DH,T06,[waist.rotation.z, arm1.rotation.z, arm2.rotation.z, wrist.rotation.z, hand.rotation.z, claw.rotation.z]);   
        if (Array.isArray(angles) && angles.length === 6) {
            waist.rotation.z = angles[0];
            arm1.rotation.z = angles[1];
            arm2.rotation.z = angles[2];
            wrist.rotation.z = angles[3];
            hand.rotation.z = angles[4];
            claw.rotation.z = angles[5];
        }
    }, "Roll");
    ikControlsContainer.addControl(sliderIKRollContainer);  

    var sliderIKPitchContainer = createSliderWithText(-180, 180, 0, function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        // Chama a função de cinemática inversa e atualiza as juntas
        var T06 = T_fromMesh(actuator);
        T06 = setPitch(T06, BABYLON.Tools.ToRadians(value));
        var angles = inverse_kinematics(DH,T06,[waist.rotation.z, arm1.rotation.z, arm2.rotation.z, wrist.rotation.z, hand.rotation.z, claw.rotation.z]);   
        if (Array.isArray(angles) && angles.length === 6) {
            waist.rotation.z = angles[0];
            arm1.rotation.z = angles[1];
            arm2.rotation.z = angles[2];
            wrist.rotation.z = angles[3];
            hand.rotation.z = angles[4];
            claw.rotation.z = angles[5];
        }
    }, "Pitch");
    ikControlsContainer.addControl(sliderIKPitchContainer);     

    var sliderIKYawContainer = createSliderWithText(-180, 180, 0, function (value) {
        if (isUpdating) return; // Ignorar se estiver atualizando os sliders
        // Chama a função de cinemática inversa e atualiza as juntas
        var T06 = T_fromMesh(actuator);
        T06 = setYaw(T06, BABYLON.Tools.ToRadians(value));
        var angles = inverse_kinematics(DH,T06,[waist.rotation.z, arm1.rotation.z, arm2.rotation.z, wrist.rotation.z, hand.rotation.z, claw.rotation.z]);   
        if (Array.isArray(angles) && angles.length === 6) {
            waist.rotation.z = angles[0];
            arm1.rotation.z = angles[1];
            arm2.rotation.z = angles[2];
            wrist.rotation.z = angles[3];
            hand.rotation.z = angles[4];
            claw.rotation.z = angles[5];
        }
    }, "Yaw");
    ikControlsContainer.addControl(sliderIKYawContainer);   

    // Controle manual pelo teclado
    var rotationSpeed = 0.03;
    var linearSpeed = 10;
    window.addEventListener("keydown", function (event) {
        if (servoSlidersContainer.isVisible) {
            switch (event.key.toLowerCase()) {
                case "q":
                    waist.rotation.z -= rotationSpeed; 
                    break;
                    case "w": 
                    waist.rotation.z += rotationSpeed; 
                    break;
                case "e":
                    if (BABYLON.Tools.ToDegrees(arm1.rotation.z - rotationSpeed) <= 0) {
                        arm1.rotation.z = BABYLON.Tools.ToRadians(0);
                    } else {
                        arm1.rotation.z -= rotationSpeed;
                    }
                    break;
                case "r":
                    if (BABYLON.Tools.ToDegrees(arm1.rotation.z + rotationSpeed) >= 180) {
                        arm1.rotation.z = BABYLON.Tools.ToRadians(180);
                    } else {
                        arm1.rotation.z += rotationSpeed;
                    }
                    break;
                case "a":
                    if(BABYLON.Tools.ToDegrees(arm2.rotation.z - rotationSpeed) <= -240) {
                        arm2.rotation.z = BABYLON.Tools.ToRadians(-240);
                    } else {
                        arm2.rotation.z -= rotationSpeed;
                    }
                    break;
                case "s":
                    if(BABYLON.Tools.ToDegrees(arm2.rotation.z + rotationSpeed) >= 61) {
                        arm2.rotation.z = BABYLON.Tools.ToRadians(61);
                    } else {
                        arm2.rotation.z += rotationSpeed;
                    }
                    break;
                case "d":
                    wrist.rotation.z -= rotationSpeed;
                    break;
                case "f":
                    wrist.rotation.z += rotationSpeed;
                    break;
                case "x":
                    if (BABYLON.Tools.ToDegrees(hand.rotation.z - rotationSpeed) <= -90) {
                        hand.rotation.z = BABYLON.Tools.ToRadians(-90);
                    } else {
                        hand.rotation.z -= rotationSpeed;
                    }
                    break;
                case "z":
                    if (BABYLON.Tools.ToDegrees(hand.rotation.z - rotationSpeed) >= 90) {
                        hand.rotation.z = BABYLON.Tools.ToRadians(90);
                    } else {
                        hand.rotation.z += rotationSpeed;
                    }
                    break;
                case "c":
                    claw.rotation.z -= rotationSpeed; 
                    break;
                case "v": 
                    claw.rotation.z += rotationSpeed; 
                    break;
                }
            updateSliders();
        }
        // if (ikControlsContainer.isVisible) {
        //     switch (event.key.toLowerCase()) {
        //         case "arrowup":
        //             // Aumentar o ângulo de yaw
        //             break;
        //         case "arrowdown":
        //             // Diminuir o ângulo de yaw
        //             break;
        //         case "arrowleft":
        //             // Aumentar o ângulo de pitch
        //             break;
        //         case "arrowright":
        //             // Diminuir o ângulo de pitch
        //             break;
        //     }
        //     updateSliders();
        // }
    });

    
///////////////////////////////////////////////////////////////////////////////////////////
///////SALVAR POSICIONAMENTO
///////////////////////////////////////////////////////////////////////////////////////////


    var isRoutineRunning = false;   

    function startRoutine() {
        if (!isRoutineRunning) {
            if (pontos.length === 0) {
                console.log("Nenhum ponto adicionado para executar a rotina.");
                return;
            }
            isRoutineRunning = true;
            clearAllCharts()
            setPositionFromPoint(pontos[0])
            performRoutine(pontos);
        }
    }

    function stopRoutine() {
        isRoutineRunning = false;
    }

    async function performRoutine(pontos) {
        if (!Array.isArray(pontos) || pontos.length < 2) {
            isRoutineRunning = false;
            if (typeof startStopButton !== "undefined" && startStopButton) {
                startStopButton.textBlock.text = "Start Program";
                startStopButton.background = "green";
            }
            return;
        }

        // tempo acumulado da rotina em ms — usado para que os gráficos usem tempo contínuo
        let totalTimeMs = 0;

        for (let i = 0; i + 1 < pontos.length && isRoutineRunning; i++) {
            const durationMs = 3000; // tempo do segmento (ajuste se necessário)
            await movePointToPoint(pontos[i], pontos[i + 1], durationMs, totalTimeMs);
            totalTimeMs += durationMs;
        }

        // ao terminar, marcar rotina como parada e atualizar o botão
        isRoutineRunning = false;
        if (typeof startStopButton !== "undefined" && startStopButton) {
            startStopButton.textBlock.text = "Start Program";
            startStopButton.background = "green";
        }
    }

    // Move suavemente de startPoint para endPoint em "durationMs" milissegundos usando um polinômio cúbico
    // Condições: velocidade inicial e final = 0
    // tOffsetMs: deslocamento de tempo (em ms) para manter os labels dos gráficos contínuos
    function movePointToPoint(startPoint, endPoint, durationMs, tOffsetMs = 0) {
        return new Promise((resolve) => {
            const joints = ["waist", "arm1", "arm2", "wrist", "hand", "claw"];
            const T = durationMs / 1000; // converter para segundos para derivadas consistentes
            // calcular coeficientes a0..a3 para cada junta
            const coeffs = {};
            joints.forEach((j) => {
                const q0 = startPoint[j];
                const qf = endPoint[j];
                const d = qf - q0;
                const a0 = q0;
                const a1 = 0;
                const a2 = 3 * d / (T * T);
                const a3 = -2 * d / (T * T * T);
                coeffs[j] = { a0, a1, a2, a3 };
            });

            let startTime = null;
            let rafId = null;

            function step(ts) {
                if (!startTime) startTime = ts;
                const elapsedMs = ts - startTime;
                const clampedMs = Math.min(elapsedMs, durationMs);
                const tSec = clampedMs / 1000; // tempo em segundos, limitado a T

                // atualizar juntas
                joints.forEach((j) => {
                    const { a0, a1, a2, a3 } = coeffs[j];
                    // theta(t) = a0 + a1 t + a2 t^2 + a3 t^3
                    const theta = a0 + a1 * tSec + a2 * tSec * tSec + a3 * tSec * tSec * tSec;

                    // aplicar ao mesh
                    switch (j) {
                        case "waist":
                            waist.rotation.z = theta;
                            break;
                        case "arm1":
                            arm1.rotation.z = theta;
                            break;
                        case "arm2":
                            arm2.rotation.z = theta;
                            break;
                        case "wrist":
                            wrist.rotation.z = theta;
                            break;
                        case "hand":
                            hand.rotation.z = theta;
                            break;
                        case "claw":
                            claw.rotation.z = theta;
                            break;
                    }
                });

                // Atualizar sliders e prints
                updateSliders();
                printMatrixToDataTab(actuator);

                // Calcular velocidades e acelerações analíticas (rad/s, rad/s²) e converter para graus
                const velDeg = [];
                const accDeg = [];
                joints.forEach((j) => {
                    const { a1, a2, a3 } = coeffs[j];
                    // theta'(t) = a1 + 2 a2 t + 3 a3 t^2
                    const thetaDot = a1 + 2 * a2 * tSec + 3 * a3 * tSec * tSec;
                    // theta''(t) = 2 a2 + 6 a3 t
                    const thetaDDot = 2 * a2 + 6 * a3 * tSec;
                    velDeg.push(BABYLON.Tools.ToDegrees(thetaDot));
                    accDeg.push(BABYLON.Tools.ToDegrees(thetaDDot));
                });

                // Adicionar dados aos charts (usa tempo total: tOffsetMs + elapsedMs)
                if (typeof addData === "function" && typeof chart1 !== "undefined") {
                    const totalLabel = ((tOffsetMs + elapsedMs) / 1000).toFixed(2);
                    // posições (graus)
                    addData(chart1, totalLabel,
                        BABYLON.Tools.ToDegrees(waist.rotation.z),
                        BABYLON.Tools.ToDegrees(arm1.rotation.z),
                        BABYLON.Tools.ToDegrees(arm2.rotation.z),
                        BABYLON.Tools.ToDegrees(wrist.rotation.z),
                        BABYLON.Tools.ToDegrees(hand.rotation.z),
                        BABYLON.Tools.ToDegrees(claw.rotation.z)
                    );
                    // velocidades (graus/s) -> chart2
                    addData(chart2, totalLabel,
                        velDeg[0], velDeg[1], velDeg[2], velDeg[3], velDeg[4], velDeg[5]
                    );
                    // acelerações (graus/s²) -> chart3
                    addData(chart3, totalLabel,
                        accDeg[0], accDeg[1], accDeg[2], accDeg[3], accDeg[4], accDeg[5]
                    );
                }

                // terminar ou continuar
                if (elapsedMs >= durationMs || !isRoutineRunning) {
                    // garantir estado final exatamente igual ao endPoint
                    setPositionFromPoint(endPoint);
                    updateSliders();
                    // garantir valores finais (vel e acc = 0) nos charts
                    if (typeof addData === "function" && typeof chart1 !== "undefined") {
                        const totalLabel = ((tOffsetMs + durationMs) / 1000).toFixed(2);
                        addData(chart1, totalLabel,
                            BABYLON.Tools.ToDegrees(endPoint.waist),
                            BABYLON.Tools.ToDegrees(endPoint.arm1),
                            BABYLON.Tools.ToDegrees(endPoint.arm2),
                            BABYLON.Tools.ToDegrees(endPoint.wrist),
                            BABYLON.Tools.ToDegrees(endPoint.hand),
                            BABYLON.Tools.ToDegrees(endPoint.claw)
                        );
                        addData(chart2, totalLabel, 0, 0, 0, 0, 0, 0);
                        addData(chart3, totalLabel, 0, 0, 0, 0, 0, 0);
                    }
                    if (rafId) cancelAnimationFrame(rafId);
                    resolve();
                    return;
                }
                rafId = requestAnimationFrame(step);
            }

            // iniciar loop
            rafId = requestAnimationFrame(step);
        });
    }

    function setPositionFromPoint(point) {
        waist.rotation.z = point.waist;
        arm1.rotation.z = point.arm1;
        arm2.rotation.z = point.arm2;
        wrist.rotation.z = point.wrist;
        hand.rotation.z = point.hand;
        claw.rotation.z = point.claw;
    }


///////////////////////////////////////////////////////////////////////////////////////////
///////ROTINA MANUAL DEMO
///////////////////////////////////////////////////////////////////////////////////////////
    // Variavel que controla o estado da rotina
    var isDemoRunning = false;
    // Iniciar a rotina
    function startDemo() {
        if (!isDemoRunning) {
            isDemoRunning = true;
            performDemo();
        }
    }
    // Parar a rotina
    function stopDemo() {
        isDemoRunning = false;
    }
    i = 0;
    passoRotacao = 0.02 //rad
    // Função que realiza a rotina
    function performDemo() {
        if (isDemoRunning) {
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
                hand.rotation.z -= passoRotacao;
            }
            if (i < 80) {
                claw.rotation.z -= passoRotacao;
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
                hand.rotation.z += passoRotacao;
            }
            if (i > 80 && i < 160) {
                claw.rotation.z += passoRotacao;
            }
            if (i > 180) {
                i = 0;
            }
            updateSliders();
            // adicionarPonto();
            i++;
            // Intervalo em milissegundos entre os movimentos
            setTimeout(performDemo, 50); 
            const newLabel = chart1.data.labels.length;
            addData(chart1, newLabel/10, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm1.rotation.z),BABYLON.Tools.ToDegrees(arm2.rotation.z),BABYLON.Tools.ToDegrees(wrist.rotation.z),BABYLON.Tools.ToDegrees(hand.rotation.z),BABYLON.Tools.ToDegrees(claw.rotation.z));  
            addData(chart2, newLabel/10, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm1.rotation.z),BABYLON.Tools.ToDegrees(arm2.rotation.z),BABYLON.Tools.ToDegrees(wrist.rotation.z),BABYLON.Tools.ToDegrees(hand.rotation.z),BABYLON.Tools.ToDegrees(claw.rotation.z));
            addData(chart3, newLabel/10, BABYLON.Tools.ToDegrees(waist.rotation.z),BABYLON.Tools.ToDegrees(arm1.rotation.z),BABYLON.Tools.ToDegrees(arm2.rotation.z),BABYLON.Tools.ToDegrees(wrist.rotation.z),BABYLON.Tools.ToDegrees(hand.rotation.z),BABYLON.Tools.ToDegrees(claw.rotation.z));

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
