import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlay,
  faForwardStep,
  faPause,
  faRotate,
  faCode,
  faSortDown,
  faBackwardStep,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";

import "./assets/main.css";

library.add(
  faPlay,
  faForwardStep,
  faPause,
  faRotate,
  faCode,
  faSortDown,
  faBackwardStep,
  faShuffle
);

const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
