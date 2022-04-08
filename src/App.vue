<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-auto bg-dark sticky-top">
          <div class="d-flex flex-sm-column flex-row flex-nowrap align-items-center sticky-top">
            <ul class="nav flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center font-weight-light">
              <li class="mt-4 nav-item text-light ">
                <router-link class="" to="/">
                    <i class="bi-house text-light" style="font-size:2rem;"></i>
                </router-link>
                <br>Home
              </li>
              <li class="mt-3 nav-item text-light">
                <router-link to="/PipelineList">
                    <i class="bi-list-ul text-light" style="font-size: 2rem;"></i>
                </router-link>
                <br>List
              </li>
              <li class="mt-3 nav-item text-light">
                <router-link to="/PipelineAdd">
                  <i class="bi-node-plus text-light" style="font-size: 2rem;"></i>
                </router-link>
                <br>Add
              </li>
              <li class="mt-3 nav-item text-light">
                <router-link to="/ConnectStatus">
                  <i class="bi-menu-button-wide text-light" style="font-size: 2rem;"></i>
                </router-link>
                <br>Servers
              </li>
            </ul>
          </div>
        </div>
        <div class="col-sm p-3 min-vh-100">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>


<style>
.container-fluid {
  margin: 0;
  background-color: #EEEEEE;
}
</style>