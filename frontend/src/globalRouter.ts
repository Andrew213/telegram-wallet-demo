import {NavigateFunction} from "react-router-dom";

const globalRouter: {
  navigate: null | NavigateFunction;
} = {navigate: null};

export default globalRouter;
