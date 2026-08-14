# Agency OS - Frontend Context

## 1. Project Overview & Tech Stack

Agency OS is a Next.js web application implementing a dashboard for managing projects, tickets, and user collaboration.

- **Framework**: Next.js (v16.x App Router)
- **Library**: React (v19.x)
- **State Management**: Redux Toolkit (via `@reduxjs/toolkit` and `react-redux`)
- **Styling**: Tailwind CSS (v4)
- **HTTP Client**: Axios (v1.x) with custom automatic token-refresh interceptors
- **Form Handling**: React Hook Form (v7.x) with Zod schema validation via `@hookform/resolvers`
- **Toasts**: Sonner

---

## 2. Folder Structure

The frontend is organized according to Next.js App Router conventions:

```
frontend/
├── src/
│   ├── app/                  # App router page folders and global layouts
│   │   ├── admin/            # Admin dashboard for user and project configuration
│   │   │   ├── employees/    # Employee management page
│   │   │   └── projects/     # Project management page (thin orchestrator ~70 lines)
│   │   ├── kanban/           # Interactive Kanban board for ticket management
│   │   ├── login/            # Login interface
│   │   ├── globals.css       # Global styling rules (Tailwind config + indigo scrollbars)
│   │   └── layout.tsx        # Root layout structure & Providers (includes <Toaster />)
│   ├── components/           # Pure display/UI components (no <form> elements)
│   │   ├── Button.tsx
│   │   ├── Input.tsx         # forwardRef-enabled, supports spread from RHF register()
│   │   ├── Modal.tsx         # Accepts optional `size` prop for custom max-width
│   │   ├── PageHeader.tsx
│   │   ├── Sidebar.tsx
│   │   ├── notification/
│   │   │   └── NotificationListener.tsx # Foreground push listener component
│   │   ├── project/
│   │   │   ├── CreateProjectModal.tsx   # Modal shell — delegates to forms/project/CreateProjectForm
│   │   │   ├── AllocateTeamModal.tsx    # Modal shell — delegates to forms/project/AllocateTeamModal
│   │   │   ├── AddAssetModal.tsx        # Modal shell — delegates to forms/project/AddAssetModal
│   │   │   └── ProjectCard.tsx          # Display card for a single project (no form)
│   │   └── ticket/
│   │       ├── KanbanFilters.tsx         # Pure display filter component for the Kanban board
│   │       ├── KanbanBoard.tsx           # Board canvas displaying column lists and ticket cards
│   │       ├── TicketComments.tsx        # Chat-bubble comments list; own messages aligned right
│   │       ├── TicketDetailModal.tsx     # Modal shell — orchestrates all ticket detail sub-components
│   │       ├── TicketProperties.tsx      # Ticket meta-card: Project, Assignee, Priority
│   │       ├── TicketTimelineEstimation.tsx  # Timeline card: Start/Due dates, Story Points, Estimate
│   │       ├── TicketLoggingProgress.tsx # Status/hours inputs (editable or read-only via canEdit prop) + Tags
│   │       └── TimelineCard.tsx          # Shared icon-card row used by TicketTimelineEstimation
│   ├── constants/            # Module-level constants
│   │   ├── api.ts
│   │   ├── route.ts
│   │   ├── storage.ts
│   │   └── kanban.ts         # KANBAN_COLUMNS — column config (key, label, color) using ETicketStatus
│   ├── forms/                # All form-containing components grouped by domain
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   ├── employee/
│   │   │   └── CreateEmployeeForm.tsx
│   │   ├── project/
│   │   │   └── CreateProjectForm.tsx   # RHF form to create a project
│   │   └── ticket/
│   │       ├── CreateTicketForm.tsx    # RHF form to create a ticket (projects + employees as props)
│   │       └── AddCommentForm.tsx      # RHF form to post a comment; auto-resets after submit
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Auth bindings (login, logout, token expiry); toast on error
│   │   ├── useKanban.ts      # Kanban state, filters, and mutations orchestrator hook
│   │   └── useFcmLifecycle.ts # FCM background registration and sync hook
│   ├── providers/            # Client-side React context wrappers
│   │   ├── QueryProvider.tsx
│   │   ├── ReduxProvider.tsx
│   │   └── FcmProvider.tsx   # Mounts NotificationListener and useFcmLifecycle hook
│   ├── schemas/              # Zod validation schemas + inferred TypeScript types
│   │   ├── auth/auth.schema.ts
│   │   ├── employee/employee.schema.ts
│   │   ├── project/project.schema.ts   # Exports CreateProjectFormValues
│   │   └── ticket/ticket.schema.ts     # Exports CreateTicketFormValues, AddCommentFormValues
│   ├── services/             # TanStack Query hooks (useGetX, useCreateX, useMutateX)
│   │   ├── auth/
│   │   ├── employee/
│   │   ├── project/
│   │   ├── ticket/
│   │   └── notification/     # notification.service.ts and notification.hooks.ts
│   ├── store/                # Redux store definition and slices
│   │   ├── authSlice.ts
│   │   ├── notificationSlice.ts # Slice for notifications state (unreadCount, permissions, fcmToken)
│   │   └── index.ts
│   ├── types/                # TypeScript interfaces grouped by domain
│   │   ├── auth/auth.types.ts
│   │   ├── employee/employee.types.ts
│   │   ├── notification/notification.types.ts # FCM payloads and providers prop interfaces
│   │   ├── project/project.types.ts    # Payload types + all project component/form prop interfaces
│   │   └── ticket/ticket.types.ts      # All ticket types, component prop interfaces, and FormatTicketDateOptions
│   └── utils/                # Axios client, Firebase tools, response interceptors, and ticket helpers
│       ├── axios.ts
│       ├── firebase.ts       # Firebase app, messaging, and foreground callbacks
│       └── ticket.tsx        # getPriorityBadge, formatTicketDate (unified date formatter)
├── package.json
└── tsconfig.json
```

---

## 3. Core Architectural Flows

### State Management & Authentication Hook

- Redux slice `authSlice.ts` handles the authentication state (`user`, `token`, `isAuthenticated`, `isLoading`).
- Custom hook `useAuth.ts` provides bindings to trigger login, logout, and token expiration checks. Errors (e.g. logout failure) are surfaced via `toast.error()` from Sonner rather than `console.error`.

### Silent Refresh Interceptor

- **Client Storage**: The Access Token is stored solely in memory (Redux state). The Refresh Token resides inside a secure, HTTP-only cookie managed by the browser.
- **Axios Interceptor (`utils/axios.ts`)**:
  - Automatically appends the Bearer token to headers for backend authorization.
  - Intercepts incoming `401 Unauthorized` responses.
  - If a 401 occurs, it hits the `/auth/refresh-token` endpoint.
  - On rotation success: Receives a new transient access token, updates the Redux store, and transparently replays the initial failed request.
  - On rotation failure: Wipes the store state and redirects the user to the login screen.

### State Orchestration Hook (`useKanban.ts`)

- Exposes a custom page-level hook `useKanban()` that acts as the single entry point for all Kanban board interaction logic.
- Manages state for filters, selected tickets, creation modal display toggles, query cache updates, and mutations callback logic.
- Simplifies [page.tsx](frontend/src/app/kanban/page.tsx) to pure display markup, mapping states directly into props of reusable presentation components (`KanbanFilters`, `KanbanBoard`, `TicketDetailModal`).

### Firebase Cloud Messaging (FCM) Integration

- **Device Token Synchronization (`useFcmLifecycle.ts`)**:
  - Automatically queries browser notifications authorization and syncs registered FCM device tokens with the backend via `useSyncDevice` when permission is granted.
  - Automatically unregisters tokens via `useRemoveDevice` on sign-out or when permissions are revoked.
- **Foreground Message Listener (`NotificationListener.tsx`)**:
  - Subscribes to foreground push events when the tab is active.
  - Triggers rich toast alerts using `sonner` and programmatically invalidates active query keys (e.g. `["tickets"]`, `["projects"]`) to sync board UI instantly.

### Form Handling Pattern

All form components use **React Hook Form** with **`zodResolver`** for schema-backed validation:

- Field-level error messages render inline via `errors.x.message` passed to the `Input` component's `error` prop.
- `reset()` is called on modal close or successful submission to clear field state.
- Non-native inputs (e.g. checkbox lists) are wrapped in `Controller`.
- Mutation error messages from the API are surfaced via a `serverError` prop passed down from the modal/page, displayed as an inline alert banner at the top of the form.
- `<select>` option values always use enum members (e.g. `ETicketStatus.BACKLOG`) — never hardcoded strings.

---

## 4. Key UI Sections

- **Kanban Board** (`app/kanban/page.tsx`): Status-update board displaying tickets under 5 columns (Backlog, Todo, In Progress, In Review, Completed). Column definitions live in `constants/kanban.ts`. The page is a thin orchestrator — form logic is delegated to `forms/ticket/CreateTicketForm` and `forms/ticket/AddCommentForm`.
- **Admin Section**: Restricted to Administrator roles; handles creating new users, editing roles, and setting up new client projects.
  - `admin/projects/page.tsx` is a thin orchestrator (~70 lines). It renders `ProjectCard` for each project and delegates form logic to the modal forms in `components/project/` (which in turn render forms from `forms/project/`).

---

## 5. Conventions & Patterns

- **No `console.*` in frontend code** — all errors are surfaced to the user via `toast.error()` from Sonner.
- **Prop interfaces** for all components and forms live in the corresponding `types/<domain>/<domain>.types.ts` file, never inline in the component file.
- **Form components** (any component containing a `<form>`) live in `src/forms/<domain>/`. Pure display/UI components live in `src/components/<domain>/`. Modal shells that wrap a form live in `src/components/<domain>/` and import their form from `src/forms/<domain>/`.
- **Zod schemas** live in `src/schemas/<domain>/` and export both the schema object and the inferred `z.infer<>` type (e.g. `CreateTicketFormValues`) for use with React Hook Form.
- **Constants** (arrays, config objects, lookup maps) live in `src/constants/`. Enum values are imported from `src/enums/` — never use raw string literals for enum-backed values.
- **Not Found Page**: Custom glassmorphic 404 page at `app/not-found.tsx`.
- **Redux ID convention**: The logged-in user's ID in the Redux `auth` slice is stored as `user.id` (not `user._id`). Mongoose-populated objects returned from the API use `_id`. To check ownership (e.g. comment authorship, ticket assignee), compare `c.user?._id === user?.id`.

---

## 6. Recent Changes (Current Session)

### Ticket Detail Modal Decomposed into Sub-Components

The monolithic `TicketDetailModal.tsx` was refactored into focused sub-components:

- **[TicketProperties.tsx](frontend/src/components/ticket/TicketProperties.tsx)**: Renders Project name, Assignee name, and Priority badge with colored icon cards.
- **[TicketTimelineEstimation.tsx](frontend/src/components/ticket/TicketTimelineEstimation.tsx)**: Renders Start/Due dates, Story Points (with tooltip), and Estimated Time. Uses a data-driven `items` array to eliminate 4× repeated JSX. Each row is rendered via the shared `TimelineCard` sub-component.
- **[TimelineCard.tsx](frontend/src/components/ticket/TimelineCard.tsx)**: Shared presentational row component accepting `icon`, `iconBg`, `label`, `value`, and optional `tooltip`.
- **[TicketLoggingProgress.tsx](frontend/src/components/ticket/TicketLoggingProgress.tsx)**: Status and actual hours inputs with `canEdit` prop — admins and assignees see editable selects/inputs; other employees see read-only text. Also renders the tags list.

### Unified Date Formatter

Replaced `formatCommentDate` and `formatDate` with a single `formatTicketDate(dateStr?, options?)` in `utils/ticket.tsx`:

- `{ withTime: true, withYear: false }` → comment timestamp format (e.g. "Aug 12, 02:30 PM")
- Default (no options) → ticket date format (e.g. "Aug 12, 2026")
- `FormatTicketDateOptions` interface exported from `types/ticket/ticket.types.ts`

### Access Control: Employees Can Only Edit Their Own Tickets

`TicketDetailModal` now computes:

```ts
const canEdit =
  user?.role === EUserRole.ADMIN || ticket?.assignee?._id === user?.id;
```

- `canEdit=true` → editable status select + hours input + Save Changes bar visible
- `canEdit=false` → read-only status text + "Not logged" hours display; Save bar hidden

### TicketComments Auto-Scroll & Chat Bubbles

- Own comments (matched by `c.user?._id === user?.id`) render right-aligned with indigo bubble styling.
- Others' comments render left-aligned with slate styling.
- `useRef` + `scrollTop` auto-scrolls to bottom on every comment update.

### Ticket Soft Deletion

- **Backend Schema & Query Middleware**: Added `isDeleted: boolean` to Mongoose schema in [ticket.model.ts](backend/src/models/ticket.model.ts) and registered a pre-query middleware (`/^find/`) to automatically filter out soft-deleted documents (`{ isDeleted: { $ne: true } }`) from everyday queries.
- **Service & Access Control**: Added `DELETE /api/tickets/:ticketId` API route (restricted to administrators) to flag the ticket rather than deleting it.
- **Frontend Integration**: Rendered a red "Delete Ticket" button inside [TicketDetailModal.tsx](frontend/src/components/ticket/TicketDetailModal.tsx) for admins. Clicking the button prompts the user using the shared `ConfirmModal` component before firing the delete mutation.

### Ticket Assignee Editing

- **Admin Assignment Dropdown**: Swapped the static Assignee text in [TicketProperties.tsx](frontend/src/components/ticket/TicketProperties.tsx) with an editable dropdown list when the current user is an Admin, allowing them to dynamically reassign the ticket to any employee.
- **Save Button Queueing**: The assignee selection is managed locally in state and only committed to the database when the **Save Changes** button is clicked, matching the UX of status and actual hours updates.
- **Reassignment Notifications**: Backend triggers a push notification alerting the employee when a ticket is assigned to them.

### Firebase Cloud Messaging (FCM) Improvements

- **FCM Data-Only Payload**: Converted FCM messages on the backend to a data-only payload format by omitting the `notification` object. This prevents the browser from automatically displaying unclickable default notifications, allowing the service worker's `onBackgroundMessage` handler to exclusively display the custom, clickable notification.
- **Action Click Redirects**: Updated the foreground toast and background service worker (`firebase-messaging-sw.js`) click actions to redirect directly to the ticket URL (`/kanban?ticketId=...`), which automatically opens the ticket detail modal.
- **Tab Reuse Navigation**: The service worker checks for an existing `/kanban` tab and navigates it to the correct ticket detail URL instead of opening a duplicate window.
