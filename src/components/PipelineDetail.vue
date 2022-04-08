<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h1 m-0 text-gray-800">Pipeline details</h1>
    </div>

    <div class="row">
      <div class="card shadow mb-4">
        <div class="card-body">
          <h4>{{ targetPipelineName }}</h4>
          <div ref="configJsonEditor"></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="card shadow mb-4">
        <div class="card-body">
          <h4>Pipeline status</h4>
          <div ref="statusJsonEditor"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import JSONEditor from "jsoneditor/dist/jsoneditor-minimalist";

export default {
  name: 'PipelineDetail',
  data: function () {
    return {
      targetPipelineName: this.$route.query.pipeline,
      pipelineConfig: {},
      configJsonEditor: null,
      statusJsonEditor: null,
      pipelineLists: []
    }
  },
  mounted() {
    this.configJsonEditor = new JSONEditor(this.$refs.configJsonEditor)
    this.statusJsonEditor = new JSONEditor(this.$refs.statusJsonEditor)
    this.getConnectorPipelines();
  },
  methods: {
    initializePipelineDetails() {
      let pipelineName = this.targetPipelineName;
      let pipelineHost = "";
      for (const host of this.$connectServerList) {
        if (this.pipelineLists[host].indexOf(pipelineName) !== -1) {
          pipelineHost = host;
          break;
        }
      }

      axios.get(pipelineHost + "/connectors/" + pipelineName + "/config")
          .then(res => {
            this.configJsonEditor.set(res.data);
            this.configJsonEditor.setMode("view");
            this.configJsonEditor.expandAll();
          })
          .catch(err => {
            console.log(err);
          });

      axios.get(pipelineHost + "/connectors/" + pipelineName + "/status")
          .then(res => {
            this.statusJsonEditor.set(res.data);
            this.statusJsonEditor.setMode("view");
            this.statusJsonEditor.expandAll();
          })
          .catch(err => {
            console.log(err);
          });
    },
    getConnectorPipelines() {
      let requests = [];
      let index = 0;
      let self = this;
      for (const host of this.$connectServerList) {
        requests[index++] = axios.get(host + "/connectors")
            .then(res => {
              this.pipelineLists[host] = res.data;
            })
            .catch(err => {
              console.log(err);
            });
      }
      Promise.all(requests).then(function () {
        self.initializePipelineDetails();
      });
    }
  }
}
</script>