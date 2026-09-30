export interface AuthenticationSignals {
  spf: string;
  dkim: string;
  dmarc: string;
  reply_to_mismatch: boolean;
  sender_domain_mismatch: boolean;
}

export interface InfrastructureSignals {
  ip_address: string;
  hosting_provider: string;
  asn: string;
  country: string;
  region: string;
  region_city?: string;
  isp?: string;
  domain_age: string;
  repeated_infrastructure: boolean;
  suspicious_domain_pattern: boolean;
  tld: string;
  originating_ip?: string;
  relay_path?: string[];
  disclaimer?: string;
}

export interface URLPattern {
  extracted_urls: string[];
  normalized_urls: string[];
  domains: string[];
  suspicious_keywords: string[];
  typosquatting_detected: boolean;
  unicode_lookalike: boolean;
  shortener_detected: boolean;
  url_structure_risk: string;
  redirect_chain?: string[];
}

export interface ContentDNA {
  primary_intent: string;
  claimed_entity: string;
  primary_objective: string;
}

export interface SocialEngineeringDNA {
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  fear: 'Low' | 'Medium' | 'High';
  authority: 'Low' | 'Medium' | 'High';
  reward: 'Low' | 'Medium' | 'High';
}

export interface SenderDNA {
  display_name_mismatch: boolean;
  domain_mismatch: boolean;
  sender_reputation: 'Low' | 'Neutral' | 'High';
  reply_to_address: string;
}

export interface LanguageDNA {
  primary_language: string;
  secondary_language?: string;
  code_mixing_detected: boolean;
  script_type: string;
}

export interface AttackDNA {
  attack_intent: string;
  content_dna?: ContentDNA;
  social_engineering_dna?: SocialEngineeringDNA;
  url_pattern: URLPattern;
  sender_dna?: SenderDNA;
  infrastructure_signals: InfrastructureSignals;
  authentication_signals: AuthenticationSignals;
  language_dna?: LanguageDNA;
  attack_type: string;
  social_engineering_tactics: string[];
  semantic_signature_summary?: number[];
}

export interface ThreatSignal {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string;
}

export interface SimilarityBreakdown {
  intent_sim: number;
  tactics_sim: number;
  semantic_sim: number;
  url_sim: number;
  infra_sim: number;
  header_sim: number;
  final_score: number;
  classification: string;
  weights_used: Record<string, number>;
  formula_expanded: string;
  threshold_note: string;
}

export interface MutationDetails {
  is_mutation: boolean;
  original_campaign_id?: string;
  original_email_id?: string;
  original_language?: string;
  current_language?: string;
  original_domain?: string;
  current_domain?: string;
  changes: Array<{ feature: string; from: string; to: string }>;
  stable_features: string[];
}

export interface AnalysisResult {
  email_id: string;
  subject: string;
  sender: string;
  reply_to: string;
  language: string;
  language_code: string;
  risk_score?: number;
  classification?: 'SAFE' | 'RISKY' | string;
  threat_score: number;
  threat_level: 'SAFE' | 'RISKY' | 'Low Risk' | 'Suspicious' | 'High Risk' | 'Critical' | string;
  confidence_score: number;
  attack_type: string;
  attack_dna: AttackDNA;
  suspicious_signals: ThreatSignal[];
  campaign_id?: string;
  campaign_name?: string;
  campaign_similarity: number;
  mutation_detected: boolean;
  mutation_details?: MutationDetails;
  explanation: {
    verdict_summary: string;
    why_suspicious: Array<{
      signal_id: string;
      title: string;
      description: string;
      severity: string;
      evidence: string;
    }>;
    breakdown_bars: Record<string, string>;
    formula_expanded: string;
    classification: string;
    threshold_disclaimer: string;
  };
  source?: string;
  demo_mode: boolean;
  created_at: string;
}

export interface ComparisonResult {
  email_a: AnalysisResult;
  email_b: AnalysisResult;
  similarity_breakdown: SimilarityBreakdown;
  mutation_details: MutationDetails;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'email' | 'campaign' | 'domain' | 'ip' | 'brand';
  threat_level?: string;
  details: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  weight?: number;
}

export interface NetworkGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CampaignSummary {
  id: string;
  name: string;
  attack_type: string;
  email_count: number;
  languages: string[];
  mutation_count: number;
  max_threat_level: string;
  created_at: string;
}

export interface EvidenceIntegrityRecord {
  evidence_id: string;
  report_id: string;
  attack_id: string;
  hash_algorithm: string;
  evidence_hash: string;
  content_hash?: string;
  hash_generated_at: string;
  hash_generated_at_utc?: string;
  report_generated_at: string;
  report_generated_at_utc?: string;
  evidence_type: string;
  file_name: string;
  file_size: number;
  file_size_human: string;
  created_by: string;
}

export interface EvidenceVerificationResult {
  verified: boolean;
  status: 'MATCH' | 'MISMATCH' | string;
  status_label: string;
  evidence_id?: string;
  report_id?: string;
  attack_id?: string;
  file_name: string;
  file_size: number;
  hash_algorithm: string;
  expected_hash: string;
  calculated_hash: string;
  matched_target?: string;
  verified_at: string;
  verified_at_utc?: string;
  verification_note: string;
}

export interface EmailForensicsData {
  email_id: string;
  message_id: string;
  sender: string;
  reply_to: string;
  recipient: string;
  subject: string;
  email_timestamp: string;
  sender_ip: string;
  authentication_results: {
    spf: string;
    dkim: string;
    dmarc: string;
    reply_to_mismatch: boolean;
    sender_domain_mismatch: boolean;
  };
  received_headers: string[];
  geolocation: {
    originating_ip: string;
    country: string;
    region_city: string;
    isp: string;
    asn: string;
    hosting_provider: string;
    disclaimer: string;
  };
  verdict_summary: string;
  ml_classification: string;
  detection_signals: ThreatSignal[];
  indicators_of_compromise: {
    urls: string[];
    domains: string[];
    ip_addresses: string[];
    suspicious_keywords: string[];
    typosquatting_detected: boolean;
    unicode_lookalike: boolean;
    url_structure_risk: string;
  };
}

export interface ForensicReportData {
  report_id: string;
  generated_at: string;
  generated_at_utc?: string;
  attack_id: string;
  executive_summary: string;
  incident_overview: {
    email_id?: string;
    message_id?: string;
    sender: string;
    reply_to?: string;
    recipient?: string;
    subject: string;
    email_timestamp?: string;
    sender_ip?: string;
    threat_level: string;
    classification?: string;
    language: string;
    language_code?: string;
    risk_score?: number;
    phishing_score: number;
    confidence_score?: number;
    attack_type?: string;
    campaign_id?: string;
  };
  email_forensics?: EmailForensicsData;
  mutation_analysis?: {
    mutation_detected: boolean;
    what_stayed_same: string;
    what_changed: string;
    changes: Array<{ feature: string; from: string; to: string }>;
    stable_features: string[];
  };
  attack_dna: AttackDNA;
  historical_match?: any;
  recommended_actions: string[];
  evidence_integrity?: EvidenceIntegrityRecord;
}

export interface RedirectHop {
  step: number;
  url: string;
  status_code: number;
  note: string;
}

export interface UrlAnalysisResponse {
  input_url: string;
  risk_score: number;
  classification?: string;
  risk_level: string;
  final_destination_url: string;
  final_destination_page_type: string;
  redirect_chain: RedirectHop[];
  typosquatting_detected: boolean;
  typosquatting_details: string;
  unicode_homoglyph_detected: boolean;
  url_shortener_detected: boolean;
  url_shortener_details: string;
  domain_age: string;
  has_suspicious_params: boolean;
  suspicious_params_details: string;
  ip_address: string;
  analysis_mode?: string;
  intelligence_notice?: string;
}

