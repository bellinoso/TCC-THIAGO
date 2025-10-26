// Alternância de abas
const tabButtons = document.querySelectorAll('.tabButton');
const tabPanes = document.querySelectorAll('.tabPane');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        var chartsZone = document.getElementById('tabContent');
        var displayStyle = window.getComputedStyle(chartsZone).display;
    
        if (displayStyle === 'none' || displayStyle === '') {
            toggleCharts()
        }

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
});

let minimized = false;
document.getElementById('minimizeTabContent').onclick = function() {
    minimized = !minimized;
    toggleCharts()
    this.textContent = minimized ? '⧉' : '✕'; // Alterna ícone
};

function toggleCharts() {
        var chartsZone = document.getElementById('tabContent');
        var canvasZone = document.getElementById('canvasZone');
        var displayStyle = window.getComputedStyle(chartsZone).display;
    
        if (displayStyle === 'none' || displayStyle === '') {
            chartsZone.style.display = 'flex';
            canvasZone.style.height = '65%'; 
            document.getElementById('minimizeTabContent').textContent = '⧉'; // Mostrar o botão de minimizar
        } else {
            chartsZone.style.display = 'none';
            canvasZone.style.height = '100%';
            document.getElementById('minimizeTabContent').textContent = '✕'; // Mostrar o botão de minimizar
        }
        engine.resize();
    }

function resizeCanvas(canvas, chart) {
    const container = canvas.parentNode;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        chart.resize();
    }
}

const chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'θ1',
                data: [],
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'θ2',
                data: [],
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'θ3',
                data: [],
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'θ4',
                data: [],
                borderColor: 'rgba(255, 0, 255, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'θ5',
                data: [],
                borderColor: 'rgba(255, 170, 50, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'θ6',
                data: [],
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom', // Move a legenda para baixo
                labels: {
                    usePointStyle: true,
                    pointStyle: 'line',
                    borderWidth: 6
                }
            },
            title: {
                display: true,
                text: ''
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
                // title: {
                //     display: true,
                //     text: 't [ s ]' // Texto será configurado para cada gráfico individualmente
                // }
            },
            y: {
                title: {
                    display: true,
                    text: '' // Texto será configurado para cada gráfico individualmente
                }
            }
        }
    }
};

const ctx1 = document.getElementById('gPos').getContext('2d');
const ctx2 = document.getElementById('gVel').getContext('2d');
const ctx3 = document.getElementById('gAce').getContext('2d');

// Criação dos gráficos com títulos diferentes
const chartConfig1 = JSON.parse(JSON.stringify(chartConfig));
chartConfig1.options.plugins.title.text = 'Posição';
chartConfig1.options.scales.y.title.text = 'p [ deg ]';
const chart1 = new Chart(ctx1, chartConfig1);

const chartConfig2 = JSON.parse(JSON.stringify(chartConfig));
chartConfig2.options.plugins.title.text = 'Velocidade';
chartConfig2.options.scales.y.title.text = 'v [ deg / s ]';
const chart2 = new Chart(ctx2, chartConfig2);

const chartConfig3 = JSON.parse(JSON.stringify(chartConfig));
chartConfig3.options.plugins.title.text = 'Aceleração';
chartConfig3.options.scales.y.title.text = 'a [ deg / s^2 ]';
const chart3 = new Chart(ctx3, chartConfig3);

// Redimensionar os canvas ao carregar e quando a janela é redimensionada
function resizeCharts() {
    resizeCanvas(ctx1.canvas, chart1);
    resizeCanvas(ctx2.canvas, chart2);
    resizeCanvas(ctx3.canvas, chart3);
}

window.addEventListener('resize', resizeCharts);
window.addEventListener('load', resizeCharts);

// Função para adicionar dados aos gráficos
function addData(chart, label, data1, data2, data3, data4, data5, data6) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data1);
    chart.data.datasets[1].data.push(data2);
    chart.data.datasets[2].data.push(data3);
    chart.data.datasets[3].data.push(data4);
    chart.data.datasets[4].data.push(data5);
    chart.data.datasets[5].data.push(data6);
    chart.update('none');
}

function clearAllCharts() {
    [chart1, chart2, chart3].forEach(chart => {
        chart.data.labels = [];
        chart.data.datasets.forEach(ds => ds.data = []);
        chart.update();
    });
}

// // Exemplo de como adicionar dados aos gráficos
// setInterval(() => {
//     const newData1 = Math.random() * 100;
//     const newData2 = Math.random() * 100;
//     const newLabel = chart1.data.labels.length;
//     addData(chart1, newLabel, newData1, newData2, newData1+newData2, newData1*1.4, -newData1/2, newData2/2);
//     addData(chart2, newLabel, newData1 / -2, newData2 / 2, newData1+newData2, newData1*2, newData2/2, newData1/2);
//     addData(chart3, newLabel, newData1 / 1, newData2 / -3, newData1+newData2, newData1*2, newData2/2, newData1/2);
// }, 1000);