import { Injectable, Logger } from '@nestjs/common'
import * as Handlebars from 'handlebars'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { TemplateDefinition, TemplateManager } from './email.interface'

@Injectable()
export class HandlebarsTemplateManager implements TemplateManager {
  private readonly logger = new Logger(HandlebarsTemplateManager.name)
  private readonly templateCache = new Map<string, TemplateDefinition>()
  private readonly compiledCache = new Map<string, Handlebars.TemplateDelegate<any>>()
  private readonly templatesPath: string

  constructor() {
    this.templatesPath = join(__dirname, 'templates')
    this.registerHelpers()
  }

  private registerHelpers() {
    // Register common Handlebars helpers
    Handlebars.registerHelper('formatDate', (date: Date | string, format?: string) => {
      const d = typeof date === 'string' ? new Date(date) : date
      if (format === 'short') {
        return d.toLocaleDateString()
      }
      return d.toLocaleString()
    })

    Handlebars.registerHelper('uppercase', (str: string) => str?.toUpperCase() || '')
    Handlebars.registerHelper('lowercase', (str: string) => str?.toLowerCase() || '')
    
    Handlebars.registerHelper('eq', (a: any, b: any) => a === b)
    Handlebars.registerHelper('ne', (a: any, b: any) => a !== b)
    Handlebars.registerHelper('or', (...args: any[]) => {
      // Remove the options argument that Handlebars adds
      const values = args.slice(0, -1)
      return values.some(Boolean)
    })
  }

  async getTemplate(templateId: string): Promise<TemplateDefinition> {
    if (this.templateCache.has(templateId)) {
      return this.templateCache.get(templateId)!
    }

    try {
      const templatePath = join(this.templatesPath, `${templateId}.json`)
      const templateContent = await readFile(templatePath, 'utf-8')
      const template = JSON.parse(templateContent) as TemplateDefinition

      // Load the HTML template file
      const htmlPath = join(this.templatesPath, `${templateId}.html`)
      template.htmlTemplate = await readFile(htmlPath, 'utf-8')

      // Try to load text template if it exists
      try {
        const textPath = join(this.templatesPath, `${templateId}.txt`)
        template.textTemplate = await readFile(textPath, 'utf-8')
      } catch {
        // Text template is optional
      }

      this.templateCache.set(templateId, template)
      return template
    } catch (error) {
      this.logger.error(`Failed to load template ${templateId}:`, (error as Error).message)
      throw new Error(`Template ${templateId} not found or invalid`)
    }
  }

  async renderTemplate(templateId: string, variables: Record<string, any>): Promise<{
    subject: string
    html: string
    text?: string
  }> {
    const template = await this.getTemplate(templateId)
    
    // Validate required variables
    const missingVars = template.requiredVariables.filter(varName => 
      !(varName in variables) || variables[varName] === null || variables[varName] === undefined
    )
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required template variables: ${missingVars.join(', ')}`)
    }

    try {
      // Compile and render subject
      const subjectCompiled = Handlebars.compile(template.subject)
      const subject = subjectCompiled(variables)

      // Compile and render HTML
      let htmlCompiled = this.compiledCache.get(`${templateId}-html`)
      if (!htmlCompiled) {
        htmlCompiled = Handlebars.compile(template.htmlTemplate)
        this.compiledCache.set(`${templateId}-html`, htmlCompiled)
      }
      const html = htmlCompiled(variables)

      // Compile and render text if available
      let text: string | undefined
      if (template.textTemplate) {
        let textCompiled = this.compiledCache.get(`${templateId}-text`)
        if (!textCompiled) {
          textCompiled = Handlebars.compile(template.textTemplate)
          this.compiledCache.set(`${templateId}-text`, textCompiled)
        }
        text = textCompiled(variables)
      }

      return { subject, html, text }
    } catch (error) {
      this.logger.error(`Failed to render template ${templateId}:`, (error as Error).message)
      throw new Error(`Template rendering failed: ${(error as Error).message}`)
    }
  }

  // Clear cache for development/testing
  clearCache(templateId?: string) {
    if (templateId) {
      this.templateCache.delete(templateId)
      this.compiledCache.delete(`${templateId}-html`)
      this.compiledCache.delete(`${templateId}-text`)
    } else {
      this.templateCache.clear()
      this.compiledCache.clear()
    }
  }
}