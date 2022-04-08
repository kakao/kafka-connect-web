<template>
  <div class="container-fluid">

    <div aria-live="polite" aria-atomic="true" class="position-relative fixed-top">
      <div class="toast-container position-absolute top-0 end-0 p-3">

        <div v-for="toast in toasts" v-bind:key="toast.timestamp">
          <div class="toast show align-items-center text-white border-0"
               :class="{ 'bg-primary' : toast.type==='OK', 'bg-danger' : toast.type==='ERROR' }">
            <div class="d-flex">
              <div class="toast-body">
                {{ toast.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overlay" v-if="loadingData">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" style="width: 6rem; height: 6rem;" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h1 m-0 text-gray-800">Connector pipeline list</h1>
    </div>

    <div>
      <label for="searchPipeline"><strong>Search pipeline name(More than 2 letters)</strong></label>
      <input class="form-control" id="searchPipeline" v-model="searchPipeline"><br>
    </div>

    <div class="row">
      <div class="mb-4">
        <div v-for="connectHost in this.$connectServerList" v-bind:key="connectHost">
          <div class="card shadow mb-4" v-if="!loadingData
                                              && searchedPipelineLists[connectHost] !== undefined
                                              && searchedPipelineLists[connectHost].length > 0">
            <div class="card-header py-3">
              <h4 class="m-0 text-secondary">{{ connectHost }}</h4>
            </div>
            <div class="card-body">
              <table class="table" v-if="searchedPipelineLists[connectHost].length > 0">
                <thead>
                <tr>
                  <th>Status</th>
                  <th>Pipeline<br>name</th>
                  <th>tasks.max<br>num</th>
                  <th>Pipeline<br>details</th>
                  <th>Change<br>configs</th>
                  <th>Change<br>status</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="pipelineName in searchedPipelineLists[connectHost]"
                    v-bind:key="pipelineName+pipelineStatus[pipelineName].connector.state">
                  <td>
                    <p v-if="pipelineStatus[pipelineName].connector.state ==='RUNNING'"
                       class="text-success">
                      <strong>
                        {{ pipelineStatus[pipelineName].connector.state }}
                      </strong>
                    </p>
                    <p v-else>
                      <strong>
                        {{ pipelineStatus[pipelineName].connector.state }}
                      </strong>
                    </p>
                  </td>
                  <td>{{ pipelineName }}
                  </td>
                  <td>{{ pipelineConfig[pipelineName]["tasks.max"] }}</td>
                  <td>
                    <i class="bi-card-list" style="font-size: 2rem; color: black;"
                       v-on:click="openDetailPage(pipelineName)"
                    ></i>
                  </td>
                  <td><i class="bi-gear-fill" style="font-size: 2rem; color: black;"
                         data-bs-toggle="modal" data-bs-target="#pipelineChangeConfigModal"
                         v-on:click="changeConfigModal(connectHost, pipelineName)"
                  ></i>
                  </td>
                  <td><i class="bi-skip-end-circle-fill" style="font-size: 2rem; color: black;"
                         data-bs-toggle="modal" data-bs-target="#pipelineChangeStatusModal"
                         v-on:click="changeStatusModal(connectHost, pipelineName)"
                  ></i>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="pipelineChangeConfigModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalPipelineName }} pipeline change configs.</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div ref="changeConfigJsonEditor"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="modifyConfigs">Confirm
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>


    <div class="modal fade" id="pipelineChangeStatusModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalPipelineName }} pipeline change status.</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul>
              <li>Resume : Resume pipeline.</li>
              <li>Pause : Pause pipeline.</li>
              <li>Delete : Permanently delete pipeline.</li>
            </ul>
          </div>
          <div class="modal-footer justify-content-between">
            <button v-if="modalPipelineState !=='RUNNING'"
                    type="button" class="btn btn-danger mr-auto" data-bs-dismiss="modal"
                    data-bs-toggle="modal" data-bs-target="#pipelineDeleteModal">
              Delete
            </button>
            <div>
              <button v-if="modalPipelineState !=='RUNNING'" type="button" class="btn btn-primary"
                      data-bs-dismiss="modal" v-on:click="resumePipeline">Resume
              </button>
              &nbsp;
              <button v-if="modalPipelineState ==='RUNNING'" type="button" class="btn btn-primary"
                      data-bs-dismiss="modal" v-on:click="pausePipeline">Pause
              </button>
              &nbsp;
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="modal fade" id="pipelineDeleteModal" ref="pipelineDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete {{ modalPipelineName }} pipeline.</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <h4>Are you sure you want to delete the pipeline?<br>This command can't be reversed.</h4>
                <p>If you want to delete it, enter the pipeline name in the box below.</p>
                <input class="form-control" id="sourceTopic" v-model="deleteTargetPipeline"><br>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                    v-bind:disabled="this.deleteTargetPipeline !== this.modalPipelineName"
                    v-on:click="deletePipeline">Delete
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";
import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.js'
import 'jsoneditor/dist/jsoneditor.min.css'

export default {
  name: 'PipelineList',
  data: function () {
    return {
      pipelineLists: {},
      searchedPipelineLists: {},
      pipelineStatus: {},
      pipelineConfig: {},
      modalPipelineState: "",
      modalHost: "",
      modalPipelineName: "",
      changeConfigJsonEditor: null,
      loadingData: true,
      toasts: [],
      timer: null,
      deleteTargetPipeline: "",
      searchPipeline: ""
    }
  },
  watch: {
    searchPipeline: function (searchValue) {
      if (searchValue.length > 1) {
        console.log(searchValue)
        for (const host of this.$connectServerList) {
          console.log("host:" + host)
          this.searchedPipelineLists[host] = this.pipelineLists[host].filter(function (item) {
            return item.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
          });
        }
      } else {
        for (const host of this.$connectServerList) {
          this.searchedPipelineLists[host] = this.pipelineLists[host];
        }
      }
    }
  },
  mounted() {
    let self = this;
    this.changeConfigJsonEditor = new JSONEditor(this.$refs.changeConfigJsonEditor)
    this.timer = setInterval(() => {
      self.checkToastMessageExpired()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    this.getPipelineList()
    this.getVueRouteParam()
  },
  methods: {
    getPipelineList() {
      let requests = [];
      let index = 0;
      // get pipeline names
      for (const host of this.$connectServerList) {
        requests[index++] = axios.get(host + "/connectors")
            .then(res => {
              this.pipelineLists[host] = res.data;
              this.searchedPipelineLists[host] = res.data;
            })
            .catch(err => {
              console.log(err);
            });
      }
      // all axios request finished
      let self = this;
      Promise.all(requests).then(function () {
        self.getPipelineDetails();
      });
    }, getPipelineDetails() {
      let requests = []
      let index = 0;

      // get pipeline details
      for (const host of this.$connectServerList) {
        console.log(host);
        for (const pipelineName of this.pipelineLists[host]) {
          requests[index++] = axios.get(host + "/connectors/" + pipelineName + "/status")
              .then(res => {
                this.pipelineStatus[pipelineName] = res.data;
              })
              .catch(err => {
                console.log(err);
              });
          requests[index++] = axios.get(host + "/connectors/" + pipelineName + "/config")
              .then(res => {
                this.pipelineConfig[pipelineName] = res.data;
              })
              .catch(err => {
                console.log(err);
              });
        }
      }

      // all axios request finished
      let self = this;
      Promise.all(requests).then(function () {
        self.loadingData = false;
      });

    }, openDetailPage: function (pipelineName) {
      let router = this.$router;
      router.push({path: '/PipelineDetail', query: {pipeline: pipelineName}})
    }, changeConfigModal: function (connectorHost, pipelineName) {
      this.modalHost = connectorHost;
      this.modalPipelineName = pipelineName;
      this.changeConfigJsonEditor.set(this.pipelineConfig[pipelineName]);
      this.changeConfigJsonEditor.setMode("code");
    }, changeStatusModal: function (connectorHost, pipelineName) {
      this.modalHost = connectorHost;
      this.modalPipelineName = pipelineName;
      this.modalPipelineState = this.pipelineStatus[pipelineName].connector.state;
    }, resumePipeline: function () {
      let self = this;
      self.loadingData = true;
      axios.put(this.modalHost + "/connectors/" + this.modalPipelineName + "/resume")
          .then(res => {
            console.log(res.data);
            this.toast("OK", this.modalPipelineName + " is resumed.");
          })
          .catch(err => {
            console.log(err);
          }).finally(function () {
        setTimeout(() => {
          self.getPipelineList()
        }, 2000);
      });
    }, pausePipeline: function () {
      let self = this;
      self.loadingData = true;
      axios.put(this.modalHost + "/connectors/" + this.modalPipelineName + "/pause")
          .then(res => {
            console.log(res.data);
            this.toast("OK", this.modalPipelineName + " is paused.");
            self.searchPipeline = "";
          })
          .catch(err => {
            console.log(err);
          }).finally(function () {
        setTimeout(() => {
          self.getPipelineList()
        }, 2000);
      });
    }, modifyConfigs: function () {
      let self = this;
      self.loadingData = true;
      let validationError = this.changeConfigJsonEditor.validate();
      validationError.then((error) => {
        if (error.length > 0) {
          alert("Please check JSON schema.");
          self.loadingData = false;
        } else {
          axios.put(this.modalHost + "/connectors/" + this.modalPipelineName + "/config",
              self.changeConfigJsonEditor.get())
              .then(res => {
                console.log(res.data);
                this.toast("OK", this.modalPipelineName + " is changed configs.");
                self.searchPipeline = "";
              })
              .catch(err => {
                console.log(err);
              }).finally(function () {
            setTimeout(() => {
              self.getPipelineList()
            }, 2000);
          });
        }
      });
    }, deletePipeline: function () {
      let self = this;
      self.loadingData = true;
      axios.delete(this.modalHost + "/connectors/" + this.modalPipelineName)
          .then(res => {
            console.log(res.data);
            this.toast("OK", this.modalPipelineName + " is deleted.");
            self.searchPipeline = "";
          })
          .catch(err => {
            console.log(err);
          }).finally(function () {
        setTimeout(() => {
          self.getPipelineList()
        }, 2000);
      });
    },
    checkToastMessageExpired() {
      let self = this;
      this.toasts.forEach(function (toast, index) {
            let endDate = new Date();
            let seconds = (endDate.getTime() - toast.timestamp) / 1000;
            if (seconds > 8) {
              self.toasts.splice(index, 1);
            }
          }
      );
    }, getVueRouteParam() {
      if (typeof (this.$route.params.message) !== "undefined")
        this.toast("OK", this.$route.params.message);
    }, toast(type, message) {
      const toastMessage = {};
      toastMessage.type = type;
      toastMessage.message = message
      toastMessage.timestamp = Date.now();
      this.toasts.push(toastMessage);
    }
  }
}
</script>

<style>

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 40%;
  left: 0px;
}
</style>