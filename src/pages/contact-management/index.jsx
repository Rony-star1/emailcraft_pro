import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
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

  async function getContacts() {
    const { data } = await supabase.from('contacts').select();
    setContacts(data);
  }

  useEffect(() => {
    getContacts();
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
      await supabase.from('contacts').update(contactData).eq('id', editingContact.id);
    } else {
      // Add new contact
      await supabase.from('contacts').insert(contactData);
    }
    getContacts();
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await supabase.from('contacts').delete().eq('id', contactId);
      getContacts();
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
      await supabase.from('contacts').delete().in('id', selectedContacts);
    } else if (action === 'edit') {
      await supabase.from('contacts').update(updates).in('id', selectedContacts);
    }
    getContacts();
    setSelectedContacts([]);
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