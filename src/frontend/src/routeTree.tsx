import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import DesignPage from "./pages/DesignPage";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const designRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design",
  component: DesignPage,
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/result/$jobId",
  component: ResultPage,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  designRoute,
  resultRoute,
]);
