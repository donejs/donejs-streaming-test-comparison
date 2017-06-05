# HTTP2 Streaming Strategies

This project demos a couple of methods for utilizing HTTP2 PUSH. One is a traditional single page JavaScript application that uses HTTP2 PUSH to push the client JavaScript and the API data stream (simulating a streaming database layer) all to the client at once. The other is a specialized "incremental rendering" approach that sends rendering instructions to the client which then applies them as they arrive. Read more in the [blog article](https://www.bitovi.com/blog/utilizing-http2-push-in-a-single-page-application) on this experiment.
