# PetClinic – Business Documentation

## Overview

PetClinic is a veterinary practice management system. It allows clinic staff to manage pet owners, their animals, veterinarians, and scheduled visits. The application consists of an Angular single-page frontend and a Spring Boot REST API backend, secured with role-based access control.

---

## Actors

| Actor | Role | Capabilities |
|---|---|---|
| **Owner Admin** | Front-desk / reception staff | Manage owners, pets, and visits |
| **Vet Admin** | Veterinary staff manager | Manage veterinarians, specialties, and pet types |
| **Admin** | System administrator | All of the above plus user management |

---

## Domain Model

```mermaid
erDiagram
    OWNER {
        int id
        string firstName
        string lastName
        string address
        string city
        string telephone
    }
    PET {
        int id
        string name
        date birthDate
    }
    PET_TYPE {
        int id
        string name
    }
    VISIT {
        int id
        date date
        string description
    }
    VET {
        int id
        string firstName
        string lastName
    }
    SPECIALTY {
        int id
        string name
    }
    USER {
        string username
        string password
        bool enabled
    }
    ROLE {
        string name
    }

    OWNER ||--o{ PET : "owns"
    PET }o--|| PET_TYPE : "is of type"
    PET ||--o{ VISIT : "has"
    VET }o--o{ SPECIALTY : "has"
    USER ||--o{ ROLE : "has"
```

---

## Use Cases

### UC-01 — View All Owners

**Actor**: Owner Admin  
**Goal**: See the complete list of registered pet owners.

**Flow**:
1. User navigates to the Owners page.
2. The system fetches all owners from `GET /api/owners`.
3. Owners are displayed in a table showing Name, Address, City, Telephone, and Pets.

```mermaid
sequenceDiagram
    actor User
    participant UI as Angular Frontend
    participant API as Spring Boot API
    participant DB as Database

    User->>UI: Navigate to /owners
    UI->>API: GET /api/owners
    API->>DB: SELECT * FROM owners
    DB-->>API: Owner records
    API-->>UI: 200 OK – List<OwnerDto>
    UI-->>User: Render owners table
```

---

### UC-02 — Search Owners by Last Name

**Actor**: Owner Admin  
**Goal**: Quickly find an owner by filtering on last name prefix.

**Flow**:
1. User types a last name prefix in the search box.
2. The system calls `GET /api/owners?lastName={prefix}`.
3. The table updates to show only matching owners.
4. If no owners match, an empty state is shown.

```mermaid
sequenceDiagram
    actor User
    participant UI as Angular Frontend
    participant API as Spring Boot API
    participant DB as Database

    User->>UI: Enter last name prefix (e.g. "Davis")
    UI->>API: GET /api/owners?lastName=Davis
    API->>DB: SELECT * FROM owners WHERE last_name LIKE 'Davis%'
    DB-->>API: Filtered owner records
    API-->>UI: 200 OK – List<OwnerDto>
    UI-->>User: Render filtered table
```

---

### UC-03 — Add a New Owner

**Actor**: Owner Admin  
**Goal**: Register a new pet owner in the system.

**Flow**:
1. User clicks "Add Owner" and fills in the form (first name, last name, address, city, telephone).
2. User submits the form.
3. The system calls `POST /api/owners` with the owner data.
4. On success the system redirects to the new owner's detail page.
5. On validation error the form displays field-level messages.

```mermaid
flowchart TD
    A([User clicks Add Owner]) --> B[Display owner form]
    B --> C{Form submitted?}
    C -- Yes --> D[POST /api/owners]
    D --> E{Response?}
    E -- 201 Created --> F[Redirect to owner detail page]
    E -- 400 Bad Request --> G[Display validation errors on form]
    G --> B
    C -- No / Cancel --> H([Return to owners list])
```

---

### UC-04 — Edit an Owner

**Actor**: Owner Admin  
**Goal**: Update the contact details of an existing owner.

**Flow**:
1. User opens an owner's detail page and clicks "Edit".
2. The form is pre-populated via `GET /api/owners/{ownerId}`.
3. User modifies fields and submits.
4. The system calls `PUT /api/owners/{ownerId}`.
5. On success the owner detail page is refreshed.

```mermaid
sequenceDiagram
    actor User
    participant UI as Angular Frontend
    participant API as Spring Boot API

    User->>UI: Click Edit on owner detail
    UI->>API: GET /api/owners/{ownerId}
    API-->>UI: 200 OK – OwnerDto
    UI-->>User: Pre-filled edit form
    User->>UI: Modify fields & submit
    UI->>API: PUT /api/owners/{ownerId}
    API-->>UI: 200 OK – Updated OwnerDto
    UI-->>User: Refresh owner detail page
```

---

### UC-05 — Delete an Owner

**Actor**: Owner Admin  
**Goal**: Remove an owner record from the system.

**Flow**:
1. User clicks "Delete" on an owner.
2. The system calls `DELETE /api/owners/{ownerId}`.
3. On success the user is returned to the owners list.

> **Note**: Deleting an owner cascades to their associated pets and visits.

---

### UC-06 — Add a Pet to an Owner

**Actor**: Owner Admin  
**Goal**: Register a new pet under an existing owner.

**Flow**:
1. From the owner's detail page the user clicks "Add New Pet".
2. The form requires pet name, birth date, and type (dropdown from `GET /api/pettypes`).
3. User submits the form.
4. The system calls `POST /api/owners/{ownerId}/pets`.
5. The owner detail page reloads showing the new pet.

```mermaid
sequenceDiagram
    actor User
    participant UI as Angular Frontend
    participant API as Spring Boot API

    User->>UI: Click "Add New Pet" on owner detail
    UI->>API: GET /api/pettypes
    API-->>UI: 200 OK – List<PetTypeDto>
    UI-->>User: Pet form with type dropdown
    User->>UI: Fill in name, birth date, type & submit
    UI->>API: POST /api/owners/{ownerId}/pets
    API-->>UI: 201 Created – PetDto
    UI-->>User: Refresh owner detail with new pet listed
```

---

### UC-07 — Edit a Pet

**Actor**: Owner Admin  
**Goal**: Update the details of an existing pet.

**Flow**:
1. From the owner detail page the user clicks "Edit Pet".
2. Pet data is loaded via `GET /api/owners/{ownerId}/pets/{petId}`.
3. User updates fields and submits.
4. The system calls `PUT /api/owners/{ownerId}/pets/{petId}`.

---

### UC-08 — Schedule a Visit for a Pet

**Actor**: Owner Admin  
**Goal**: Record a vet visit for a specific pet.

**Flow**:
1. From the owner's detail page, the user clicks "Add Visit" on a pet.
2. User fills in visit date and description.
3. The system calls `POST /api/owners/{ownerId}/pets/{petId}/visits`.
4. The visit appears in the pet's visit history.

```mermaid
sequenceDiagram
    actor User
    participant UI as Angular Frontend
    participant API as Spring Boot API

    User->>UI: Click "Add Visit" for a pet
    UI-->>User: Visit form (date, description)
    User->>UI: Fill in details & submit
    UI->>API: POST /api/owners/{ownerId}/pets/{petId}/visits
    API-->>UI: 201 Created – VisitDto
    UI-->>User: Visit listed in pet visit history
```

---

### UC-09 — Manage Veterinarians

**Actor**: Vet Admin  
**Goal**: Create, update, and remove veterinarian records.

**Sub-flows**:

| Action | HTTP Call |
|---|---|
| List vets | `GET /api/vets` |
| Add vet | `POST /api/vets` |
| Edit vet | `PUT /api/vets/{vetId}` |
| Delete vet | `DELETE /api/vets/{vetId}` |

```mermaid
flowchart LR
    VetList[Vet List Page] --> AddVet[Add Vet Form]
    VetList --> EditVet[Edit Vet Form]
    VetList --> DeleteVet{Confirm Delete}
    AddVet -- POST /api/vets --> VetList
    EditVet -- PUT /api/vets/{vetId} --> VetList
    DeleteVet -- Yes → DELETE /api/vets/{vetId} --> VetList
    DeleteVet -- No --> VetList
```

---

### UC-10 — Manage Vet Specialties

**Actor**: Vet Admin  
**Goal**: Maintain the list of medical specialties that can be assigned to vets.

**Sub-flows**:

| Action | HTTP Call |
|---|---|
| List specialties | `GET /api/specialties` |
| Add specialty | `POST /api/specialties` |
| Edit specialty | `PUT /api/specialties/{specialtyId}` |
| Delete specialty | `DELETE /api/specialties/{specialtyId}` |

---

### UC-11 — Manage Pet Types

**Actor**: Vet Admin  
**Goal**: Maintain the catalogue of pet types (e.g., Cat, Dog, Bird).

**Sub-flows**:

| Action | HTTP Call | Access |
|---|---|---|
| List pet types | `GET /api/pettypes` | All roles |
| Add pet type | `POST /api/pettypes` | Vet Admin only |
| Edit pet type | `PUT /api/pettypes/{petTypeId}` | Vet Admin only |
| Delete pet type | `DELETE /api/pettypes/{petTypeId}` | Vet Admin only |

---

### UC-12 — Create a System User

**Actor**: Admin  
**Goal**: Provision a new user account with the appropriate role.

**Flow**:
1. Admin calls `POST /api/users` with username, password, and role(s).
2. Available roles: `ROLE_OWNER_ADMIN`, `ROLE_VET_ADMIN`, `ROLE_ADMIN`.
3. The system stores the account; the new user can immediately log in.

> This endpoint is restricted to `ADMIN` role only.

---

## End-to-End Application Flow

The diagram below shows how a typical day-to-day interaction (registering an owner, adding a pet, and booking a visit) flows across all layers of the system.

```mermaid
flowchart TD
    subgraph Browser["Browser (Angular SPA)"]
        UI1[Owners Page] --> UI2[Owner Detail Page]
        UI2 --> UI3[Add Pet Form]
        UI3 --> UI4[Add Visit Form]
    end

    subgraph API["Spring Boot REST API"]
        direction TB
        C1[OwnerRestController]
        C2[PetRestController]
        C3[VisitRestController]
        C4[PetTypeRestController]
    end

    subgraph DB["Database"]
        T1[(owners)]
        T2[(pets)]
        T3[(visits)]
        T4[(types)]
    end

    UI1 -- "GET /api/owners" --> C1
    C1 -- query --> T1
    UI2 -- "GET /api/owners/{id}" --> C1
    UI3 -- "GET /api/pettypes" --> C4
    C4 -- query --> T4
    UI3 -- "POST /api/owners/{id}/pets" --> C2
    C2 -- insert --> T2
    UI4 -- "POST /api/owners/{id}/pets/{id}/visits" --> C3
    C3 -- insert --> T3
```

---

## Authentication & Authorization Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Angular Frontend
    participant SEC as Spring Security Filter
    participant API as REST Controller
    participant DB as Database

    User->>UI: Login (username / password)
    UI->>SEC: HTTP Basic credentials
    SEC->>DB: Validate username & password
    DB-->>SEC: User + Roles
    SEC-->>UI: 200 OK – Authenticated
    UI->>SEC: Subsequent API requests (Basic Auth header)
    SEC->>SEC: Check role vs required permission
    alt Authorized
        SEC->>API: Forward request
        API-->>UI: 200/201 Response
    else Unauthorized
        SEC-->>UI: 401/403 Error
    end
```

---

## Error Handling Flow

```mermaid
flowchart TD
    A[Angular component makes HTTP call] --> B{HTTP response}
    B -- "2xx Success" --> C[Update component state / navigate]
    B -- "4xx / 5xx Error" --> D[HttpErrorInterceptor catches error]
    D --> E[ErrorService stores error message]
    E --> F[Error notification shown to user]
    F --> G{Recoverable?}
    G -- Yes --> A
    G -- No --> H[User remains on current page]
```

---

## API Summary

| Resource | List | Create | Read | Update | Delete |
|---|---|---|---|---|---|
| Owners | `GET /api/owners` | `POST /api/owners` | `GET /api/owners/{id}` | `PUT /api/owners/{id}` | `DELETE /api/owners/{id}` |
| Owner Pets | — | `POST /api/owners/{id}/pets` | `GET /api/owners/{id}/pets/{petId}` | `PUT /api/owners/{id}/pets/{petId}` | — |
| Owner Pet Visits | — | `POST /api/owners/{id}/pets/{petId}/visits` | — | — | — |
| Pets | `GET /api/pets` | — | `GET /api/pets/{id}` | `PUT /api/pets/{id}` | `DELETE /api/pets/{id}` |
| Pet Types | `GET /api/pettypes` | `POST /api/pettypes` | `GET /api/pettypes/{id}` | `PUT /api/pettypes/{id}` | `DELETE /api/pettypes/{id}` |
| Vets | `GET /api/vets` | `POST /api/vets` | `GET /api/vets/{id}` | `PUT /api/vets/{id}` | `DELETE /api/vets/{id}` |
| Specialties | `GET /api/specialties` | `POST /api/specialties` | `GET /api/specialties/{id}` | `PUT /api/specialties/{id}` | `DELETE /api/specialties/{id}` |
| Visits | `GET /api/visits` | `POST /api/visits` | `GET /api/visits/{id}` | `PUT /api/visits/{id}` | `DELETE /api/visits/{id}` |
| Users | — | `POST /api/users` | — | — | — |
