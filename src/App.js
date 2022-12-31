import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
        <Route exact path="/" component={Products} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/checkout" component={Checkout} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
