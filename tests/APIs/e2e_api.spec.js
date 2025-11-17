/**
 * =====================================================================
 * Test Case: PUT Method - Update Booking (Two-Step Update Process)
 * Author: SDET Shahbaz Ali Khan 
 * https://www.linkedin.com/in/shahbaz-ali-khan-pk/
 * (https://github.com/shahbazali)
 * Description:
 *   1. Generate an auth token
 *   2. Create a new booking
 *   3. Perform FIRST UPDATE using PUT and validate response
 *   4. Perform SECOND UPDATE using PUT and validate response
 *   5. Delete the created booking as cleanup
 * Application Under Test: https://restful-booker.herokuapp.com/
 * =====================================================================
 */
import { test, expect } from '@playwright/test';
const testData = require('../../data/testData2.js'); // import single testData object for API Calls 

test("PUT Method - Update Booking", async ({ request }) => {

    // Step 1: Generate Authentication Token
    const authResponse = await request.post("https://restful-booker.herokuapp.com/auth", {
        headers: { "Content-Type": "application/json" },
        data: testData.authData
    });

    const authJson = await authResponse.json();
    const authToken = authJson.token;
    console.log("Auth token received:", authToken);

    // Step 2: Create a New Booking
    const bookingResponse = await request.post("https://restful-booker.herokuapp.com/booking", {
        headers: { "Content-Type": "application/json" },
        data: testData.bookingData
    });

    const bookingJson = await bookingResponse.json();
    const bookingID = bookingJson.bookingid;
    console.log("Initial Booking ID:", bookingID);

    // Step 3: FIRST UPDATE (PUT)
    const firstUpdateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `token=${authToken}`
        },
        data: testData.firstUpdateData
    });

    expect(firstUpdateResponse.status()).toBe(200);
    const firstUpdatedJson = await firstUpdateResponse.json();
    console.log("First Updated Response:", firstUpdatedJson);

    // Step 4: SECOND UPDATE (PUT)
    const secondUpdateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `token=${authToken}`
        },
        data: testData.secondUpdateData
    });

    expect(secondUpdateResponse.status()).toBe(200);
    const secondUpdatedJson = await secondUpdateResponse.json();
    console.log("Second Updated Response:", secondUpdatedJson);

    // Step 5: Delete Booking (Cleanup)
    const deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `token=${authToken}`
        }
    });

    console.log("Delete response status:", deleteResponse.status());
});
