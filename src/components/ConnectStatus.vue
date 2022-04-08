<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h1 m-0 text-gray-800">Connect servers</h1>
    </div>
    <div class="row">
      <div class="mb-4">
        <div class="card shadow mb-4" v-for="connectHost in this.$connectServerList" v-bind:key="connectHost">
          <a target="_blank" rel="nofollow" v-bind:href="connectHost" class="card-header py-3">
            <h4 class="m-0 text-primary">{{ connectHost }}</h4>
          </a>
          <div class="card-body">
            <div v-if="!loadingData && connectStatus[connectHost] !== undefined">
              <span class="badge bg-secondary">version : {{ connectStatus[connectHost].version }}</span>
              &nbsp;
              <span class="badge bg-success">commit : {{ connectStatus[connectHost].commit }}</span>
              &nbsp;
              <span class="badge bg-danger">clusterId : {{ connectStatus[connectHost].kafka_cluster_id }}</span>
            </div>
            <div v-if="!loadingData && connectStatus[connectHost] !== undefined">
              <table class="table">
                <thead>
                <tr>
                  <th scope="col">Plugin name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="plugin in connectorPlugins[connectHost]" v-bind:key="plugin.class">
                  <td>{{ plugin.class }}</td>
                  <td>{{ plugin.type }}</td>
                  <td>{{ plugin.version }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="!loadingData && connectStatus[connectHost] === undefined" class="text-center">
              <p>Please check connect clusters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'ConnectStatus',
  data: function () {
    return {
      connectStatus: {},
      connectorPlugins: {},
      loadingData: true
    }
  },
  created() {
    this.getConnectInformation()
  },
  methods: {
    getConnectInformation() {
      let requests = []
      let index = 0;
      for (const host of this.$connectServerList) {
        requests[index++] = axios.get(host + "/")
            .then(res => {
              this.connectStatus[host] = res.data;
            })
            .catch(err => {
              console.log(err);
            });

        requests[index++] = axios.get(host + "/connector-plugins")
            .then(res => {
              this.connectorPlugins[host] = res.data;
            })
            .catch(err => {
              console.log(err);
            });
      }

      let self = this;
      Promise.all(requests).then(function () {
        self.loadingData = false;
      });
    }
  }
}
</script>