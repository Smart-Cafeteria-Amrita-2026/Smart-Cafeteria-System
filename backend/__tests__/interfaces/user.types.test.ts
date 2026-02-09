import { USER_ROLE } from "../../src/interfaces/user.types";

describe("User Types", () => {
	test("USER_ROLE should have correct values", () => {
		expect(USER_ROLE).toEqual(["user", "staff", "admin"]);
	});
});
