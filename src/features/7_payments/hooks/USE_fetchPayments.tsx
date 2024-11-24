import { useState, useEffect } from "react";
import { Q } from "@nozbe/watermelondb";

import Payments_MODEL from "@/src/db/models/Payments_MODEL";
import { Payments_DB } from "@/src/db"; // Adjust the import based on your DB instance location

export default function USE_fetchPayments(user_id: string | undefined) {
  const [ARE_paymentsFetching, SET_paymentsFetching] = useState(false);
  const [fetchPayments_ERROR, SET_error] = useState<string | null>(null);
  const [payments, SET_payments] = useState<Payments_MODEL[]>([]);

  useEffect(() => {
    // Fetch payments when the user_id changes
    if (user_id) {
      FETCH_payments(user_id);
    } else {
      SET_error("🔴 User ID is missing. Unable to fetch payments. 🔴");
      SET_payments([]);
    }
  }, [user_id]);

  const FETCH_payments = async (user_id: string) => {
    SET_paymentsFetching(true);
    SET_error(null);

    try {
      // Validate user_id before querying
      if (!user_id) {
        SET_error("🔴 User ID is required to fetch payments. 🔴");
        SET_paymentsFetching(false);
        return;
      }

      // Build the query to fetch payments for the given user_id
      const query = Payments_DB.query(
        Q.where("user_id", user_id),
        Q.where("deleted_at", null),
        Q.sortBy("created_at", Q.desc)
      );

      const fetchedPayments = await query.fetch();

      // Check if any payments are retrieved
      if (!fetchedPayments.length) {
        SET_error("🔴 No payments found for the given user ID. 🔴");
      }

      // Set fetched payments
      SET_payments(fetchedPayments);
    } catch (error) {
      // Check if the error has specific information
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error("🔴 Unexpected error fetching payments: 🔴", errorMessage);
      SET_error(`🔴 Unexpected error fetching payments: ${errorMessage} 🔴`);
    } finally {
      SET_paymentsFetching(false);
    }
  };

  return {
    payments,
    ARE_paymentsFetching,
    fetchPayments_ERROR,
  };
}
