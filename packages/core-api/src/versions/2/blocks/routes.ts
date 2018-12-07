import Hapi from "hapi";
import Controller from "./controller";
import * as Schema from "./schema";

export default function(server: Hapi.Server): void {
  const controller = new Controller();
  server.bind(controller);

  server.route({
    method: "GET",
    path: "/blocks",
    handler: controller.index,
    options: {
      validate: Schema.index,
    },
  });

  server.route({
    method: "GET",
    path: "/blocks/{id}",
    handler: controller.show,
    options: {
      validate: Schema.show,
    },
  });

  server.route({
    method: "GET",
    path: "/blocks/{id}/transactions",
    handler: controller.transactions,
    options: {
      validate: Schema.transactions,
    },
  });

  server.route({
    method: "POST",
    path: "/blocks/search",
    handler: controller.search,
    options: {
      validate: Schema.search,
    },
  });
}