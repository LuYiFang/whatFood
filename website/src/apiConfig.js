const env = process.env.REACT_APP_ENV;

const appRoot = process.env.REACT_APP_API_ROOT;

export const api = {
  env: env,
  restaurants: appRoot + "/restaurants",
};
