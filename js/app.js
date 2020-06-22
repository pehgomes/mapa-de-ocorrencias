let color = 'blue';
let len = undefined;
let grafo;
let continuaMovimentacao = true;
let marcouOcorrencia = false;
let arestasConvertidasEmArray;
let posicaoViatura;
let paraDeVez = false;

let nodes = [
    { id: 0, label: "A", color: '#7847d3', to: [1, 2, 6], ocorrencia: false, viatura: false },
    { id: 1, label: "B", color: '#7847d3', to: [0, 3, 5, 6], ocorrencia: false, viatura: false },
    { id: 2, label: "C", color: '#7847d3', to: [0, 4, 6], ocorrencia: false, viatura: false },
    { id: 3, label: "D", color: '#7847d3', to: [4, 5, 1, 7], ocorrencia: false, viatura: false },
    { id: 4, label: "E", color: '#7847d3', to: [5, 3, 2, 7], ocorrencia: false, viatura: false },
    { id: 5, label: "F", color: '#7847d3', to: [4, 3, 1], ocorrencia: false, viatura: false },

    { id: 6, label: "G", color: '#7847d3', to: [0, 2, 1, 7], ocorrencia: false, viatura: false },
    { id: 7, label: "H", color: '#7847d3', to: [3, 4, 6], ocorrencia: false, viatura: false }
];
let edges = [
    { from: 0, to: 1, w: 10, label: '10 km' },
    { from: 0, to: 2, w: 15, label: '15 km' },
    { from: 1, to: 3, w: 7, label: '7 km' },
    { from: 1, to: 5, w: 2.1, label: '2.1 km' },
    { from: 2, to: 4, w: 10, label: '10 km' },
    { from: 3, to: 4, w: 2, label: '2 km' },
    { from: 3, to: 5, w: 1, label: '1 km' },
    { from: 5, to: 4, w: 5.4, label: '5.4 km' },
    { from: 6, to: 0, w: 6, label: '6 km' },
    { from: 6, to: 2, w: 7, label: '7 km' },
    { from: 6, to: 1, w: 12.6, label: '12.6 km' },
    { from: 6, to: 7, w: 14.7, label: '14.7 km' },
    { from: 7, to: 3, w: 1.3, label: '1.3 km' },
    { from: 7, to: 4, w: 3.5, label: '3.5 km' },
]

var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    physics: false,
    nodes: {
        color: '#7847d3',
        shape: 'dot',
        size: 10,
        font: {
            size: 25,
            color: '#FFFFFF'

        },
        borderWidth: 2
    },
    edges: {
        width: 2,
        color: '#04d361',
        smooth: false,
        font: {
            size: 12,
            color: '#000000'
        }
    }, interaction: {
        zoomView: false,
        dragView: false
    }
};
network = new vis.Network(container, data, options);
network.enableEditMode();

movimentarViatura(false);
function percorrer(indice, tempo) {
    (function (index) {
        setTimeout(function () { marcarViatura(index); }, tempo * 1000);
    })(indice);
}

function movimentarViatura(pontoDePartida) {
    if (paraDeVez) {
        return;
    }
    if (continuaMovimentacao) {
        var len = network.body.data.nodes.length;
        for (var i = 0; i <= len; i++) {
            (function (index) {
                setTimeout(function () { marcarViatura(index); }, i * 1000);
            })(i);
        }

        setTimeout(function () { movimentarViatura(false) }, 8000);

    }

}

function marcarViatura(x) {
    if (continuaMovimentacao) {
        var to = [];
        var node = network.body.nodes[x];
        if (node != undefined) {
            let img = 'img/car.png';
            if (node.options.ocorrencia) {
                img = 'img/prisao.png';
            }
            desmarcarArestas();
            node.setOptions({ size: 20, image: img, shape: 'image' });
            to = node['options']['to'];
            to.forEach(toNode => marcarAresta(node.id, toNode, false));
            node['options']['viatura'] = true;
            nodes[x]['viatura'] = true;
        }
        network.moveTo({ scale: 1 });


        desmarcarViatura(x);
    }
}

function desmarcarViatura(id) {
    var node;
    if (id != 0) {
        node = network.body.nodes[id - 1]
        /* node['selected'] = false; */
        if (node != undefined) {
            delete node['options']['image']
            node.setOptions({ size: 10, shape: 'dot' });
            node['options']['viatura'] = false;
            nodes[id - 1]['viatura'] = false;
        }

    }
}

function reordenar() {
    location.reload();
}

function add() {
    nodes.push({ id: 1, label: 'Main', image: './viatura.png', shape: 'image' });
}

function marcarOcorrencia() {
    if (marcouOcorrencia) {
        return;
    }
    let len = network.body.data.nodes.length;
    let nos = [];
    for (var x = 0; x < len; x++) {
        nos.push(network.body.nodes[x]);
    }

    let marcadosFiltro = nos.filter(nodeFinded => { return nodeFinded["selected"] });
    if (marcadosFiltro[0] != undefined) {
        let marcado = marcadosFiltro[0];
        marcarCor(marcado);
        continuaMovimentacao = false;
    } else {
        let indiceOcorrencia = Math.floor(Math.random() * 6);
        let indiceViatura = nodes.indexOf(buscarViatura());
        if (indiceViatura == indiceOcorrencia) {
            indiceOcorrencia = Math.floor(Math.random() * indiceViatura);
        }
        let marcado = nos[indiceOcorrencia];
        marcarCor(marcado);
        continuaMovimentacao = false;
    }
    marcouOcorrencia = true;
}

function marcarCor(node) {
    node.setOptions({ size: 25, image: 'img/hacker.png', shape: 'image', ocorrencia: true });
    let noGrafo = buscarPorId(node.id);
    noGrafo["ocorrencia"] = true;
    network.moveTo({ scale: 1 });
}

function marcarAresta(from, to, mudaCor) {
    let arestas = network.edgesHandler.body.edgeIndices;
    let arestasArray = [];
    arestas.forEach(a => arestasArray.push(network.body.edges[a]));
    arestasConvertidasEmArray = arestasArray;

    let aresta = arestasArray.filter(aresta => { return aresta["fromId"] == from && aresta["toId"] == to })[0];

    if (aresta == undefined) {
        aresta = arestasArray.filter(aresta => { return aresta["fromId"] == to && aresta["toId"] == from })[0];
    }
    if (aresta != undefined) {
        aresta["selected"] = true;
        if (mudaCor) {
            aresta.setOptions({ color: '#FF0000' });
        }
    }

    arestaAnterior = aresta;
}

function desmarcarArestas() {
    if (arestasConvertidasEmArray != undefined) {
        let marcadas = arestasConvertidasEmArray.filter(aresta => { return aresta["selected"] });
        marcadas.forEach(marcada => marcada["selected"] = false);
    }
}

function buscarPorId(id) {
    let nosFiltrados = nodes.filter(nodeFinded => { return nodeFinded["id"] == id });
    return nosFiltrados[0];
}

function buscarViatura() {
    let nosFiltrados = nodes.filter(nodeFinded => { return nodeFinded["viatura"] });
    return nosFiltrados[0];
}

function buscarOccorencia() {
    let nosFiltrados = nodes.filter(nodeFinded => { return nodeFinded["ocorrencia"] });
    return nosFiltrados[0];
}


// #####################################################################################################################

function mostrarCaminho() {
    let ids = [];
    let path = posicaoViatura.caminhoMaisCurto;
    path = path.forEach(p => ids.push(p.id));
    for (var i = 0; i < ids.length; i++) {
        let arestaBusca = ids[i + 1];
        if (arestaBusca == undefined) {
            arestaBusca = posicaoViatura.id;
        }
        marcarAresta(ids[i], arestaBusca, true)
    }

    paraDeVez = true;
    network.moveTo({ scale: 1 });
}

function caminhoMinimoOcorrencia() {
    let indiceOcorrencia = nodes.indexOf(buscarOccorencia());
    posicaoViatura = grafo.nos[indiceOcorrencia];
    let textAnt = '';

    document.getElementById("caminhos").innerHTML = '';
    posicaoViatura.caminhoMaisCurto.forEach(caminhoMaisCurto => {
        textAnt = textAnt + document.getElementById("caminhos").innerHTML;
        textAnt = textAnt + caminhoMaisCurto.name + " <img src='img/next.png'> " + "";
    });
    textAnt = textAnt + posicaoViatura.name;

    var result = document.querySelector('#result');
    var titulo = document.querySelector('#titulo');
    var caminhos = document.querySelector('#caminhos');
    var img = document.querySelector('#img');
    var distancia = document.querySelector('#distancia');

    document.getElementById("caminhos").innerHTML = '';

    result.style.opacity = 0;

    setTimeout(function () {
        titulo.innerHTML = 'Rota'
        caminhos.innerHTML = textAnt;
        img.src = 'img/distance1.png';
        distancia.innerHTML = posicaoViatura.distancia + ' KM';
        result.style.opacity = 1;
    }, 500);
    mostrarCaminho();
}

function dijkstra() {
    grafo = new Grafo(nodes);
    let indiceViatura = nodes.indexOf(buscarViatura());
    let raiz = grafo.nos[indiceViatura];
    calcularCaminhosMaisCurtos(grafo, raiz);
    caminhoMinimoOcorrencia();
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
        aux = [];
        raiz.caminhoMaisCurto.forEach(caminhoCurto => aux.push(caminhoCurto));
        aux.push(raiz);
        no['caminhoMaisCurto'] = aux;
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
                    if (aresta == undefined) {
                        aresta = this.buscarAresta(adjacencia.id, no.id);
                    }
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
        this.ocorrencia = no.ocorrencia;
        this.idsAdjacentes = no.to;
        this.name = no.label;
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
