

let color = 'blue';
let len = undefined;

let nodes = [
    { id: 0, label: "A", color: '#7847d3', to: [1, 2], peso: 2 },
    { id: 1, label: "B", color: '#7847d3', to: [3, 5], peso: 6 },
    { id: 2, label: "C", color: '#7847d3', to: [4], peso: 5 },
    { id: 3, label: "D", color: '#7847d3', to: [4, 5], peso: 4 },
    { id: 4, label: "E", color: '#7847d3', peso: 2 },
    { id: 5, label: "F", color: '#7847d3', to: [4], peso: 1 },
    // { id: 6, label: "F", color: '#6E6EFD' , peso: 2}
    // { id: 7, label: "7", color: '#6E6EFD', to: [6, 0] , peso: 2},
    // { id: 8, label: "8", color: '#6E6EFD', to: [7, 3] , peso: 2},
    // { id: 9, label: "9", color: '#6E6EFD' , peso: 2},
    // { id: 10, label: "10", color: '#6E6EFD', to: [9, 4] , peso: 1},

];
let edges = [
    { from: 0, to: 1, w: 10, label: '10 km' },
    { from: 0, to: 2, w: 15, label: '15 km' },
    { from: 1, to: 3, w: 12, label: '12 km' },
    { from: 1, to: 5, w: 15, label: '15 km' },
    { from: 2, to: 4, w: 10, label: '10 km' },
    { from: 3, to: 4, w: 2, label: '2 km' },
    { from: 3, to: 5, w: 1, label: '1 km' },
    { from: 5, to: 4, w: 5, label: '5 km' }
    //{ from: 10, to: 9 },
    //{ from: 10, to: 4 },
    //{ from: 1, to: 6 },
    //{ from: 8, to: 3 },
    //{ from: 3, to: 5 }
]

var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    physics: false,
    nodes: {
        color:'#7847d3',
        shape: 'dot',
        size: 15,
        font: {
            size: 15,
            color: '#ffffff'
        },
        borderWidth: 2
    },
    edges: {
        width: 2,
        color: '#04d361',
          smooth: false,
          font: {
              size: 15,
              color: '#000000'
          }
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



function dijkstra() {
    let grafo = new Grafo(nodes)
    let raiz = grafo.nos[0];
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
            let noAdjacente = parAdjacente.destino;
            let pesoAresta = parAdjacente.distancia;

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
                    let adjacenciaFiltrada = this.nos.filter(nodeFinded => { return nodeFinded["id"] == id });
                    let adjacencia = adjacenciaFiltrada[0];
                    let aresta = this.buscarAresta(no.id, adjacencia.id);
                    no.adicionarDestino(adjacencia, aresta.w);
                });
            }
        });
    }

    buscarAresta(de, para) {
        let aresta = edges.filter(aresta => { return aresta['from'] == de && aresta['to'] == para });
        return aresta[0];
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
