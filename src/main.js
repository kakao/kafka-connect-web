import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";

import PipelineList from './components/PipelineList.vue';
import PipelineAdd from './components/PipelineAdd.vue';
import PipelineDetail from './components/PipelineDetail.vue';
import ConnectStatus from './components/ConnectStatus.vue';
import ConnectWebHome from './components/ConnectWebHome.vue';
import axios from 'axios';

const username = process.env.VUE_APP_AUTH_USERNAME;
const password = process.env.VUE_APP_AUTH_PASSWORD;
if (username && password) {
    const token = window.btoa(`${username}:${password}`);
    axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
}

Vue.use(VueRouter);

const connectCluster = process.env.VUE_APP_CONNECT_SERVERS != null ?
    process.env.VUE_APP_CONNECT_SERVERS : "VUE_APP_CONNECT_SERVERS_DOCKER_ENV";
Vue.prototype.$connectServerList = connectCluster.indexOf(',') > -1 ?
    connectCluster.split(',') : [connectCluster]

const router = new VueRouter({
    routes: [
        {path: '/', component: ConnectWebHome},
        {path: '/PipelineList', name: 'PipelineList', component: PipelineList},
        {path: '/PipelineAdd', name: 'PipelineAdd', component: PipelineAdd},
        {path: '/PipelineDetail', name: 'PipelineDetail', component: PipelineDetail, props: true},
        {path: '/ConnectStatus', name: 'ConnectStatus', component: ConnectStatus},
        {path: '*', component: ConnectWebHome}
    ]
});

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
