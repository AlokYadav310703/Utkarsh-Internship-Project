# Utkarsh Scholarship API

Base URL: `/api`

## Auth

- `POST /auth/register` - create student account and send OTP.
- `POST /auth/verify-email` - verify `{ email, otp }` and receive JWT.
- `POST /auth/login` - login with `{ email, password }`.
- `POST /auth/forgot-password` - send reset OTP.
- `POST /auth/reset-password` - reset with `{ email, otp, password }`.
- `GET /auth/me` - current authenticated user.

## Public

- `GET /public/homepage` - settings and active FAQs.
- `GET /public/faqs` - active FAQs.
- `POST /public/contact` - submit support query.
- `GET /public/results/:sessionYear` - published selected list.
- `GET /public/results/:sessionYear/pdf` - result PDF.

## Student

Requires `Authorization: Bearer <token>`, role `STUDENT`, verified email.

- `GET /student/dashboard` - profile, application, documents, results, notifications.
- `PUT /student/profile` - update profile.
- `GET /student/application` - current application.
- `POST /student/application/draft` - save draft profile/application details.
- `POST /student/application/submit` - lock and submit application.
- `POST /student/documents/:type` - upload document file. Types: `PASSPORT_PHOTO`, `SCHOOL_ID`, `MARKSHEET`, `AADHAAR`.
- `GET /student/documents/:kind/pdf` - PDF for receipt, application, admit card, selection letter, or certificate.

## Admin

Requires role `ADMIN` or `SUPER_ADMIN`.

- `GET /admin/dashboard` - totals and review stats.
- `GET /admin/applications?search=&status=` - application list.
- `PATCH /admin/applications/:id/status` - update review status.
- `PATCH /admin/documents/:id/verify` - verify or flag document.
- `GET /admin/tests` / `POST /admin/tests` - scholarship tests.
- `POST /admin/tests/:id/assign` - assign test to applications.
- `PATCH /admin/test-results/:id` - update test score/status.
- `POST /admin/results/publish` - publish up to 11 selected students.
- `GET /admin/results/:sessionYear/pdf` - selected list PDF.
- `POST /admin/certificates/:applicationId` - create certificate record.
- `GET /admin/faqs`, `POST /admin/faqs`, `PUT /admin/faqs/:id`, `DELETE /admin/faqs/:id`.
- `GET /admin/contacts`, `PATCH /admin/contacts/:id`.
- `GET /admin/settings`, `PUT /admin/settings/:key` - settings update requires `SUPER_ADMIN`.
