# Carbon X-Ray

### Digital Carbon Intelligence for Individuals & Enterprises

Carbon X-Ray is a React + TypeScript application that explores how AI-assisted data extraction and deterministic calculations can turn everyday digital activity and enterprise documents into estimated carbon-impact insights.

The project provides two focused experiences:

* **Digital Shadow Scanner** — analyzes screen-time screenshots and estimates the carbon impact associated with digital activity.
* **Invoice-to-Audit System** — analyzes GST invoices or purchase orders, extracts material information, and estimates production and transport-related emissions.

> **Measure. Understand. Act.**

---

## Overview

Carbon X-Ray is designed around a simple idea: carbon information becomes more useful when it can be derived from data that people and organizations already have.

Instead of requiring users to manually enter every activity or material, the application uses multimodal AI to extract structured information from images. That extracted data is then passed into deterministic calculation logic to produce estimated carbon-impact results.

The current implementation is a prototype and engineering exploration rather than a certified carbon-accounting platform.

---

## Core Experiences

### 1. Digital Shadow Scanner

The Individual portal accepts a screen-time screenshot and uses Google's Gemini API to identify applications, categories, and usage duration.

The extracted data is normalized into categories such as:

* AI Queries
* 4K Streaming
* Social Media
* Gaming
* Video Calls
* Other

The application then applies configured emission factors to estimate the associated digital carbon footprint.

**Pipeline**

```text
Screen-Time Screenshot
        ↓
Image → Base64
        ↓
Gemini Multimodal Analysis
        ↓
Structured JSON
        ↓
Category Normalization
        ↓
Deterministic Emission Calculation
        ↓
Carbon-Impact Breakdown
```

---

### 2. Invoice-to-Audit System

The Enterprise portal accepts GST invoices or purchase orders and uses Gemini to extract material-level information.

The extraction workflow identifies:

* Material or item name
* Quantity/weight information
* Origin
* Supplier
* Invoice number
* Invoice date

Supported material categories currently include:

* Steel
* Iron
* Cement
* Aluminum
* Copper
* Plastic
* Glass
* Wood
* Paper

Where weight is not explicitly available, the current AI prompt allows the model to estimate weight from quantity and standard industrial assumptions.

The extracted material data is then enriched using deterministic material emission factors and a transport estimate.

**Pipeline**

```text
Invoice / Purchase Order
        ↓
Image → Base64
        ↓
Gemini Multimodal Analysis
        ↓
Structured Material JSON
        ↓
Material Classification
        ↓
Emission-Factor Lookup
        ↓
Production + Transport Estimate
        ↓
Enterprise Carbon View
```

---

# AI Engineering

## Multimodal AI Input

Carbon X-Ray uses the Google Gemini API through the `@google/genai` SDK.

The application sends images together with structured extraction prompts and requests JSON responses.

### Screen-Time Extraction

The AI is instructed to return:

```json
{
  "apps": [
    {
      "name": "App Name",
      "category": "Category",
      "hours": 0,
      "minutes": 0
    }
  ]
}
```

This allows the application to separate AI-assisted extraction from the calculation layer.

### Invoice Extraction

Invoice analysis returns structured information such as:

```json
{
  "materials": [
    {
      "name": "Material name",
      "weight": 0,
      "origin": "City, Country"
    }
  ],
  "supplier": "Company name",
  "invoiceNumber": "Invoice number",
  "date": "Invoice date"
}
```

The application can therefore process visual documents without requiring every field to be entered manually.

---

# Carbon Calculation Methodology

Carbon X-Ray currently uses configurable emission factors defined directly in the application code.

These values should be interpreted as **prototype estimation factors**, not universal or certified scientific constants.

## Digital Activity Factors

| Category     | Calculation Basis | Configured Factor |
| ------------ | ----------------: | ----------------: |
| AI Queries   |          Per hour |               300 |
| 4K Streaming |          Per hour |                45 |
| Social Media |        Per minute |               1.5 |
| Gaming       |          Per hour |                30 |
| Video Calls  |          Per hour |                30 |
| Other        |        Per minute |               0.5 |

The application converts each app's duration into minutes where necessary, applies the relevant factor, and aggregates results by category.

Categories are displayed in descending order of estimated CO₂ emissions.

---

## Enterprise Material Factors

The current material factors configured in the calculation layer are:

| Material | Factor |
| -------- | -----: |
| Steel    |   1.85 |
| Iron     |   1.85 |
| Cement   |   0.90 |
| Aluminum |   8.50 |
| Copper   |   4.20 |
| Plastic  |   6.00 |
| Glass    |   0.85 |
| Wood     |   0.45 |
| Paper    |   1.30 |

For an unrecognized material, the current implementation falls back to a default factor of `2.0`.

The production estimate is calculated from:

```text
Material CO₂ = Material Weight × Material Emission Factor
```

A transport estimate is also currently calculated as:

```text
Transport Estimate = Material Weight × 0.1
```

These calculations are intentionally deterministic after AI extraction, making the system easier to inspect and reproduce.

---

# Technical Architecture

Carbon X-Ray separates AI extraction, application state, and carbon calculations into focused modules.

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │ Individual /        │
                    │ Enterprise Portal   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Gemini Service    │
                    │ Multimodal AI       │
                    │ JSON Extraction     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Typed Data Model  │
                    │ AppUsage / Invoice  │
                    │ Material Data       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Calculation Layer   │
                    │ Emission Factors    │
                    │ Aggregation         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Carbon Intelligence │
                    │ Results & Charts    │
                    └─────────────────────┘
```

---

# Technology Stack

| Technology        | Role                          |
| ----------------- | ----------------------------- |
| React 19          | Frontend application          |
| TypeScript        | Type-safe application logic   |
| Vite              | Development and build tooling |
| Google Gemini API | Multimodal AI extraction      |
| `@google/genai`   | Gemini SDK                    |
| Recharts          | Data visualization            |
| Lucide React      | UI icons                      |

---

# Project Structure

```text
Carbonx-ray/
│
├── App.tsx
├── IndividualPortal.tsx
├── EnterprisePortal.tsx
├── Header.tsx
├── Footer.tsx
│
├── calculations.ts
├── geminiService.ts
├── types.ts
│
├── index.tsx
├── index.html
├── metadata.json
│
├── package.json
├── tsconfig.json
├── vite.config.ts
│
└── README.md
```

### Important Modules

**`App.tsx`**
Application-level composition and portal flow.

**`IndividualPortal.tsx`**
Individual digital-footprint experience.

**`EnterprisePortal.tsx`**
Enterprise invoice/material analysis experience.

**`geminiService.ts`**
Handles Gemini-powered image analysis and structured extraction.

**`calculations.ts`**
Contains the deterministic digital and enterprise carbon calculations.

**`types.ts`**
Defines the application's TypeScript data structures.

---

# Data Model

The project uses TypeScript interfaces to keep extracted and calculated data structured.

### App Usage

```ts
interface AppUsageItem {
  name: string;
  category: string;
  hours: number;
  minutes: number;
}
```

### Material

```ts
interface MaterialItem {
  name: string;
  weight: number;
  origin: string;
  type?: string;
  factor?: number;
  co2?: number;
  transport?: number;
}
```

### Invoice

```ts
interface InvoiceData {
  materials: MaterialItem[];
  supplier: string;
  invoiceNumber: string;
  date: string;
  batchId?: string;
}
```

This separation makes the AI extraction layer and calculation layer independently understandable.

---

# Key Engineering Highlights

### Multimodal AI Input

The system can interpret visual inputs rather than relying exclusively on manually entered structured data.

### Structured AI Output

Gemini responses are requested in JSON format so that extracted information can flow directly into application logic.

### Deterministic Calculation Layer

AI is used primarily for extraction and interpretation. Carbon calculations are performed by application code using configured factors.

### Category Normalization

The digital-footprint calculation layer normalizes variations in extracted categories into a defined set of application categories.

### Material Enrichment

Extracted enterprise materials are enriched with emission-factor, production CO₂, and transport-estimate fields before being presented.

### Typed Architecture

TypeScript interfaces provide a clear contract between AI responses, calculations, and UI components.

---

# Product Applications

The current architecture can support experimentation across two broad scenarios.

## Individual Digital Activity

Potentially useful for exploring:

* Digital consumption patterns
* Screen-time impact
* AI usage intensity
* Streaming activity
* Social-media activity
* Gaming activity
* Video-call activity

## Enterprise Material Intelligence

Potentially useful for exploring:

* Invoice processing
* Material-level carbon estimation
* Supplier information extraction
* Production-impact estimation
* Transport-impact estimation
* Carbon-oriented procurement workflows

The existing project direction also references compliance-oriented concepts such as the **EU Carbon Border Adjustment Mechanism (CBAM)** and **India's Carbon Credit Trading Scheme (CCTS)**. In this project, these should be understood as workflow/product directions rather than evidence of certified regulatory compliance.

---

# Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/deonsha13-ui/Carbonx-ray.git
cd Carbonx-ray
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure the Gemini API key

The application expects an API key through:

```text
API_KEY
```

Configure the key according to the environment setup used by your local Vite deployment.

## 4. Start the development server

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

## 5. Create a production build

```bash
npm run build
```

## 6. Preview the production build

```bash
npm run preview
```

---

# Typical User Workflow

## Individual

```text
Open Individual Portal
        ↓
Upload Screen-Time Screenshot
        ↓
AI Extracts App Usage
        ↓
Application Normalizes Categories
        ↓
Emission Factors Applied
        ↓
Estimated Digital Footprint Displayed
```

## Enterprise

```text
Open Enterprise Portal
        ↓
Upload GST Invoice / Purchase Order
        ↓
AI Extracts Material Information
        ↓
Material Data Enriched
        ↓
Production + Transport Estimates
        ↓
Enterprise Carbon View
```

---

# Limitations & Responsible Interpretation

Carbon X-Ray is an engineering prototype. Its outputs should not currently be treated as certified carbon accounting, regulatory reporting, or an independently verified emissions inventory.

Important limitations include:

### AI Extraction Accuracy

Image-based extraction can produce incorrect or incomplete values depending on image quality, document structure, and model interpretation.

### Estimated Invoice Weights

When a document does not explicitly provide weight, the current AI prompt allows estimation from quantity and standard industrial assumptions. Such values require human verification before operational use.

### Configured Emission Factors

The current factors are embedded in application code and represent the project's configured estimation methodology. Real-world carbon accounting may require source-specific lifecycle assessment data, geography, electricity mix, supplier information, transport mode, system boundaries, and other methodological choices.

### Transport Estimation

The current transport calculation is a simplified estimate and does not model route distance, transport mode, fuel type, load factor, or logistics network details.

### Regulatory Use

The presence of CBAM/CCTS-oriented concepts does not mean the application itself provides certified compliance or regulatory reporting.

For real deployment, extracted data and calculated results should be reviewed by appropriately qualified domain professionals.

---

# Future Engineering Directions

Possible future development areas include:

* Versioned emission-factor datasets
* Source attribution for carbon factors
* Human verification workflows for AI-extracted data
* Confidence scores for extracted fields
* Supplier-level carbon intelligence
* Distance-aware transport calculations
* More detailed lifecycle assessment models
* Historical footprint tracking
* Exportable audit reports
* Enterprise dashboards
* Authentication and role-based access
* Database-backed records
* Compliance-document workflows
* Automated data ingestion pipelines
* Improved validation and error handling

These are future directions rather than claims about features currently implemented in the repository.

---

# Project Context

Carbon X-Ray was developed as an exploration of how modern AI systems can be combined with deterministic engineering logic to make carbon-impact information more accessible.

The project focuses on the intersection of:

```text
AI
+
Document Intelligence
+
Digital Activity Analysis
+
Carbon Estimation
+
Data Visualization
```

The core engineering principle is to keep AI-assisted extraction and deterministic business logic as distinct layers.

---

# About AmpleTech AI

**Carbon X-Ray is associated with AmpleTech AI**, an AI consulting and engineering initiative focused on designing, engineering, and deploying practical AI systems.

AmpleTech AI works across areas such as:

* AI-powered applications
* Workflow automation
* Customer experience systems
* AI websites
* Voice and conversational systems
* WhatsApp and messaging integrations
* Operational intelligence
* Growth-oriented AI systems

> **AI systems that actually run parts of your business.**

---

# Project Identity

**Project:** Carbon X-Ray
**Repository:** `Carbonx-ray`
**Primary focus:** AI-assisted carbon intelligence
**Application type:** React web application
**Current status:** Prototype / engineering exploration

---

# License

No open-source license is currently specified in this repository.

## Engineering Attribution

Carbon X-Ray demonstrates a practical architecture for combining multimodal AI extraction with transparent, deterministic calculation logic.

The goal is not simply to generate a number.

It is to create a traceable path from:

**Source Data → AI Extraction → Structured Data → Calculation → Carbon Insight**

**Carbon X-Ray**
*Measure. Understand. Act.*

Built with React, TypeScript, Vite, Google Gemini, and a focus on practical AI engineering.
