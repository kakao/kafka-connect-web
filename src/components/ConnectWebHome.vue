<template>

  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h1 mb-0 text-gray-800">Conenct-web Home</h1>
    </div>
    <div class="row">

      <div class="col">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-secondary">Kafka connect</h6>
          </div>
          <div class="card-body">
            <div class="text-center">
              <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;"
                   src="@/assets/kafka.png">
            </div>
            <p>Kafka Connect is a tool for scalably and reliably streaming data between Apache Kafka and other systems.</p>
            <ul>
              <li><strong>Connect cluster</strong></li>
              <li><strong>Connector</strong>
                <ul>
                  <li><strong>Source connector</strong></li>
                  <li><strong>Sink connector</strong></li>
                </ul>
              </li>
            </ul>
            <a target="_blank" rel="nofollow" href="https://docs.confluent.io/platform/current/connect/index.html">Read more</a>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

export default {
  name: 'ConnectWebHome'
}
</script>