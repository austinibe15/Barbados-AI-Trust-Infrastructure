import { Routes, Route } from "react-router-dom"

import Dashboard from "../pages/Dashboard"

// Identity
import IdentityManagement from "../pages/identity/IdentityManagement"
import Credentials from "../pages/identity/Credentials"
import Verification from "../pages/identity/Verification"

// AI Intelligence
import RiskCentre from "../pages/intelligence/RiskCentre"
import AnomalyDetection from "../pages/intelligence/AnomalyDetection"
import ExplainableAI from "../pages/intelligence/ExplainableAI"

// Governance
import Compliance from "../pages/governance/Compliance"
import Accountability from "../pages/governance/Accountability"
import AuditTrail from "../pages/governance/AuditTrail"

// Institutions
import Institutions from "../pages/institutions/Institutions"
import AccessControl from "../pages/institutions/AccessControl"

// Research
import ResearchLab from "../pages/research/ResearchLab"
import Models from "../pages/research/Models"
import Experiments from "../pages/research/Experiments"
import Evaluation from "../pages/research/Evaluation"

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          OVERVIEW
      ========================== */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* =========================
          IDENTITY
      ========================== */}
      <Route
        path="/identity"
        element={<IdentityManagement />}
      />

      <Route
        path="/identity/credentials"
        element={<Credentials />}
      />

      <Route
        path="/identity/verification"
        element={<Verification />}
      />

      {/* =========================
          AI INTELLIGENCE
      ========================== */}
      <Route
        path="/intelligence/risk-centre"
        element={<RiskCentre />}
      />

      <Route
        path="/intelligence/anomaly-detection"
        element={<AnomalyDetection />}
      />

      <Route
        path="/intelligence/explainable-ai"
        element={<ExplainableAI />}
      />

      {/* =========================
          GOVERNANCE
      ========================== */}
      <Route
        path="/governance/compliance"
        element={<Compliance />}
      />

      <Route
        path="/governance/accountability"
        element={<Accountability />}
      />

      <Route
        path="/governance/audit-trail"
        element={<AuditTrail />}
      />

      {/* =========================
          INSTITUTIONS
      ========================== */}
      <Route
        path="/institutions"
        element={<Institutions />}
      />

      <Route
        path="/institutions/access-control"
        element={<AccessControl />}
      />

      {/* =========================
          RESEARCH
      ========================== */}
      <Route
        path="/research"
        element={<ResearchLab />}
      />

      <Route
        path="/research/models"
        element={<Models />}
      />

      <Route
        path="/research/experiments"
        element={<Experiments />}
      />

      <Route
        path="/research/evaluation"
        element={<Evaluation />}
      />

      {/* =========================
          FALLBACK
      ========================== */}
      <Route
        path="*"
        element={<Dashboard />}
      />
    </Routes>
  )
}