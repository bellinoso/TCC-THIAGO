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

function inverse_kinematics(DH_params, T06, prevAngles) {
    const params = DH_params.map(r => r.slice());
    const a1 = params[0][1], a2 = params[1][1], a3 = params[2][1];
    const d1 = params[0][2], d4 = params[3][2], d6 = params[5][2];

    // Ponto do punho
    const pwc = [
        T06[0][3] - d6 * T06[0][2],
        T06[1][3] - d6 * T06[1][2],
        T06[2][3] - d6 * T06[2][2]
    ];

    // Theta1 é basicamente o arco tangente de y/x
    let theta1 = Math.atan2(pwc[1], pwc[0]);

    // Escolher theta1 mais próximo do anterior
    if (theta1 < 0) theta1 += 2*Math.PI;
    if (theta1 > Math.PI) theta1 -= Math.PI;
    if (Math.abs(theta1 - prevAngles[0]) > Math.abs(theta1 + Math.PI - prevAngles[0])) {
        theta1 += Math.PI;
    }


    const r = Math.hypot(pwc[0], pwc[1]) - a1; //Distância no plano XY
    const s = pwc[2] - d1;  //Distância no plano Z

    // Cálculo de theta2 e theta3 usando a lei dos cossenos
    // Triângulo formado por a2, L3 e a linha entre a base e o punho   
    const L3 = Math.hypot(a3, d4);
    const beta = (Math.abs(a3) < 1e-12 && Math.abs(d4) < 1e-12) ? 0 : Math.atan2(d4, a3);

    let D = (r*r + s*s - a2*a2 - L3*L3) / (2 * a2 * L3); // Lei dos cossenos
    D = clip(D, -1, 1); // Garantir que D está no intervalo [-1, 1]

    const sqrt1mD2 = Math.sqrt(1 - D*D);
    const theta3p_a = Math.atan2(+sqrt1mD2, D);
    const theta3p_b = Math.atan2(-sqrt1mD2, D);

    const theta2a = Math.atan2(s, r) - Math.atan2(L3*Math.sin(theta3p_a), a2 + L3*Math.cos(theta3p_a));
    const theta2b = Math.atan2(s, r) - Math.atan2(L3*Math.sin(theta3p_b), a2 + L3*Math.cos(theta3p_b));

    const theta3a = theta3p_a - beta;
    const theta3b = theta3p_b - beta;

    let theta2, theta3;
    if (Math.abs(theta2a - prevAngles[1]) > Math.abs(theta2b - prevAngles[1])) {
        theta2 = theta2b;
        theta3 = theta3b;
    } else {
        theta2 = theta2a;
        theta3 = theta3a;
    }

    // Orientação
    const R06 = [
        [T06[0][0], T06[0][1], T06[0][2]],
        [T06[1][0], T06[1][1], T06[1][2]],
        [T06[2][0], T06[2][1], T06[2][2]],
    ];

    // T03 com θ1..θ3 encontrados
    let T03 = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    const th123_deg = [BABYLON.Tools.ToDegrees(theta1), BABYLON.Tools.ToDegrees(theta2), BABYLON.Tools.ToDegrees(theta3)];
    // Multiplica as matrizes de transformação DH para os três primeiros elos
    for (let i = 0; i < 3; i++) {
        const [alpha,a,d] = params[i];
        T03 = matMul4(T03, dhTransform(alpha, a, d, th123_deg[i]));
    }
    const R03 = [
        [T03[0][0], T03[0][1], T03[0][2]],
        [T03[1][0], T03[1][1], T03[1][2]],
        [T03[2][0], T03[2][1], T03[2][2]],
    ];

    // R36 = R03^T * R06
    const R36 = matMul3(matT3(R03), R06);

    const eps = 1e-9;
    const s5_mag = Math.hypot(R36[2][0], R36[2][1]);
    let theta4, theta5, theta6;

    theta5 = Math.atan2(s5_mag, R36[2][2]);
    if (s5_mag > eps) {
        const c4 = -R36[0][2] / s5_mag;
        const s4 = -R36[1][2] / s5_mag;
        theta4 = Math.atan2(s4, c4);

        const c6 =  R36[2][0] / s5_mag;
        const s6 = -R36[2][1] / s5_mag;
        theta6 = Math.atan2(s6, c6);
    } else { // Caso singular: θ5 = 0 ou π
        theta5 = (R36[2][2] > 0) ? 0.0 : Math.PI;
        const phi = Math.atan2(R36[1][0], R36[0][0]); // θ4 + θ6
        theta4 = prevAngles[3] || 0;
        theta6 = phi - theta4;
    }

    const prev = (prevAngles.length === 6 ? prevAngles : [0,0,0,0,0,0]);

    function bring_close(th, th_prev) {
        return th + 2*Math.PI * Math.round((th_prev - th) / (2*Math.PI));
    }

    const sol1 = [theta1, theta2, theta3, theta4, theta5, theta6];
    const sol2 = [theta1, theta2, theta3, theta4 + Math.PI, -theta5, theta6 + Math.PI];

    // const err1 = Math.hypot(sol1[3]-prev[3], sol1[4]-prev[4], sol1[5]-prev[5]);
    // const err2 = Math.hypot(sol2[3]-prev[3], sol2[4]-prev[4], sol2[5]-prev[5]);

    // const sol = (err1 <= err2) ? sol1 : sol2;
    // return sol;


    const sol1_adj = sol1.map((th, i) => bring_close(th, prev[i]));
    const sol2_adj = sol2.map((th, i) => bring_close(th, prev[i]));

    const err1 = Math.hypot(sol1_adj[3]-prev[3], sol1_adj[4]-prev[4], sol1_adj[5]-prev[5]);
    const err2 = Math.hypot(sol2_adj[3]-prev[3], sol2_adj[4]-prev[4], sol2_adj[5]-prev[5]);

    const sol = (err1 <= err2) ? sol1_adj : sol2_adj;
    return sol;
}

function matT3(A) { // Transposta de matriz 3x3
    return [
        [A[0][0], A[1][0], A[2][0]],
        [A[0][1], A[1][1], A[2][1]],
        [A[0][2], A[1][2], A[2][2]],
    ];
}

function matMul3(A, B) { // Multiplicação de matrizes 3x3
    const R = [[0,0,0],[0,0,0],[0,0,0]];
    for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
        let s = 0;
        for (let j = 0; j < 3; j++) s += A[i][j]*B[j][k];
        R[i][k] = s;
        }
    }
    return R;
    }

function matMul4(A, B) { // Multiplicação de matrizes 4x4
    const R = Array.from({ length: 4 }, () => [0,0,0,0]);
    for (let i = 0; i < 4; i++) {
        for (let k = 0; k < 4; k++) {
        let s = 0;
        for (let j = 0; j < 4; j++) s += A[i][j]*B[j][k];
        R[i][k] = s;
        }
    }
    return R;
}

// Matriz de transformação DH
function dhTransform(alphaDeg, a, d, thetaDeg) { 
    const alpha = BABYLON.Tools.ToRadians(alphaDeg);
    const theta = BABYLON.Tools.ToRadians(thetaDeg);
    const ca = Math.cos(alpha), sa = Math.sin(alpha);
    const ct = Math.cos(theta), st = Math.sin(theta);
    return [
        [ ct, -st*ca,  st*sa, a*ct ],
        [ st,  ct*ca, -ct*sa, a*st ],
        [  0,     sa,     ca,    d ],
        [  0,      0,      0,    1 ]
    ];
}


function clip(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); } 

function T_fromMesh(mesh) {
    const world = mesh.getWorldMatrix(true);
    const scaling = new BABYLON.Vector3();
    const rotation = new BABYLON.Quaternion();
    const translation = new BABYLON.Vector3();
    world.decompose(scaling, rotation, translation);

    const Rm = new BABYLON.Matrix();
    rotation.toRotationMatrix(Rm);
    const m = Rm.m; 

    // Extrai R como row-major 3x3
    const R = [
        [ m[0], m[4], m[8]  ],
        [ m[1], m[5], m[9]  ],
        [ m[2], m[6], m[10] ],
    ];

    return [
        [ R[0][0], R[0][1], R[0][2], translation.x ],
        [ R[1][0], R[1][1], R[1][2], translation.y ],
        [ R[2][0], R[2][1], R[2][2], translation.z ],
        [ 0, 0, 0, 1 ]
    ];
}

function getRoll(mesh) {
    const world = mesh.getWorldMatrix(true);
    const scaling = new BABYLON.Vector3();
    const rotation = new BABYLON.Quaternion();
    const translation = new BABYLON.Vector3();
    world.decompose(scaling, rotation, translation);

    const euler = rotation.toEulerAngles();
    return euler.z;
}

function getPitch(mesh) {
    const world = mesh.getWorldMatrix(true);
    const scaling = new BABYLON.Vector3();
    const rotation = new BABYLON.Quaternion();
    const translation = new BABYLON.Vector3();
    world.decompose(scaling, rotation, translation);

    const euler = rotation.toEulerAngles();
    return euler.y;
}

function getYaw(mesh) {
    const world = mesh.getWorldMatrix(true);
    const scaling = new BABYLON.Vector3();
    const rotation = new BABYLON.Quaternion();
    const translation = new BABYLON.Vector3();
    world.decompose(scaling, rotation, translation);

    const euler = rotation.toEulerAngles();
    return euler.x;
}   

function setRoll(T, roll) {
    // Extrai ângulos (ZYX)
    const pitch = Math.asin(-T[2][0]);
    const yaw = Math.atan2(T[1][0] / Math.cos(pitch), T[0][0] / Math.cos(pitch));

    // Reconstrói T com novo roll
    const c1 = Math.cos(yaw), s1 = Math.sin(yaw);
    const c2 = Math.cos(pitch), s2 = Math.sin(pitch);
    const c3 = Math.cos(roll), s3 = Math.sin(roll);

    T[0][0] = c1*c2;            T[0][1] = c1*s2*s3 - s1*c3;  T[0][2] = c1*s2*c3 + s1*s3;
    T[1][0] = s1*c2;            T[1][1] = s1*s2*s3 + c1*c3;  T[1][2] = s1*s2*c3 - c1*s3;
    T[2][0] = -s2;              T[2][1] = c2*s3;             T[2][2] = c2*c3;

    return T;
}   

function setPitch(T, pitch) {
    // Extrai ângulos (ZYX)
    const roll = Math.atan2(T[2][1] / Math.cos(pitch), T[2][2] / Math.cos(pitch));
    const yaw = Math.atan2(T[1][0] / Math.cos(pitch), T[0][0] / Math.cos(pitch));

    // Reconstrói T com novo roll
    const c1 = Math.cos(yaw), s1 = Math.sin(yaw);
    const c2 = Math.cos(pitch), s2 = Math.sin(pitch);
    const c3 = Math.cos(roll), s3 = Math.sin(roll);

    T[0][0] = c1*c2;            T[0][1] = c1*s2*s3 - s1*c3;  T[0][2] = c1*s2*c3 + s1*s3;
    T[1][0] = s1*c2;            T[1][1] = s1*s2*s3 + c1*c3;  T[1][2] = s1*s2*c3 - c1*s3;
    T[2][0] = -s2;              T[2][1] = c2*s3;             T[2][2] = c2*c3;

    return T;
}   

function setYaw(T, yaw) {
    // Extrai ângulos (ZYX)
    const pitch = Math.asin(-T[2][0]);
    const roll = Math.atan2(T[2][1] / Math.cos(pitch), T[2][2] / Math.cos(pitch));

    // Reconstrói T com novo roll
    const c1 = Math.cos(yaw), s1 = Math.sin(yaw);
    const c2 = Math.cos(pitch), s2 = Math.sin(pitch);
    const c3 = Math.cos(roll), s3 = Math.sin(roll);

    T[0][0] = c1*c2;            T[0][1] = c1*s2*s3 - s1*c3;  T[0][2] = c1*s2*c3 + s1*s3;
    T[1][0] = s1*c2;            T[1][1] = s1*s2*s3 + c1*c3;  T[1][2] = s1*s2*c3 - c1*s3;
    T[2][0] = -s2;              T[2][1] = c2*s3;             T[2][2] = c2*c3;

    return T;
}   