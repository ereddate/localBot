import { Tool, ToolCategory, ToolType } from './SkillManager';

export class ContactManagementTool implements Tool {
  name = 'contact_management_tool';
  type: ToolType = 'function';
  category: ToolCategory = 'communication';
  description = 'Manages contacts, relationships, and communications with individuals or organizations.';
  parameters = {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['create', 'update', 'delete', 'search', 'list', 'add_interaction', 'get_details'],
        description: 'Operation to perform on contacts'
      },
      contactData: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the contact' },
          firstName: { type: 'string', description: 'First name of the contact' },
          lastName: { type: 'string', description: 'Last name of the contact' },
          email: { type: 'string', format: 'email', description: 'Email address of the contact' },
          phone: { type: 'string', description: 'Phone number of the contact' },
          company: { type: 'string', description: 'Company name of the contact' },
          title: { type: 'string', description: 'Job title of the contact' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags to categorize the contact'
          }
        },
        description: 'Contact information for create/update operations'
      },
      searchParams: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query term' },
          field: { type: 'string', enum: ['name', 'email', 'company', 'tag'], description: 'Field to search in' },
          limit: { type: 'number', description: 'Maximum number of results to return' }
        },
        description: 'Parameters for search operations'
      },
      contactId: {
        type: 'string',
        description: 'ID of the contact for specific operations'
      }
    },
    required: ['operation']
  };

  async execute(params: any): Promise<any> {
    try {
      const { operation, contactData, searchParams, contactId } = params;
      
      switch(operation) {
        case 'create':
          return this.createContact(contactData);
        case 'update':
          return this.updateContact(contactId, contactData);
        case 'delete':
          return this.deleteContact(contactId);
        case 'search':
          return this.searchContacts(searchParams);
        case 'list':
          return this.listContacts(searchParams?.limit || 50);
        case 'add_interaction':
          return this.addInteraction(contactId, contactData?.interaction);
        case 'get_details':
          return this.getContactDetails(contactId);
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      return { error: `Failed to execute contact management operation: ${error.message}` };
    }
  }

  private async createContact(contactData: any): Promise<any> {
    if (!contactData.firstName && !contactData.lastName && !contactData.email) {
      throw new Error('Contact must have at least a name or email');
    }
    
    const contact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      interactions: [],
      tags: contactData.tags || []
    };
    
    // In a real implementation, this would save to a database
    return {
      success: true,
      contact: contact,
      message: 'Contact created successfully'
    };
  }

  private async updateContact(contactId: string, contactData: any): Promise<any> {
    if (!contactId) {
      throw new Error('Contact ID is required for update operation');
    }
    
    // Simulate retrieving existing contact
    const existingContact = {
      id: contactId,
      firstName: 'Existing',
      lastName: 'Contact',
      email: 'existing@example.com',
      company: 'Existing Corp',
      title: 'Manager',
      tags: ['client', 'important'],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      interactions: []
    };
    
    // Merge updated data with existing contact
    const updatedContact = {
      ...existingContact,
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      contact: updatedContact,
      message: 'Contact updated successfully'
    };
  }

  private async deleteContact(contactId: string): Promise<any> {
    if (!contactId) {
      throw new Error('Contact ID is required for delete operation');
    }
    
    // In a real implementation, this would delete from a database
    return {
      success: true,
      deletedContactId: contactId,
      message: 'Contact deleted successfully'
    };
  }

  private async searchContacts(searchParams: any): Promise<any> {
    const { query = '', field = 'name', limit = 10 } = searchParams || {};
    
    // Simulate search results
    const mockContacts = [
      { id: 'c1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', company: 'ABC Corp', title: 'Director', tags: ['client', 'vip'] },
      { id: 'c2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', company: 'XYZ Inc', title: 'VP', tags: ['partner', 'important'] },
      { id: 'c3', firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', company: 'Tech Solutions', title: 'CTO', tags: ['vendor', 'tech'] },
      { id: 'c4', firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', company: 'Global Services', title: 'CEO', tags: ['client', 'decision-maker'] },
      { id: 'c5', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', company: 'Innovate Co', title: 'Lead Developer', tags: ['developer', 'tech'] }
    ];
    
    // Filter based on search criteria
    let results = mockContacts;
    
    if (query) {
      results = results.filter(contact => {
        switch(field) {
          case 'name':
            return (
              contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
              contact.lastName.toLowerCase().includes(query.toLowerCase())
            );
          case 'email':
            return contact.email.toLowerCase().includes(query.toLowerCase());
          case 'company':
            return contact.company.toLowerCase().includes(query.toLowerCase());
          case 'tag':
            return contact.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()));
          default:
            return true;
        }
      });
    }
    
    // Apply limit
    results = results.slice(0, limit);
    
    return {
      success: true,
      results: results,
      totalCount: results.length,
      query: searchParams,
      message: `Found ${results.length} contacts matching the criteria`
    };
  }

  private async listContacts(limit: number): Promise<any> {
    // Simulate listing contacts
    const mockContacts = [
      { id: 'c1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', company: 'ABC Corp', title: 'Director', tags: ['client', 'vip'] },
      { id: 'c2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', company: 'XYZ Inc', title: 'VP', tags: ['partner', 'important'] },
      { id: 'c3', firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', company: 'Tech Solutions', title: 'CTO', tags: ['vendor', 'tech'] },
      { id: 'c4', firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', company: 'Global Services', title: 'CEO', tags: ['client', 'decision-maker'] },
      { id: 'c5', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', company: 'Innovate Co', title: 'Lead Developer', tags: ['developer', 'tech'] }
    ];
    
    const results = mockContacts.slice(0, limit);
    
    return {
      success: true,
      contacts: results,
      totalCount: mockContacts.length,
      limit: limit,
      message: `Retrieved ${results.length} contacts`
    };
  }

  private async addInteraction(contactId: string, interactionData: any): Promise<any> {
    if (!contactId) {
      throw new Error('Contact ID is required to add interaction');
    }
    
    if (!interactionData) {
      throw new Error('Interaction data is required');
    }
    
    // Simulate adding interaction to contact
    const interaction = {
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contactId,
      type: interactionData.type || 'meeting',
      subject: interactionData.subject || 'General Interaction',
      notes: interactionData.notes || '',
      timestamp: new Date().toISOString(),
      outcome: interactionData.outcome || 'pending'
    };
    
    return {
      success: true,
      interaction: interaction,
      message: 'Interaction added to contact successfully'
    };
  }

  private async getContactDetails(contactId: string): Promise<any> {
    if (!contactId) {
      throw new Error('Contact ID is required to get details');
    }
    
    // Simulate retrieving contact details
    const contact = {
      id: contactId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      company: 'ABC Corporation',
      title: 'Chief Technology Officer',
      address: '123 Business Ave, City, State 12345',
      tags: ['client', 'VIP', 'decision-maker'],
      createdAt: '2023-01-15T08:30:00Z',
      updatedAt: new Date().toISOString(),
      interactions: [
        {
          id: 'int_1',
          type: 'meeting',
          subject: 'Quarterly Review',
          notes: 'Discussed upcoming project requirements',
          timestamp: '2023-10-01T10:00:00Z',
          outcome: 'positive'
        },
        {
          id: 'int_2',
          type: 'email',
          subject: 'Follow-up Questions',
          notes: 'Sent additional information about our services',
          timestamp: '2023-10-05T14:30:00Z',
          outcome: 'pending'
        }
      ],
      nextAction: {
        type: 'call',
        scheduledFor: '2023-10-20T11:00:00Z',
        purpose: 'Discuss contract renewal'
      }
    };
    
    return {
      success: true,
      contact: contact,
      message: 'Contact details retrieved successfully'
    };
  }
}