const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function main() {
  const transactionId = 'bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U';

  const tx_data = await arweave.transactions.getData(transactionId, {decode: true, string: true});
  console.log('Transaction Data =>', tx_data);

  console.log('------------------------------------------------');

  const tx_tags = await arweave.transactions.get(transactionId);
  console.log('<key> : <value>');
  tx_tags.get('tags').forEach(tag => {
    let key = tag.get('name', {decode: true, string: true});
    let value = tag.get('value', {decode: true, string: true});
    console.log(`${key} : ${value}`);
  });
}

main();

/*
% node get_tx_data.js
Transaction Data =>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARWEAVE / PEER EXPLORER</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js" integrity="sha256-mpnrJ5DpEZZkwkE1ZgkEQQJW/46CSEh/STrZKOB/qoM=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.js" integrity="sha256-qwbDmNVLiCqkqRBpF46q5bjYH11j5cd+K+Y6D3/ja28=" crossorigin="anonymous"></script>

    <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,600,700" rel="stylesheet">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
<script src="https://unpkg.com/arweave/bundles/web.bundle.js"></script>
</head>
<body>
<div id="app">
    <table class="head">
        <thead>
            <tr class="heading">
                <td colspan="4">
                    ARWEAVE / PEER EXPLORER
                </td>
                <td class="controls"  colspan="5">
                    <input type="text" class="input peers-endpoint" placeholder="https://arweave.net/peers" v-model="peers_endpoint" :class="{disabled: this.is_running, error: error}" @click="stop" @keyup.enter="start" ref="input" autofocus>
                    <i v-if="!is_running" class="fas fa-play" v-on:click="start"></i>
                    <i v-if="is_running" class="fas fa-pause" v-on:click="stop"></i>
                </td>
            </tr>
            <tr>
                <td class="col-address">Address</td>
                <td class="col-height">Height</td>
                <td class="col-current">Current Block</td>
                <td class="col-release">Release</td>
                <td class="col-fork">Nodes on fork</td>
                <td class="col-blocks">Blocks</td>
                <td class="col-peers">Peers</td>
                <td class="col-queue">Queue Length</td>
                <td class="col-network">Network</td>
            </tr>
        </thead>
    </table>
    <table class="results">
        <tr v-for="(node, ip) in sortedNodes" v-bind:class="[`group-${node.group}`]">
            <td field="address" class="col-address">
                <a @click="explore(`http://${node.address}/peers`)" target="_blank">
                    {{ node.address }}
                </a>
            </td>
            <td field="height" class="col-height">
                <a
                    v-if="node.response && node.response.height"
                    v-bind:href="`http://${node.ip}:1984/block/height/${node.response.height}`"
                    target="_blank"
                >
                    {{ node.response.height }}
                </a>
            </td>
            <td field="current" class="col-current">
                <a
                    v-if="node.response && node.response.current"
                    v-bind:href="`http://${node.ip}:1984/block/hash/${node.response.current}`"
                    target="_blank"
                >
                    {{ node.response.current }}
                </a>
            </td>
            <td field="release" class="col-release">
                <a
                    v-if="node.response && node.response.release"
                    v-bind:href="`http://${node.ip}:1984`"
                    target="_blank"
                >
                    {{ node.response.release }}
                </a>
            </td>
            <td field="on-fork" class="col-fork">
                    <span v-if="node.onfork">
                        {{ node.onfork }}
                    </span>
            </td>
            <td field="blocks" class="col-blocks">
                <a
                    v-if="node.response && node.response.blocks"
                    v-bind:href="`http://${node.ip}:1984/block/current`"
                    target="_blank"
                >
                    {{ node.response.blocks }}
                </a>
            </td>
            <td field="peers" class="col-peers">
                <a
                    v-if="node.response && node.response.peers"
                    v-bind:href="`http://${node.ip}:1984/peers`"
                    target="_blank"
                >
                    {{ node.response.peers }}
                </a>
            </td>
            <td field="queue_length" class="col-queue">
                <a v-if="node.response && node.response.queue_length !== undefined">
                    {{ node.response.queue_length }}
                </a>
            </td>
            <td field="network" class="col-network">
                <span v-if="node.response" :class="{highlight: node.response.network != 'arweave.N.1'}">
                    {{ node.response.network }}
                </span>
            </td>
        </tr>
    </table>
    <table class="foot">
        <tfoot>
            <tr>
                <td>
                    Total Peers: {{nodes.length}}
                </td>
            </tr>
        </tfoot>
    </table>
</div>
<style>
    body{
        font-family: 'Roboto';
        font-weight: 300;
        background: #2f3035;
        color: #AAA;
        font-size: 12px;
        margin: 0;
    }

    #app{
        width: 100%;
    }

    table{
        border-spacing:0;
        border-collapse: collapse;
        width: 100%;
    }

    thead{
        color: #eee;
        font-weight: 400;
        background: #2f3035;
    }

    tr.heading{
        background: #24252d;
    }

    .controls{
        text-align: right;
    }

    tr{
        height: 50px;
    }

    td{
        border-bottom: 1px solid #444;
        padding: 0 20px;
    }

    td a{
        color: #AAA;
        text-decoration: none;
        cursor: pointer;
    }

    td a:hover{
        text-decoration: underline;
    }

    .group-2{
        background: #3c3d44;
    }

    .group-3{
        background: #46474e;
    }

    .group-4{
        background: #4c4e54;
    }

    .group-5{
        background: #46484e;
    }

    .group-6{
        background: #393a40;
    }

    .group-offline{
        background: #5d5454;
    }

    .highlight {
        color: #FFFF00;
    }

    .input.peers-endpoint{
        color: #AAA;
        text-decoration: none;
        background: transparent;
        border: none;
        font-size: 12px;
        min-width: 200px;
        transition: all .5s ease;
        padding: 10px;
        box-sizing: content-box;
        border-bottom: 1px solid transparent;
    }
    .input.peers-endpoint,
    .input.peers-endpoint:focus{
        outline: none;
    }

    .input.peers-endpoint:focus{
        border-bottom: 1px solid #aaa;
        min-width: 350px;
    }

    .input.peers-endpoint.disabled{
        color: #FFF;
    }

    .input.peers-endpoint.error{
        color: #C62828;
    }


    .col-address{
        width: 11%;
    }

    .col-height{
        width: 7%;
    }

    .col-current{
        width: 32%;
    }

    .col-release{
        width: 10%;
    }

    .col-fork{
        width: 8%;
    }

    .col-blocks{
        width: 8%;
    }

    .col-peers{
        width: 8%;
    }

    .col-queue{
        width: 8%;
    }

    .col-network{
        width: 8%;
    }

    table.head{
        position: fixed;
        top: 0;
    }

    table.foot{
        position: fixed;
        bottom: 0;
    }

    tfoot{
        color: #eee;
        font-weight: 400;
        background: #2f3035;
        background: #24252d;
    }

    tfoot td{
        border: none;
        border-top: 1px solid #444;
        text-align: right;
    }

    table.results{
        margin-top: 100px;
        margin-bottom: 50px;
    }


</style>
<script>
Vue.config.devtools = true

function countNodesPerFork (nodes) {
  const onFork = {}
  _.forEach(nodes, node => {
    if (node.response.hasOwnProperty('current')) {
      const current = node.response.current
      onFork[current] = (onFork[current] || 0) + 1
    }
  })
  return onFork
}


let app = new Vue({
    el: '#app',
    data: () => {
        return {
            is_running: false,
            error: false,
            peers_endpoint: window.location.hostname ? `http://${window.location.hostname}:${window.location.port || 80}/peers` : `http://arweave.net/peers`,
            nodes: []
        }
    },
    computed: {
        sortedNodes: function () {
            let sorted = _(this.nodes)
                .orderBy([
                    ( node ) => {
                        if (node.response.height == 'not_joined') {
                            return -1
                        } else if (node.response.height === undefined) {
                            return -2
                        } else {
                            return node.response.height
                        }
                    },
                    ( node ) => { return (node.response.current || 0)},
                    ( node ) => { return (node.response.release || 0)},
                    ( node ) => { return (node.name || 0)}
                ], ['desc', 'desc', 'desc'])
            .value()
            let heights = [...new Set(sorted.map((node => {return node.response.height})))].sort()
            const onfork = countNodesPerFork(this.nodes)
            return _.map(sorted, function (inputNode) {
                const node = _.clone(inputNode)
                node.group = heights.indexOf(node.response.height)
                if (node.response.height == 0 || (!node.new && Object.keys(node.response).length == 0)) {
                    node.group = 'offline'
                }
                if (node.response.height > 0 && onfork.hasOwnProperty(node.response.current)) {
                    node.onfork = onfork[node.response.current]
                }
                return node
            })
        },
    },
    methods: {
        explore(address){
            this.peers_endpoint = address;
            this.start();
        },
        wait: (milliseconds) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, milliseconds);
            });
        },
        start: async function () {
            this.$refs.input.blur();
            this.is_running = true
            await this.wait(500);
            this.nodes = [];
            let requests = []
            if (await this.fetchNodes()) {
                _.forEach(this.nodes, (node) => this.update(node))
            }
        },
        async fetchNodes(){
            try {
                const nodes = await axios
                    .request({
                        method: 'GET',
                        url: this.peers_endpoint,
                        timeout: 15000
                    });

                this.nodes = nodes.data.map(node => {
                    return {address: node, response: {}};
                });
                return true;
            } catch (error) {
                this.error = true;
                console.error(error);
                return false;
            }

        },
        update: function (node) {
            if (!this.is_running) {return}
            axios
                .request({
                    method: 'GET',
                    url: `http://${node.address}`,
                    timeout: 15000
                }).then( response => {
                    if (!this.is_running) {return}
                    Vue.set(node, 'response', response.data)
                    Vue.set(node, 'new', false)
                    setTimeout(() => {
                        if (!this.is_running) {return}
                        this.update(node)
                    }, 10000)
                }).catch( response => {
                    if (!this.is_running) {return}
                    Vue.set(node, 'response', node.response)
                    Vue.set(node, 'new', false)
                    setTimeout(() => {
                        if (!this.is_running) {return}
                        this.update(node)
                    }, 10000)
                })
        },
        stop: function () {
            this.is_running = false;
            this.error = false;
        }
    },
    mounted: function() {
        this.$refs.input.focus();
    }
})

</script>
</body>
</html>
------------------------------------------------
<key> : <value>
Content-Type : text/html
User-Agent : ArweaveDeploy/1.1.0
*/
