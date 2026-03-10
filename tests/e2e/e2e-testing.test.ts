import { startBackend, stopBackend, BASE_URL, setAuthToken } from "../integration/serverHelper";
import type { SlotData, MenuItemData } from "../../frontend/src/types/booking.types";

jest.setTimeout(120000);

describe("E2E tests - Full booking flow", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("User can register, login, select slot, create booking and retrieve confirmation", async () => {
    const { AuthService } = await import("../../frontend/src/services/auth.service");
    const { BookingService } = await import("../../frontend/src/services/booking.service");

    // 1️⃣ Register a fresh test user
    const unique = Date.now();
    const email = `e2e${unique}@gmail.com`;
    const password = `Password!${unique}`;

    const registerPayload = {
      email,
      password,
      first_name: "E2E",
      last_name: "Tester",
      college_id: `E2E-TEST-ID-${unique}`,
      mobile: "9000000000",
      role: "user" as const,
      department: "testing",
    };

    try {
      await AuthService.register(registerPayload);
    } catch (err: unknown) { }

    // 2️⃣ Login
    const loginResponse = await AuthService.login({ email, password });

    expect(loginResponse).toBeDefined();
    expect(loginResponse.success).toBe(true);

    setAuthToken(loginResponse.data.accessToken, loginResponse.data.refreshToken);

    // 3️⃣ Fetch available slots
    const slotsResp = await BookingService.getAvailableSlots();

    expect(slotsResp).toBeDefined();
    expect(slotsResp.success).toBe(true);
    expect(Array.isArray(slotsResp.data)).toBe(true);

    const slot =
      slotsResp.data.find((s: SlotData) => !s.is_full && s.remaining_capacity > 0) ||
      slotsResp.data[0];

    // ✅ If no slots exist, skip the rest of the test
    if (!slot) {
      console.log("No slots available in DB. Skipping booking steps.");
      return;
    }

    // 4️⃣ Fetch menu for slot
    const menuResp = await BookingService.getMenuBySlotId(String(slot.slot_id));

    expect(menuResp).toBeDefined();
    expect(menuResp.success).toBe(true);
    expect(Array.isArray(menuResp.data)).toBe(true);

    const menuItem =
      menuResp.data.find((m: MenuItemData) => m.is_available) ||
      menuResp.data[0];

    if (!menuItem) {
      console.log("No menu items available. Skipping booking creation.");
      return;
    }

    // 5️⃣ Create booking
    const createPayload = {
      slot_id: slot.slot_id,
      group_size: 1,
      menu_items: [{ menu_item_id: menuItem.menu_item_id, quantity: 1 }],
      total_amount: menuItem.price,
    };

    const bookingResp = await BookingService.createBooking(createPayload as any);

    expect(bookingResp).toBeDefined();
    expect(bookingResp.success).toBe(true);
    expect(bookingResp.data).toBeDefined();
    expect(bookingResp.data.booking_id).toBeTruthy();

    // 6️⃣ Verify booking exists
    const myBookings = await BookingService.getBookings();

    expect(myBookings).toBeDefined();
    expect(myBookings.success).toBe(true);

    const found = (myBookings.data || []).find(
      (b: any) => String(b.id) === String(bookingResp.data.booking_id)
    );

    expect(found).toBeDefined();
  });
});