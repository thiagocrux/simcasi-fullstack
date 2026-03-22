# Database Schema

The following diagram represents the core entity relationships within the SIMCASI database:

```mermaid
erDiagram
    Role ||--o{ User : "has many"
    Role ||--o{ RolePermission : "contains"
    Permission ||--o{ RolePermission : "assigned to"
    User ||--o{ Session : "owns"
    User ||--o{ PasswordResetToken : "requests"
    User ||--o{ Patient : "creates"
    User ||--o{ Exam : "creates"
    User ||--o{ Notification : "creates"
    User ||--o{ Observation : "creates"
    User ||--o{ Treatment : "creates"
    User ||--o{ AuditLog : "triggers"
    Patient ||--o{ Exam : "undergoes"
    Patient ||--o{ Notification : "notified of"
    Patient ||--o{ Observation : "observed for"
    Patient ||--o{ Treatment : "receives"

    Role {
        uuid id PK
        string code UK
        string label
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Permission {
        uuid id PK
        string code UK
        string label
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    RolePermission {
        uuid roleId PK, FK
        uuid permissionId PK, FK
    }

    User {
        uuid id PK
        string name
        string email UK
        string password
        uuid roleId FK
        boolean isSystem
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Patient {
        uuid id PK
        string susCardNumber UK
        string cpf UK
        string name
        string socialName
        date birthDate
        string race
        string sex
        string gender
        string sexuality
        string nationality
        string schooling
        string phone
        string email
        string motherName
        string fatherName
        boolean isDeceased
        string monitoringType
        string zipCode
        string state
        string city
        string neighborhood
        string street
        string houseNumber
        string complement
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Exam {
        uuid id PK
        uuid patientId FK
        string treponemalTestType
        string treponemalTestResult
        date treponemalTestDate
        string treponemalTestLocation
        string nontreponemalVdrlTest
        string nontreponemalTestTitration
        date nontreponemalTestDate
        string otherNontreponemalTest
        date otherNontreponemalTestDate
        string referenceObservations
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Notification {
        uuid id PK
        uuid patientId FK
        string sinan
        string observations
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Observation {
        uuid id PK
        uuid patientId FK
        string observations
        boolean hasPartnerBeingTreated
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Treatment {
        uuid id PK
        uuid patientId FK
        string medication
        string healthCenter
        date startDate
        string dosage
        string observations
        string partnerInformation
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Session {
        uuid id PK
        uuid userId FK
        timestamptz issuedAt
        timestamptz expiresAt
        inet ipAddress
        string userAgent
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    PasswordResetToken {
        uuid id PK
        uuid userId FK
        string token UK
        timestamptz expiresAt
        timestamptz usedAt
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    AuditLog {
        uuid id PK
        uuid userId FK
        string action
        string entityName
        uuid entityId
        json oldValues
        json newValues
        inet ipAddress
        string userAgent
        timestamptz createdAt
    }
```

> **Note:** This diagram focuses on relationships and core field types. For indexes, `CASCADE` rules, constraints, and optional fields, refer to [prisma/schema.prisma](../prisma/schema.prisma).
