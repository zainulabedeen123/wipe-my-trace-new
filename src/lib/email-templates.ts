import { Jurisdiction } from '@prisma/client'

export interface TemplateVariables {
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientAddress?: string
  companyName: string
  deadline: string
}

export const CCPA_TEMPLATE = {
  subject: 'Legally Binding Request for Immediate Deletion of Personal Information Pursuant to CCPA Section 1798.105',
  body: `Dear {{companyName}} or Sir/Madam,

I hereby submit a formal and legally binding request for the immediate and permanent deletion of all personal information your company has collected, processed, stored, or disclosed about {{clientName}}, pursuant to Section 1798.105 of the California Consumer Privacy Act (CCPA), California Civil Code §§ 1798.100 et seq.

**Identifying Details:**
- Full Name: {{clientName}}
- Address: {{clientAddress}}
- Email Address: {{clientEmail}}
- Phone Number: {{clientPhone}}

**Legal Basis for This Request:**
Under Section 1798.105(a) of the CCPA, {{clientName}}, as a California resident, has the unequivocal right to direct your business to delete their personal information from your records. Your company, which operates as a commercial data broker rather than a government-mandated entity (e.g., a credit reporting agency subject to federal regulation), lacks any lawful basis to retain or process their personal information absent explicit consent.

Your potential reliance on a "legitimate business purpose" under Section 1798.105(d) is invalid. The CCPA permits denial of deletion requests only under narrowly defined exceptions (e.g., completing a transaction, complying with legal obligations, or internal uses reasonably aligned with consumer expectations). As a data broker engaged in the collection, sale, or dissemination of personal information for profit, your activities do not meet these criteria. The fundamental right to privacy, as protected by the CCPA and California law, supersedes any commercial interest you may claim.

Furthermore, pursuant to Section 1798.120(a), {{clientName}} explicitly exercises their right to opt out of the sale of their personal information. Given your business's involvement in data trading, you are obligated to honor this opt-out request and cease all sales or disclosures of their data for monetary or other valuable consideration, as defined under Section 1798.140(t).

**Scope of This Request:**
1. **Complete Deletion**: You must permanently and irreversibly delete all personal information about {{clientName}}—including but not limited to their name, contact details, behavioral data, and any derived or inferred data—from all your databases, systems, backups, and any other storage mechanisms, whether physical or digital.
2. **Third-Party Compliance**: You must notify all third parties (e.g., service providers, contractors, or data recipients) to whom you have sold, shared, or disclosed their personal information, instructing them to delete it, as required by Section 1798.105(c).
3. **Disclosure Report**: You must provide a detailed, written list of all third parties—identified by name, address, and contact information—who have received, accessed, or purchased their personal information, pursuant to their right to know under Section 1798.115.
4. **Confirmation**: You must provide written confirmation of full compliance with this request within 45 days of receipt, as mandated by Section 1798.130(a)(2), including verification that all deletions (internal and third-party) have been completed.

**Non-Compliance:**
If you refuse or fail to fully comply with any aspect of this request, you are required to provide a detailed legal justification within the 45-day period, explicitly citing the specific CCPA provision(s) (e.g., Section 1798.105(d)(1)-(9)) that you believe exempts you from deletion obligations. Generic or unsubstantiated refusals will be deemed non-compliant. Be advised that partial compliance (e.g., deleting some but not all data) violates Section 1798.105 and will not satisfy this request.

**Consequences of Failure:**
Failure to comply fully and timely with this request will prompt escalation by:
- Filing a formal complaint with the California Attorney General under Section 1798.155 for investigation and enforcement.
- Pursuing private legal action for statutory damages, injunctive relief, and attorney's fees, as permitted under Section 1798.150, should your non-compliance result in unauthorized access or disclosure of personal information.

**Response Deadline:**
I expect your written confirmation of compliance—or a legally substantiated denial—within the mandatory 45-day period, calculated from the date of your receipt of this request, per Section 1798.130(a)(2). For clarity, this deadline is {{deadline}}. Please send your response to {{clientEmail}} and {{clientAddress}}.

This request constitutes formal notice under the CCPA. I recommend retaining a copy of this correspondence for your records, as it may be used in any subsequent legal or regulatory proceedings.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`,
  plainText: `Dear {{companyName}} or Sir/Madam,

I hereby submit a formal and legally binding request for the immediate and permanent deletion of all personal information your company has collected, processed, stored, or disclosed about {{clientName}}, pursuant to Section 1798.105 of the California Consumer Privacy Act (CCPA), California Civil Code §§ 1798.100 et seq.

IDENTIFYING DETAILS:
- Full Name: {{clientName}}
- Address: {{clientAddress}}
- Email Address: {{clientEmail}}
- Phone Number: {{clientPhone}}

LEGAL BASIS FOR THIS REQUEST:
Under Section 1798.105(a) of the CCPA, {{clientName}}, as a California resident, has the unequivocal right to direct your business to delete their personal information from your records. Your company, which operates as a commercial data broker rather than a government-mandated entity (e.g., a credit reporting agency subject to federal regulation), lacks any lawful basis to retain or process their personal information absent explicit consent.

Your potential reliance on a "legitimate business purpose" under Section 1798.105(d) is invalid. The CCPA permits denial of deletion requests only under narrowly defined exceptions (e.g., completing a transaction, complying with legal obligations, or internal uses reasonably aligned with consumer expectations). As a data broker engaged in the collection, sale, or dissemination of personal information for profit, your activities do not meet these criteria. The fundamental right to privacy, as protected by the CCPA and California law, supersedes any commercial interest you may claim.

Furthermore, pursuant to Section 1798.120(a), {{clientName}} explicitly exercises their right to opt out of the sale of their personal information. Given your business's involvement in data trading, you are obligated to honor this opt-out request and cease all sales or disclosures of their data for monetary or other valuable consideration, as defined under Section 1798.140(t).

SCOPE OF THIS REQUEST:
1. Complete Deletion: You must permanently and irreversibly delete all personal information about {{clientName}}—including but not limited to their name, contact details, behavioral data, and any derived or inferred data—from all your databases, systems, backups, and any other storage mechanisms, whether physical or digital.
2. Third-Party Compliance: You must notify all third parties (e.g., service providers, contractors, or data recipients) to whom you have sold, shared, or disclosed their personal information, instructing them to delete it, as required by Section 1798.105(c).
3. Disclosure Report: You must provide a detailed, written list of all third parties—identified by name, address, and contact information—who have received, accessed, or purchased their personal information, pursuant to their right to know under Section 1798.115.
4. Confirmation: You must provide written confirmation of full compliance with this request within 45 days of receipt, as mandated by Section 1798.130(a)(2), including verification that all deletions (internal and third-party) have been completed.

NON-COMPLIANCE:
If you refuse or fail to fully comply with any aspect of this request, you are required to provide a detailed legal justification within the 45-day period, explicitly citing the specific CCPA provision(s) (e.g., Section 1798.105(d)(1)-(9)) that you believe exempts you from deletion obligations. Generic or unsubstantiated refusals will be deemed non-compliant. Be advised that partial compliance (e.g., deleting some but not all data) violates Section 1798.105 and will not satisfy this request.

CONSEQUENCES OF FAILURE:
Failure to comply fully and timely with this request will prompt escalation by:
- Filing a formal complaint with the California Attorney General under Section 1798.155 for investigation and enforcement.
- Pursuing private legal action for statutory damages, injunctive relief, and attorney's fees, as permitted under Section 1798.150, should your non-compliance result in unauthorized access or disclosure of personal information.

RESPONSE DEADLINE:
I expect your written confirmation of compliance—or a legally substantiated denial—within the mandatory 45-day period, calculated from the date of your receipt of this request, per Section 1798.130(a)(2). For clarity, this deadline is {{deadline}}. Please send your response to {{clientEmail}} and {{clientAddress}}.

This request constitutes formal notice under the CCPA. I recommend retaining a copy of this correspondence for your records, as it may be used in any subsequent legal or regulatory proceedings.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`
}

export const GDPR_TEMPLATE = {
  subject: 'Legally Binding Request for Immediate Erasure of Personal Data Pursuant to Article 17 GDPR',
  body: `Dear {{companyName}} or Sir/Madam,

I hereby submit a formal and legally binding request for the immediate and complete erasure of all personal data your organization has collected, processed, stored, or disclosed about {{clientName}}, pursuant to Article 17 of the General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679).

**Identifying Details:**
- Full Name: {{clientName}}
- Address: {{clientAddress}}
- Email Address: {{clientEmail}}
- Phone Number: {{clientPhone}}

**Legal Grounds for This Request:**
Under Article 17(1)(c) GDPR, {{clientName}} is entitled to demand the erasure of their personal data when they object to its processing. They hereby formally exercise their right to object under Article 21(1) GDPR, asserting that your organization's processing lacks a lawful basis and infringes upon their fundamental rights.

Your organization may claim "legitimate interest" under Article 6(1)(f) GDPR as a basis for processing their data. However, this requires a demonstrable balance between your interests and their rights and freedoms, as enshrined in Articles 7 and 8 of the Charter of Fundamental Rights of the European Union. As a commercial data trader—not a legally mandated entity such as a public credit registry—your profit-driven activities do not outweigh their right to privacy. We assert that no compelling legitimate interest exists, and any balancing test under GDPR Recital 47 favors this erasure request.

Additionally, your processing does not qualify as "necessary for the performance of a task carried out in the public interest" under Article 6(1)(e) GDPR, nor do you hold their explicit consent under Article 6(1)(a). Absent a valid legal basis under Article 6, your continued retention or processing of their personal data constitutes a violation of GDPR.

**Scope of This Request:**
1. **Complete Erasure**: You must immediately and irreversibly erase all personal data concerning {{clientName}}—including but not limited to their name, contact details, behavioral profiles, and any derived or inferred data—from all your systems, databases, backups, archives, and any other storage media, whether digital or physical.
2. **Third-Party Compliance**: You must notify all recipients (e.g., processors, controllers, or other third parties) to whom you have disclosed their personal data, instructing them to erase it, as required by Article 19 GDPR. This includes any onward transfers.
3. **Disclosure Report**: You must provide a comprehensive, written list of all recipients—identified by name, address, and contact details—who have received their personal data, pursuant to their right to information under Article 15(1)(c) GDPR.
4. **Confirmation**: You must provide written confirmation of full compliance with this request within one month of receipt, as mandated by Article 12(3) GDPR, verifying that all deletions (internal and third-party) have been executed.

**Non-Compliance:**
If you refuse or fail to fully comply with any part of this request, you are obligated to provide a detailed legal justification within the one-month period, explicitly citing the specific GDPR provision(s) (e.g., Article 17(3)(a)-(e)) that you claim exempts you from erasure obligations. Any refusal must be substantiated with evidence demonstrating that an exception applies (e.g., a legal obligation under Union or Member State law). Vague or unsupported denials will be deemed non-compliant, as will partial erasure that leaves residual data in your systems or with third parties.

**Consequences of Failure:**
Failure to comply fully and within the stipulated timeframe will result in escalation, including:
- Lodging a formal complaint with the national Data Protection Authority under Article 77 GDPR for investigation and enforcement, potentially leading to fines under Article 83.
- Pursuing legal remedies under Article 79 GDPR, including compensation for material or non-material damages under Article 82, should your non-compliance cause harm or unlawful processing.

**Response Deadline:**
I expect your written confirmation of compliance—or a legally substantiated refusal—within the mandatory one-month period from the date of receipt, as per Article 12(3) GDPR. For clarity, this deadline is {{deadline}}. Please send your response to {{clientEmail}} and {{clientAddress}}. Extensions under Article 12(3) will only be accepted with a reasoned justification provided within the initial month.

This request serves as formal notice under GDPR. I advise you to retain a copy of this correspondence, as it may be submitted to a Data Protection Authority or court in any subsequent proceedings.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`,
  plainText: `Dear {{companyName}} or Sir/Madam,

I hereby submit a formal and legally binding request for the immediate and complete erasure of all personal data your organization has collected, processed, stored, or disclosed about {{clientName}}, pursuant to Article 17 of the General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679).

IDENTIFYING DETAILS:
- Full Name: {{clientName}}
- Address: {{clientAddress}}
- Email Address: {{clientEmail}}
- Phone Number: {{clientPhone}}

LEGAL GROUNDS FOR THIS REQUEST:
Under Article 17(1)(c) GDPR, {{clientName}} is entitled to demand the erasure of their personal data when they object to its processing. They hereby formally exercise their right to object under Article 21(1) GDPR, asserting that your organization's processing lacks a lawful basis and infringes upon their fundamental rights.

Your organization may claim "legitimate interest" under Article 6(1)(f) GDPR as a basis for processing their data. However, this requires a demonstrable balance between your interests and their rights and freedoms, as enshrined in Articles 7 and 8 of the Charter of Fundamental Rights of the European Union. As a commercial data trader—not a legally mandated entity such as a public credit registry—your profit-driven activities do not outweigh their right to privacy. We assert that no compelling legitimate interest exists, and any balancing test under GDPR Recital 47 favors this erasure request.

Additionally, your processing does not qualify as "necessary for the performance of a task carried out in the public interest" under Article 6(1)(e) GDPR, nor do you hold their explicit consent under Article 6(1)(a). Absent a valid legal basis under Article 6, your continued retention or processing of their personal data constitutes a violation of GDPR.

SCOPE OF THIS REQUEST:
1. Complete Erasure: You must immediately and irreversibly erase all personal data concerning {{clientName}}—including but not limited to their name, contact details, behavioral profiles, and any derived or inferred data—from all your systems, databases, backups, archives, and any other storage media, whether digital or physical.
2. Third-Party Compliance: You must notify all recipients (e.g., processors, controllers, or other third parties) to whom you have disclosed their personal data, instructing them to erase it, as required by Article 19 GDPR. This includes any onward transfers.
3. Disclosure Report: You must provide a comprehensive, written list of all recipients—identified by name, address, and contact details—who have received their personal data, pursuant to their right to information under Article 15(1)(c) GDPR.
4. Confirmation: You must provide written confirmation of full compliance with this request within one month of receipt, as mandated by Article 12(3) GDPR, verifying that all deletions (internal and third-party) have been executed.

NON-COMPLIANCE:
If you refuse or fail to fully comply with any part of this request, you are obligated to provide a detailed legal justification within the one-month period, explicitly citing the specific GDPR provision(s) (e.g., Article 17(3)(a)-(e)) that you claim exempts you from erasure obligations. Any refusal must be substantiated with evidence demonstrating that an exception applies (e.g., a legal obligation under Union or Member State law). Vague or unsupported denials will be deemed non-compliant, as will partial erasure that leaves residual data in your systems or with third parties.

CONSEQUENCES OF FAILURE:
Failure to comply fully and within the stipulated timeframe will result in escalation, including:
- Lodging a formal complaint with the national Data Protection Authority under Article 77 GDPR for investigation and enforcement, potentially leading to fines under Article 83.
- Pursuing legal remedies under Article 79 GDPR, including compensation for material or non-material damages under Article 82, should your non-compliance cause harm or unlawful processing.

RESPONSE DEADLINE:
I expect your written confirmation of compliance—or a legally substantiated refusal—within the mandatory one-month period from the date of receipt, as per Article 12(3) GDPR. For clarity, this deadline is {{deadline}}. Please send your response to {{clientEmail}} and {{clientAddress}}. Extensions under Article 12(3) will only be accepted with a reasoned justification provided within the initial month.

This request serves as formal notice under GDPR. I advise you to retain a copy of this correspondence, as it may be submitted to a Data Protection Authority or court in any subsequent proceedings.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`
}

export const PIPEDA_TEMPLATE = {
  subject: 'Formal Request for Personal Information Deletion Under PIPEDA',
  body: `Dear {{companyName}} or Sir/Madam,

I hereby submit a formal request for the deletion of all personal information your organization has collected, processed, stored, or disclosed about {{clientName}}, pursuant to the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation.

**Identifying Details:**
- Full Name: {{clientName}}
- Address: {{clientAddress}}
- Email Address: {{clientEmail}}
- Phone Number: {{clientPhone}}

**Legal Basis for This Request:**
Under PIPEDA, {{clientName}} has the right to withdraw consent for the collection, use, and disclosure of their personal information. They hereby formally withdraw all consent previously given, either explicitly or implicitly, for your organization's processing of their personal data.

**Scope of This Request:**
1. **Complete Deletion**: You must permanently delete all personal information about {{clientName}} from all your systems, databases, backups, and storage mechanisms.
2. **Third-Party Notification**: You must notify all third parties to whom you have disclosed their personal information to delete it as well.
3. **Confirmation**: You must provide written confirmation of compliance within 30 days of receipt.

**Response Deadline:**
Please respond within 30 days to {{clientEmail}} and {{clientAddress}}. Deadline: {{deadline}}.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`,
  plainText: `Dear {{companyName}} or Sir/Madam,

I hereby submit a formal request for the deletion of all personal information your organization has collected, processed, stored, or disclosed about {{clientName}}, pursuant to the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation.

IDENTIFYING DETAILS:
- Full Name: {{clientName}}
- Address: {{clientAddress}}
- Email Address: {{clientEmail}}
- Phone Number: {{clientPhone}}

LEGAL BASIS FOR THIS REQUEST:
Under PIPEDA, {{clientName}} has the right to withdraw consent for the collection, use, and disclosure of their personal information. They hereby formally withdraw all consent previously given, either explicitly or implicitly, for your organization's processing of their personal data.

SCOPE OF THIS REQUEST:
1. Complete Deletion: You must permanently delete all personal information about {{clientName}} from all your systems, databases, backups, and storage mechanisms.
2. Third-Party Notification: You must notify all third parties to whom you have disclosed their personal information to delete it as well.
3. Confirmation: You must provide written confirmation of compliance within 30 days of receipt.

RESPONSE DEADLINE:
Please respond within 30 days to {{clientEmail}} and {{clientAddress}}. Deadline: {{deadline}}.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`
}

export const LGPD_TEMPLATE = {
  subject: 'Solicitação Formal de Exclusão de Dados Pessoais - LGPD',
  body: `Prezado(a) {{companyName}} ou Senhor(a),

Por meio desta, submeto uma solicitação formal e juridicamente vinculante para a exclusão imediata e completa de todas as informações pessoais que sua organização coletou, processou, armazenou ou divulgou sobre {{clientName}}, de acordo com o Artigo 18 da Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.

**Dados de Identificação:**
- Nome Completo: {{clientName}}
- Endereço: {{clientAddress}}
- E-mail: {{clientEmail}}
- Telefone: {{clientPhone}}

**Base Legal para esta Solicitação:**
Sob o Artigo 18, inciso VI da LGPD, {{clientName}} tem o direito de solicitar a eliminação dos dados pessoais tratados com o consentimento do titular. Eles exercem formalmente este direito e retiram qualquer consentimento previamente dado para o tratamento de seus dados pessoais.

**Escopo desta Solicitação:**
1. **Exclusão Completa**: Vocês devem excluir permanentemente todas as informações pessoais sobre {{clientName}} de todos os seus sistemas, bancos de dados, backups e mecanismos de armazenamento.
2. **Notificação a Terceiros**: Vocês devem notificar todos os terceiros para quem divulgaram suas informações pessoais para que também as excluam.
3. **Confirmação**: Vocês devem fornecer confirmação por escrito do cumprimento dentro de 15 dias do recebimento.

**Prazo de Resposta:**
Espero sua confirmação por escrito dentro de 15 dias para {{clientEmail}} e {{clientAddress}}. Prazo: {{deadline}}.

Atenciosamente,
Wipe My Trace em nome de {{clientName}}
https://wipemytrace.com`,
  plainText: `Prezado(a) {{companyName}} ou Senhor(a),

Por meio desta, submeto uma solicitação formal e juridicamente vinculante para a exclusão imediata e completa de todas as informações pessoais que sua organização coletou, processou, armazenou ou divulgou sobre {{clientName}}, de acordo com o Artigo 18 da Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.

DADOS DE IDENTIFICAÇÃO:
- Nome Completo: {{clientName}}
- Endereço: {{clientAddress}}
- E-mail: {{clientEmail}}
- Telefone: {{clientPhone}}

BASE LEGAL PARA ESTA SOLICITAÇÃO:
Sob o Artigo 18, inciso VI da LGPD, {{clientName}} tem o direito de solicitar a eliminação dos dados pessoais tratados com o consentimento do titular. Eles exercem formalmente este direito e retiram qualquer consentimento previamente dado para o tratamento de seus dados pessoais.

ESCOPO DESTA SOLICITAÇÃO:
1. Exclusão Completa: Vocês devem excluir permanentemente todas as informações pessoais sobre {{clientName}} de todos os seus sistemas, bancos de dados, backups e mecanismos de armazenamento.
2. Notificação a Terceiros: Vocês devem notificar todos os terceiros para quem divulgaram suas informações pessoais para que também as excluam.
3. Confirmação: Vocês devem fornecer confirmação por escrito do cumprimento dentro de 15 dias do recebimento.

PRAZO DE RESPOSTA:
Espero sua confirmação por escrito dentro de 15 dias para {{clientEmail}} e {{clientAddress}}. Prazo: {{deadline}}.

Atenciosamente,
Wipe My Trace em nome de {{clientName}}
https://wipemytrace.com`
}

// Template processing functions
export function getTemplate(jurisdiction: Jurisdiction) {
  switch (jurisdiction) {
    case Jurisdiction.CCPA:
      return CCPA_TEMPLATE
    case Jurisdiction.GDPR:
      return GDPR_TEMPLATE
    case Jurisdiction.PIPEDA:
      return PIPEDA_TEMPLATE
    case Jurisdiction.LGPD:
      return LGPD_TEMPLATE
    default:
      return CCPA_TEMPLATE
  }
}

export function processTemplate(template: string, variables: TemplateVariables): string {
  let processed = template

  // Replace all template variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    processed = processed.replace(regex, value || '')
  })

  return processed
}

export function generateEmail(jurisdiction: Jurisdiction, variables: TemplateVariables) {
  const template = getTemplate(jurisdiction)

  return {
    subject: processTemplate(template.subject, variables),
    body: processTemplate(template.body, variables),
    plainText: processTemplate(template.plainText, variables)
  }
}

export function calculateDeadline(jurisdiction: Jurisdiction, fromDate: Date = new Date()): string {
  const deadlineDate = new Date(fromDate)

  switch (jurisdiction) {
    case Jurisdiction.CCPA:
      deadlineDate.setDate(deadlineDate.getDate() + 45)
      break
    case Jurisdiction.GDPR:
      deadlineDate.setMonth(deadlineDate.getMonth() + 1)
      break
    case Jurisdiction.PIPEDA:
      deadlineDate.setDate(deadlineDate.getDate() + 30)
      break
    case Jurisdiction.LGPD:
      deadlineDate.setDate(deadlineDate.getDate() + 15)
      break
    default:
      deadlineDate.setDate(deadlineDate.getDate() + 30)
  }

  return deadlineDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Follow-up templates
export const FOLLOW_UP_TEMPLATE = {
  subject: 'Follow-up: Data Deletion Request - {{jurisdiction}} Compliance Required',
  body: `Dear {{companyName}},

This is a follow-up to our data deletion request sent on {{originalDate}} regarding {{clientName}}'s personal information.

We have not yet received confirmation of compliance with our legally binding deletion request. As per {{jurisdiction}} regulations, you are required to respond within the specified timeframe.

**Original Request Details:**
- Subject: {{originalSubject}}
- Date Sent: {{originalDate}}
- Deadline: {{deadline}}

**Required Actions:**
1. Confirm deletion of all personal data
2. Provide written confirmation of compliance
3. Report any third-party disclosures and their deletion status

Please respond immediately to avoid escalation to regulatory authorities.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`,
  plainText: `Dear {{companyName}},

This is a follow-up to our data deletion request sent on {{originalDate}} regarding {{clientName}}'s personal information.

We have not yet received confirmation of compliance with our legally binding deletion request. As per {{jurisdiction}} regulations, you are required to respond within the specified timeframe.

ORIGINAL REQUEST DETAILS:
- Subject: {{originalSubject}}
- Date Sent: {{originalDate}}
- Deadline: {{deadline}}

REQUIRED ACTIONS:
1. Confirm deletion of all personal data
2. Provide written confirmation of compliance
3. Report any third-party disclosures and their deletion status

Please respond immediately to avoid escalation to regulatory authorities.

Sincerely,
Wipe My Trace on behalf of {{clientName}}
https://wipemytrace.com`
}
