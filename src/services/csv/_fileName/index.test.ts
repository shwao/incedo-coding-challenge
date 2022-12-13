import ava, { TestFn } from "ava";
import fs from "fs";
import path from "path";

import { buildServer, ServerInstance } from "../../../server";

const test = ava as TestFn<{ server: ServerInstance }>;

test.beforeEach((t) =>
{
	t.context.server = buildServer({
		serverOptions: {
			disableRequestLogging: true,
		},
	});
});

test.afterEach((t) =>
{
	t.context.server.close();
});

test("GET /csv/:fileName should return error because of missing fileName", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/csv/",
	});

	t.is(response.statusCode, 400);
	t.is(response.json().error, "Bad Request");
	t.is(response.json().message, "params/fileName must NOT have fewer than 1 characters");
});

test("GET /csv/:fileName should return error because file does not exist", async (t) =>
{
	const { server } = t.context;

	const response = await server.inject({
		method: "GET",
		url: "/csv/does-not-exist",
	});

	t.is(response.statusCode, 404);
	t.is(response.json().error, "Not Found");
	t.is(response.json().message, "File not found");
});

test("GET /csv/:fileName should return csv", async (t) =>
{
	const { server } = t.context;

	fs.writeFileSync(path.resolve("./csv-files/get-as-file-test.csv"), "test");

	const response = await server.inject({
		method: "GET",
		url: "/csv/get-as-file-test",
	});

	t.is(response.statusCode, 200);
	t.is(response.body, "test");
	t.is(response.headers["content-type"], "text/csv");
	t.is(response.headers["content-disposition"], "attachment; filename=get-as-file-test.csv");

	fs.unlinkSync(path.resolve("./csv-files/get-as-file-test.csv"));
});