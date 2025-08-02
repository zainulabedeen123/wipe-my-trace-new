import { prisma } from '@/lib/prisma'
import { Jurisdiction, TemplateType } from '@prisma/client'
import {
  getTemplate,
  calculateDeadline,
  TemplateVariables,
  FOLLOW_UP_TEMPLATE,
  processTemplate
} from '@/lib/email-templates'

export class EmailTemplateService {
  // Get template from database or fallback to default
  static async getEmailTemplate(
    jurisdiction: Jurisdiction, 
    templateType: TemplateType = TemplateType.INITIAL_REQUEST,
    companyId?: string
  ) {
    // Try to get company-specific template first
    if (companyId) {
      const companyTemplate = await prisma.emailTemplate.findFirst({
        where: {
          companyId,
          jurisdiction,
          templateType,
          isActive: true
        }
      })
      
      if (companyTemplate) {
        return companyTemplate
      }
    }
    
    // Try to get default template for jurisdiction
    const defaultTemplate = await prisma.emailTemplate.findFirst({
      where: {
        companyId: null,
        jurisdiction,
        templateType,
        isDefault: true,
        isActive: true
      }
    })
    
    if (defaultTemplate) {
      return defaultTemplate
    }
    
    // Fallback to hardcoded template
    const template = getTemplate(jurisdiction)
    return {
      id: 'fallback',
      subject: template.subject,
      body: template.body,
      plainText: template.plainText,
      jurisdiction,
      templateType
    }
  }
  
  // Generate email content for a deletion request
  static async generateDeletionEmail(
    userId: string,
    companyId: string,
    jurisdiction: Jurisdiction,
    templateType: TemplateType = TemplateType.INITIAL_REQUEST
  ) {
    // Get user and company data
    const [user, company] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.company.findUnique({ where: { id: companyId } })
    ])
    
    if (!user || !company) {
      throw new Error('User or company not found')
    }
    
    // Get template
    const template = await this.getEmailTemplate(jurisdiction, templateType, companyId)
    
    // Prepare template variables
    const variables: TemplateVariables = {
      clientName: `${user.firstName} ${user.lastName}`.trim() || user.email,
      clientEmail: user.email,
      clientPhone: user.phone || '',
      clientAddress: [user.address, user.city, user.state, user.zipCode]
        .filter(Boolean)
        .join(', '),
      companyName: company.name,
      deadline: calculateDeadline(jurisdiction)
    }
    
    // Process template
    return {
      subject: processTemplate(template.subject, variables),
      body: processTemplate(template.body, variables),
      plainText: processTemplate(template.plainText || template.body, variables),
      templateId: template.id !== 'fallback' ? template.id : null
    }
  }
  
  // Generate follow-up email
  static async generateFollowUpEmail(
    deletionRequestId: string
  ) {
    const deletionRequest = await prisma.deletionRequest.findUnique({
      where: { id: deletionRequestId },
      include: {
        user: true,
        company: true,
        emailLogs: {
          orderBy: { sentAt: 'asc' },
          take: 1
        }
      }
    })
    
    if (!deletionRequest) {
      throw new Error('Deletion request not found')
    }
    
    const originalEmail = deletionRequest.emailLogs[0]
    
    const variables = {
      clientName: deletionRequest.requestorName,
      clientEmail: deletionRequest.requestorEmail,
      clientPhone: deletionRequest.requestorPhone || '',
      clientAddress: deletionRequest.requestorAddress || '',
      companyName: deletionRequest.company.name,
      deadline: calculateDeadline(deletionRequest.jurisdiction, deletionRequest.createdAt),
      jurisdiction: deletionRequest.jurisdiction,
      originalDate: deletionRequest.createdAt.toLocaleDateString(),
      originalSubject: originalEmail?.subject || 'Data Deletion Request'
    }
    
    return {
      subject: processTemplate(FOLLOW_UP_TEMPLATE.subject, variables),
      body: processTemplate(FOLLOW_UP_TEMPLATE.body, variables),
      plainText: processTemplate(FOLLOW_UP_TEMPLATE.plainText, variables)
    }
  }
  
  // Create or update email template in database
  static async upsertTemplate(
    jurisdiction: Jurisdiction,
    templateType: TemplateType,
    subject: string,
    body: string,
    plainText?: string,
    companyId?: string,
    isDefault: boolean = false
  ) {
    return await prisma.emailTemplate.upsert({
      where: {
        id: `${jurisdiction}-${templateType}-${companyId || 'default'}`
      },
      update: {
        subject,
        body,
        plainText,
        isDefault,
        isActive: true
      },
      create: {
        jurisdiction,
        templateType,
        subject,
        body,
        plainText,
        companyId,
        isDefault,
        isActive: true
      }
    })
  }
  
  // Seed default templates
  static async seedDefaultTemplates() {
    const jurisdictions = [Jurisdiction.CCPA, Jurisdiction.GDPR, Jurisdiction.PIPEDA, Jurisdiction.LGPD]
    
    for (const jurisdiction of jurisdictions) {
      const template = getTemplate(jurisdiction)
      
      await this.upsertTemplate(
        jurisdiction,
        TemplateType.INITIAL_REQUEST,
        template.subject,
        template.body,
        template.plainText,
        undefined, // no company ID for default templates
        true // is default
      )
    }
    
    console.log('✅ Default email templates seeded')
  }
  
  // Get all templates for admin management
  static async getAllTemplates() {
    return await prisma.emailTemplate.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { jurisdiction: 'asc' },
        { templateType: 'asc' },
        { isDefault: 'desc' }
      ]
    })
  }
  
  // Deactivate template
  static async deactivateTemplate(templateId: string) {
    return await prisma.emailTemplate.update({
      where: { id: templateId },
      data: { isActive: false }
    })
  }
}
