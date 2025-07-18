import React, { useState, useEffect, useMemo } from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import ContactActions from './components/ContactActions';
import ContactFilters from './components/ContactFilters';
import ContactTable from './components/ContactTable';
import CSVImportModal from './components/CSVImportModal';
import ContactFormModal from './components/ContactFormModal';
import BulkActionsModal from './components/BulkActionsModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEngagement, setSelectedEngagement] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isMobile, setIsMobile] = useState(false);

  // Modal states
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [bulkActionType, setBulkActionType] = useState('edit');

  // Mock data
  const mockContacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      subscriptionDate: "2024-01-15",
      status: "active",
      engagement: "high",
      tags: ["customer", "vip", "newsletter"],
      source: "Website",
      lastActivity: "2024-01-20",
      notes: "High-value customer interested in premium features"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      subscriptionDate: "2024-01-10",
      status: "active",
      engagement: "medium",
      tags: ["prospect", "webinar"],
      source: "Social Media",
      lastActivity: "2024-01-18",
      notes: "Attended product demo webinar"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      subscriptionDate: "2024-01-08",
      status: "unsubscribed",
      engagement: "low",
      tags: ["former-customer"],
      source: "Email Campaign",
      lastActivity: "2024-01-12",
      notes: "Unsubscribed due to frequency concerns"
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@email.com",
      subscriptionDate: "2024-01-05",
      status: "active",
      engagement: "high",
      tags: ["customer", "beta-tester", "feedback"],
      source: "Referral",
      lastActivity: "2024-01-22",
      notes: "Active beta tester providing valuable feedback"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      subscriptionDate: "2024-01-03",
      status: "bounced",
      engagement: "none",
      tags: ["prospect"],
      source: "Event",
      lastActivity: "2024-01-03",
      notes: "Email bounced - need to verify address"
    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@email.com",
      subscriptionDate: "2023-12-28",
      status: "active",
      engagement: "medium",
      tags: ["newsletter", "blog-subscriber"],
      source: "Website",
      lastActivity: "2024-01-19",
      notes: "Regular blog reader and newsletter subscriber"
    },
    {
      id: 7,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      subscriptionDate: "2023-12-25",
      status: "active",
      engagement: "high",
      tags: ["customer", "advocate", "referrer"],
      source: "Manual Entry",
      lastActivity: "2024-01-21",
      notes: "Brand advocate who refers new customers"
    },
    {
      id: 8,
      name: "Robert Kim",
      email: "robert.kim@email.com",
      subscriptionDate: "2023-12-20",
      status: "active",
      engagement: "low",
      tags: ["prospect", "trial-user"],
      source: "Website",
      lastActivity: "2024-01-10",
      notes: "Currently on free trial, low engagement"
    }
  ];

  useEffect(() => {
    setContacts(mockContacts);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = !searchTerm || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSegment = selectedSegment === 'all' || 
        contact.tags.some(tag => tag.toLowerCase().includes(selectedSegment.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
      
      const matchesEngagement = selectedEngagement === 'all' || contact.engagement === selectedEngagement;

      return matchesSearch && matchesSegment && matchesStatus && matchesEngagement;
    });

    // Sort contacts
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'subscriptionDate' || sortField === 'lastActivity') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [contacts, searchTerm, selectedSegment, selectedStatus, selectedEngagement, sortField, sortDirection]);

  // Contact selection handlers
  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredAndSortedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredAndSortedContacts.map(contact => contact.id));
    }
  };

  // Filter handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSegment('all');
    setSelectedStatus('all');
    setSelectedEngagement('all');
  };

  // Sort handler
  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Contact CRUD handlers
  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsContactFormOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    if (editingContact) {
      // Update existing contact
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id 
          ? { 
              ...contact, 
              ...contactData,
              lastActivity: new Date().toISOString().split('T')[0]
            }
          : contact
      ));
    } else {
      // Add new contact
      const newContact = {
        id: Date.now(),
        ...contactData,
        subscriptionDate: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        status: 'active',
        engagement: 'none'
      };
      setContacts(prev => [...prev, newContact]);
    }
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  // CSV Import handler
  const handleCSVImport = (importData) => {
    const newContacts = importData.contacts.map((contact, index) => ({
      id: Date.now() + index,
      ...contact,
      subscriptionDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      status: 'active',
      engagement: 'none'
    }));

    setContacts(prev => [...prev, ...newContacts]);
  };

  // Export handler
  const handleExportContacts = () => {
    const csvContent = [
      ['Name', 'Email', 'Status', 'Engagement', 'Tags', 'Source', 'Subscription Date', 'Last Activity'],
      ...filteredAndSortedContacts.map(contact => [
        contact.name,
        contact.email,
        contact.status,
        contact.engagement,
        contact.tags.join(';'),
        contact.source,
        contact.subscriptionDate,
        contact.lastActivity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Bulk actions
  const handleBulkEdit = () => {
    setBulkActionType('edit');
    setIsBulkModalOpen(true);
  };

  const handleBulkDelete = () => {
    setBulkActionType('delete');
    setIsBulkModalOpen(true);
  };

  const handleBulkAction = async ({ action, updates }) => {
    if (action === 'delete') {
      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
    } else if (action === 'edit') {
      setContacts(prev => prev.map(contact => {
        if (!selectedContacts.includes(contact.id)) return contact;

        const updatedContact = { ...contact };

        if (updates.addTags) {
          updatedContact.tags = [...new Set([...updatedContact.tags, ...updates.addTags])];
        }

        if (updates.removeTags) {
          updatedContact.tags = updatedContact.tags.filter(tag => 
            !updates.removeTags.includes(tag)
          );
        }

        if (updates.source) {
          updatedContact.source = updates.source;
        }

        if (updates.status) {
          updatedContact.status = updates.status;
        }

        updatedContact.lastActivity = new Date().toISOString().split('T')[0];

        return updatedContact;
      }));
      setSelectedContacts([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Contact Management</h1>
            <p className="text-text-secondary">
              Organize, import, and segment your email subscribers for targeted campaigns
            </p>
          </div>

          {/* Contact Actions */}
          <div className="mb-6">
            <ContactActions
              selectedContacts={selectedContacts}
              onAddContact={handleAddContact}
              onImportCSV={() => setIsCSVModalOpen(true)}
              onExportContacts={handleExportContacts}
              onBulkDelete={handleBulkDelete}
              onBulkEdit={handleBulkEdit}
              totalContacts={contacts.length}
            />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ContactFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSegment={selectedSegment}
              onSegmentChange={setSelectedSegment}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedEngagement={selectedEngagement}
              onEngagementChange={setSelectedEngagement}
              onClearFilters={handleClearFilters}
              totalContacts={contacts.length}
              filteredCount={filteredAndSortedContacts.length}
            />
          </div>

          {/* Contact Table */}
          <ContactTable
            contacts={filteredAndSortedContacts}
            selectedContacts={selectedContacts}
            onSelectContact={handleSelectContact}
            onSelectAll={handleSelectAll}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            isMobile={isMobile}
          />

          {/* Empty State */}
          {filteredAndSortedContacts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                <Icon name="Users" size={32} className="text-secondary-500" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {contacts.length === 0 ? 'No contacts yet' : 'No contacts match your filters'}
              </h3>
              <p className="text-text-secondary mb-6">
                {contacts.length === 0 
                  ? 'Get started by adding your first contact or importing from CSV' :'Try adjusting your search terms or filters to find contacts'
                }
              </p>
              {contacts.length === 0 && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="primary"
                    onClick={handleAddContact}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Add First Contact
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCSVModalOpen(true)}
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Import CSV
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImport={handleCSVImport}
      />

      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
        isEditing={!!editingContact}
      />

      <BulkActionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedContacts={selectedContacts}
        actionType={bulkActionType}
        onConfirm={handleBulkAction}
      />
    </div>
  );
};

export default ContactManagement;