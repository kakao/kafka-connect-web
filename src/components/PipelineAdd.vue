<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h1 m-0 text-gray-800">Generate new pipeline</h1>
    </div>
    <div class="row">
      <div class="mb-4">
        <div class="card shadow mb-4">
          <div class="card-body">
            <div>
              <div class="form-group">
                <label>Connector pipeline name</label>
                <input class="form-control mb-3" v-model="pipelineName">
                <label>Connect cluster</label>
                <select class="form-select mb-3" v-model="selectedConnectServer">
                  <option v-for="connectServer in this.$connectServerList"
                          v-bind:key="connectServer">
                    {{ connectServer }}
                  </option>
                </select>
                <label>Connector class</label>
                <select class="form-select mb-3" v-model="selectedConnector">
                  <option v-for="connectorClassName in connectorClasses"
                          v-bind:key="connectorClassName">
                    {{ connectorClassName }}
                  </option>
                </select>
                <h4>Connector detail configs</h4>
                <div class="mb-3" ref="pipelineConfigJsonEditor"></div>
              </div>
              <button class="btn btn-dark form-control"
                      v-on:click="NewPipelineModalOpen">
                Create new pipeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createNewPipelineModal" ref="createNewPipelineModal" tabindex="-1"
         aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new pipeline</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div ref="newConfigJsonEditor"></div>
              </div>
              <hr>
              <div class="row">
                <h5> Do you want to make this connector pipeline in {{ this.selectedConnectServer }}?</h5>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="createNewPipeline">
              Submit
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.js'
import 'jsoneditor/dist/jsoneditor.min.css'
import {Modal} from 'bootstrap'
import axios from "axios";

export default {
  name: 'PipelineAdd',
  data: function () {
    return {
      pipelineConfigJsonEditor: null,
      newPipelineJsonEditor: null,
      pipelineName: "",
      sourceTopic: "",
      connectorClasses: [],
      selectedConnectServer: this.$connectServerList[0],
      selectedConnector: ""
    }
  },
  mounted() {
    let sampleConfig = {}
    sampleConfig["tasks.max"] = 1;
    sampleConfig["topics"] = "test-topic";

    this.pipelineConfigJsonEditor = new JSONEditor(this.$refs.pipelineConfigJsonEditor)
    this.pipelineConfigJsonEditor.set(sampleConfig);
    this.pipelineConfigJsonEditor.setMode("code");
    this.newPipelineJsonEditor = new JSONEditor(this.$refs.newConfigJsonEditor)
    this.myModal = new Modal(this.$refs.createNewPipelineModal, {})
    this.getConnectorClass();
  },
  watch: {
    selectedConnectServer: function () {
      this.getConnectorClass();
    }
  },
  methods: {
    getConnectorClass() {
      let classes = [];
      let self = this;
      axios.get(this.selectedConnectServer + "/connector-plugins")
          .then(res => {
            res.data.forEach(function (data) {
              classes.push(data["class"]);
              self.connectorClasses = classes;
              self.selectedConnector = classes[0];
            })
          })
          .catch(err => {
            console.log(err);
            self.connectorClasses = classes;
          });
    }, createNewPipeline() {
      axios.post(this.selectedConnectServer + "/connectors/",
          this.newPipelineJsonEditor.get()
      ).then(res => {
        console.log(res.data);
        this.$router.push({name: "PipelineList", params: {message: this.pipelineName + " is created."}});
      }).catch(err => {
        console.log(err);
        alert(err.message);
      });
    }
    ,
    NewPipelineModalOpen() {
      if (this.pipelineName === "") {
        alert("You must enter the pipeline name.")
        return
      }
      let pipeline = {};
      pipeline["name"] = this.pipelineName;
      let config = this.pipelineConfigJsonEditor.get();
      config["connector.class"] = this.selectedConnector;
      pipeline.config = config;
      this.newPipelineJsonEditor.set(pipeline);
      this.newPipelineJsonEditor.setMode("view");
      this.newPipelineJsonEditor.expandAll();
      this.myModal.show();

    }
  }
}
</script>