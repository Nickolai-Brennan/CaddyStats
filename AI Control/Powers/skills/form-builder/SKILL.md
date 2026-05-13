---
name: form-builder
description: |
  Builds HTML and React forms with field validation, error states, loading states,
  and accessible markup. Use this skill whenever a user says "build a form for...",
  "create a contact form", "write a registration form", "add validation to this form",
  "build a multi-step form", "handle form submission", "add form error handling",
  or "write a form with React Hook Form". Also activate when someone describes a
  set of fields they need to collect from a user. Works with plain HTML, React +
  React Hook Form, and React + Zod validation. Do NOT use for backend form
  processing/storage (use rest-endpoint-generator) or payment forms (Stripe
  Elements are a different integration).
---

# Form Builder

Build complete, accessible forms with validation, error states, loading feedback,
and submission handling — ready to wire up to an API.

## When to Use

- Building a user-facing data collection form (registration, contact, settings)
- Adding validation and error messages to an existing form
- Creating a multi-step wizard form
- Building a search or filter form with controlled inputs

## When NOT to Use

- Backend form processing logic (use `rest-endpoint-generator`)
- Payment forms (Stripe Elements, PayPal — specialized integration)
- CMS-driven dynamic forms (different architecture)

---

## Workflow

### Step 1 — Gather Form Requirements

Ask for:

1. **Purpose:** What data is being collected?
2. **Fields:** Name, type, required/optional, validation rules
3. **Submission:** Where does it post? API endpoint or handler function?
4. **Framework:** Plain HTML, React + RHF, React + Zod/RHF?
5. **Behavior:** Inline validation, on-submit validation, or both?

### Step 2 — Define the Field Schema

For each field, define:

| Field             | Type     | Required | Validation rules                |
| ----------------- | -------- | -------- | ------------------------------- |
| `email`           | email    | ✓        | Valid email format              |
| `password`        | password | ✓        | ≥8 chars, 1 uppercase, 1 number |
| `confirmPassword` | password | ✓        | Must match `password`           |
| `name`            | text     | ✓        | 2–50 characters                 |
| `bio`             | textarea | ✗        | Max 500 characters              |

### Step 3 — Generate the Form

#### Plain HTML Form (with native validation)

```html
<form id="registration-form" novalidate>
  <div class="field-group">
    <label for="email">Email address <span aria-hidden="true">*</span></label>
    <input
      id="email"
      name="email"
      type="email"
      autocomplete="email"
      required
      aria-describedby="email-error"
      aria-invalid="false"
    />
    <span id="email-error" class="field-error" role="alert" hidden></span>
  </div>

  <div class="field-group">
    <label for="password">Password <span aria-hidden="true">*</span></label>
    <input
      id="password"
      name="password"
      type="password"
      autocomplete="new-password"
      required
      minlength="8"
      aria-describedby="password-hint password-error"
    />
    <p id="password-hint" class="field-hint">At least 8 characters with 1 uppercase and 1 number</p>
    <span id="password-error" class="field-error" role="alert" hidden></span>
  </div>

  <button type="submit" id="submit-btn">Create account</button>
</form>
```

#### React + React Hook Form + Zod

```tsx
// components/RegistrationForm/RegistrationForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, "At least 2 characters").max(50),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface RegistrationFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={isSubmitting}>
        <div className="field-group">
          <label htmlFor="name">Full name *</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <span id="name-error" role="alert" className="field-error">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <span id="email-error" role="alert" className="field-error">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby="password-hint"
            {...register("password")}
          />
          <p id="password-hint" className="field-hint">
            At least 8 characters with 1 uppercase and 1 number
          </p>
          {errors.password && (
            <span role="alert" className="field-error">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="confirmPassword">Confirm password *</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span role="alert" className="field-error">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" aria-busy={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </fieldset>
    </form>
  );
}
```

### Step 4 — CSS for Error States

```css
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}
.field-error {
  color: #dc2626;
  font-size: 0.875rem;
}
.field-hint {
  color: #6b7280;
  font-size: 0.875rem;
}

input[aria-invalid="true"] {
  border-color: #dc2626;
  outline-color: #dc2626;
}
```

---

## Multi-Step Form Pattern

For forms with multiple steps, use a step state machine:

```tsx
const STEPS = ["personal", "account", "confirm"] as const;
const [currentStep, setCurrentStep] = useState(0);

// Validate current step before advancing
const handleNext = handleSubmit(async (data) => {
  setCurrentStep((prev) => prev + 1);
});
```

---

## Output Format

1. **Field schema table** — name, type, required, validation rules
2. **Form component** — complete, ready-to-use
3. **CSS for field/error states** — minimal styles
4. **Usage example** — parent component showing how to use with an API call

---

## Safety & Confirmation

- Always use `aria-invalid` and `role="alert"` for field errors — screen readers need this.
- Never disable the submit button based on form validity — users need to try submitting to see errors.
- Use `novalidate` on the form to prevent native browser validation conflicts with custom validation.
- For sensitive fields (password, CC), ensure `autocomplete` values are correct to help password managers.
