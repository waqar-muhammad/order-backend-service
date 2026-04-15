# Production Thinking (Short Answers)

## Scenario
Some orders were created successfully, but the wallet balance was not deducted.

---

## • What could cause this issue?

This usually happens because wallet deduction and order creation are not wrapped inside a proper database transaction. So, one operation succeeds and the other fails or doesn’t execute. It can also happen due to missing `await`, wrong parent reference, or silent error handling.

---

## • How would you debug it?

I would check logs step-by-step to see if both operations are executed. Then I would verify in the database whether the order exists without wallet deduction. I would also enable DB query logging and reproduce the issue with test cases or multiple requests to identify where the flow breaks.

---

## • How would you prevent it in the future?

I would fix it by wrapping both operations inside a DB transaction so they are atomic (either both succeed or both fail). I would also validate all business rules before writing to DB, add proper error handling, and write integration tests to ensure wallet and order always stay consistent.