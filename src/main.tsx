import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/Layout/App";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Provider store={store}> */}
      {/* <Provider store={store}> */}
      {/* <Provider store={store}> */}
      {/* <Provider store={store}> */}

      {/* <Provider store={store}>
      <div className="main-body">
        <Router />
        <Toaster />
      </div>
    </Provider> */}
      <App />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
