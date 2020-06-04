

let color = 'blue';
let len = undefined;

let nodes = [{ id: 0, label: "0", color: '#6E6EFD', peso: 7 },
{ id: 1, label: "1", color: '#6E6EFD', to: [0, 6], peso: 6 },
{ id: 2, label: "2", color: '#6E6EFD', to: [0] , peso: 5},
{ id: 3, label: "3", color: '#6E6EFD', to: [5] , peso: 4},
{ id: 4, label: "4", color: '#6E6EFD', to: [3, 0] , peso: 2},
{ id: 5, label: "5", color: '#6E6EFD', to: [4] , peso: 1},
{ id: 6, label: "6", color: '#6E6EFD' , peso: 2},
{ id: 7, label: "7", color: '#6E6EFD', to: [6, 0] , peso: 2},
{ id: 8, label: "8", color: '#6E6EFD', to: [7, 3] , peso: 2},
{ id: 9, label: "9", color: '#6E6EFD' , peso: 2},
{ id: 10, label: "10", color: '#6E6EFD', to: [9, 4] , peso: 1},

];
let edges = [{ from: 1, to: 0 },
{ from: 2, to: 0 },
{ from: 4, to: 3 },
{ from: 5, to: 4 },
{ from: 4, to: 0 },
{ from: 7, to: 6 },
{ from: 8, to: 7 },
{ from: 7, to: 0 },
{ from: 10, to: 9 },
{ from: 10, to: 4 },
{ from: 1, to: 6 },
{ from: 8, to: 3 },
{ from: 3, to: 5 }
]

var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    physics: false,
    nodes: {
        shape: 'dot',
        size: 15,
        font: {
            size: 15,
            color: '#ffffff'
        },
        borderWidth: 2
    },
    edges: {
        width: 2
    }, interaction: {
        zoomView: false,
        dragView: false
    }
};
network = new vis.Network(container, data, options);
network.enableEditMode();


function percorrer() {
    var len = network.body.data.nodes.length;
    for (var i = 0; i <= len; i++) {
        (function (index) {
            setTimeout(function () { marcar(index); desmarcar(index); }, i * 1000);
        })(i);
    }
}

function marcar(x) {
    var node = network.body.nodes[x];
    if (node != undefined) {
        node['selected'] = true;
        node.setOptions({ size: 15, image: 'img/viatura.png', shape: 'image' });
    }
    network.moveTo({ scale: 1 });
    desmarcar(x);
}

function desmarcar(id) {
    var node;
    if (id != 0) {
        node = network.body.nodes[id - 1]
        node['selected'] = false;
        delete node['options']['image']
        node.setOptions({ size: 15, shape: 'dot' });
    }
}

function reordenar() {
    location.reload();
}

function add() {
    nodes.push({ id: 1, label: 'Main', image: './viatura.png', shape: 'image' });
}



// #####################################################################################################################



function dijkstra(inicial) {
    let grafo = new Grafo(nodes)
    let raiz = new No(nodes[0]);
    console.log(grafo);
    calcularCaminhosMaisCurtos(grafo, raiz);
}


function calcularCaminhosMaisCurtos(grafo, raiz) {
    raiz.distancia = 0;
    nosDefinidos = [];
    nosIndefinidos = [];
    nosIndefinidos.push(raiz);

    while (nosIndefinidos.length != 0) {
        let noAtual = obterMenorDistancia(nosIndefinidos);
        nosIndefinidos.splice(nosIndefinidos.indexOf(noAtual), 1);

        noAtual.adjacencias.forEach(parAdjacente => {
            let noAdjacente = parAdjacente;
            let pesoAresta = parAdjacente.peso;

            if (!nosDefinidos.some(no => no.id === noAdjacente.id)) {
                calcularDistanciaMinima(noAdjacente, pesoAresta, noAtual);
                nosIndefinidos.push(noAdjacente);
            }
        });
        nosDefinidos.push(noAtual);
    }
}

function obterMenorDistancia(nosIndefinidos) {
    let menorDistanciaNo = undefined;
    let menorDistancia = Number.MAX_SAFE_INTEGER;

    nosIndefinidos.forEach(no => {
        let distanciaNo = no.distancia;
        if (distanciaNo < menorDistancia) {
            menorDistancia = distanciaNo;
            menorDistanciaNo = no;
        }
    });

    return menorDistanciaNo;
}

function calcularDistanciaMinima(no, pesoAresta, raiz) {
    let distanciaRaiz = raiz.distancia;

    if (distanciaRaiz + pesoAresta < no.distancia) {
        no.distancia = distanciaRaiz + pesoAresta;
        caminhoMaisCurto = raiz.caminhoMaisCurto;
        caminhoMaisCurto.push(raiz);
        no.caminhoMaisCurto = caminhoMaisCurto;
    }
}

class Grafo {

    constructor(nodes) {
        this.nos = this.converterNos(nodes);
        this.construirAdjacencias();
    }

    converterNos(nodes) {
        let nos = [];
        nodes.forEach(no => {
            nos.push(new No(no));
        });
        return nos;
    }

    construirAdjacencias() {
        this.nos.forEach(no => {
            if (no["idsAdjacentes"] != undefined) {
                no["idsAdjacentes"].forEach(id => {
                    let adjacencia = this.nos.filter(nodeFinded => { return nodeFinded["id"] == id });
                    no.adjacencias.push(adjacencia);
                });
            }
        });
    }

}

class No {

    constructor(no) {
        this.id = no.id;
        this.idsAdjacentes = no.to;
        this.name = no.label;
        this.peso = no.peso;
        this.caminhoMaisCurto = [];
        this.distancia = Number.MAX_SAFE_INTEGER;
        this.adjacencias = [];
    }

    definirDistancia(distancia) {
        this.distancia = distancia
    }

    adicionarDestino(destino, distancia) {
        this.adjacencias.push({ destino, distancia });
    }

}
