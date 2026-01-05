import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, User, Mail, Linkedin, X, Edit2, Trash2, Coffee } from 'lucide-react';
import { CoffeeChat, CreateCoffeeChatData } from '../../types/coffeeChat';
import { CoffeeChatService } from '../../services/coffeeChatService';
import { useToastContext } from '../ui/ToastProvider';

interface CoffeeChatTrackerProps {
  userId: string;
}

const CoffeeChatTracker: React.FC<CoffeeChatTrackerProps> = ({ userId }) => {
  const [chats, setChats] = useState<CoffeeChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChat, setEditingChat] = useState<CoffeeChat | null>(null);
  const [formData, setFormData] = useState<CreateCoffeeChatData>({
    contact_name: '',
    contact_title: '',
    contact_company: '',
    contact_email: '',
    contact_linkedin: '',
    chat_date: '',
    chat_type: 'coffee_chat',
    location: '',
    notes: '',
    follow_up_date: '',
    status: 'scheduled'
  });
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    loadCoffeeChats();
  }, [userId]);

  const loadCoffeeChats = async () => {
    try {
      setLoading(true);
      const data = await CoffeeChatService.getCoffeeChats(userId);
      setChats(data);
    } catch (error: any) {
      showError(error.message || 'Failed to load coffee chats');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChat) {
        await CoffeeChatService.updateCoffeeChat(userId, editingChat.id, formData);
        showSuccess('Coffee chat updated successfully');
      } else {
        await CoffeeChatService.createCoffeeChat(userId, formData);
        showSuccess('Coffee chat added successfully');
      }
      setShowModal(false);
      setEditingChat(null);
      resetForm();
      loadCoffeeChats();
    } catch (error: any) {
      showError(error.message || 'Failed to save coffee chat');
    }
  };

  const handleEdit = (chat: CoffeeChat) => {
    setEditingChat(chat);
    setFormData({
      contact_name: chat.contact_name,
      contact_title: chat.contact_title || '',
      contact_company: chat.contact_company || '',
      contact_email: chat.contact_email || '',
      contact_linkedin: chat.contact_linkedin || '',
      chat_date: chat.chat_date ? new Date(chat.chat_date).toISOString().split('T')[0] : '',
      chat_type: chat.chat_type,
      location: chat.location || '',
      notes: chat.notes || '',
      follow_up_date: chat.follow_up_date ? new Date(chat.follow_up_date).toISOString().split('T')[0] : '',
      status: chat.status
    });
    setShowModal(true);
  };

  const handleDelete = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this coffee chat?')) return;
    try {
      await CoffeeChatService.deleteCoffeeChat(userId, chatId);
      showSuccess('Coffee chat deleted successfully');
      loadCoffeeChats();
    } catch (error: any) {
      showError(error.message || 'Failed to delete coffee chat');
    }
  };

  const resetForm = () => {
    setFormData({
      contact_name: '',
      contact_title: '',
      contact_company: '',
      contact_email: '',
      contact_linkedin: '',
      chat_date: '',
      chat_type: 'coffee_chat',
      location: '',
      notes: '',
      follow_up_date: '',
      status: 'scheduled'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case 'coffee_chat': return <Coffee className="w-4 h-4" />;
      case 'informational': return <User className="w-4 h-4" />;
      case 'networking': return <Linkedin className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">Loading coffee chats...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Coffee className="w-6 h-6" />
          Coffee Chat Tracker
        </h3>
        <button
          onClick={() => {
            resetForm();
            setEditingChat(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Coffee Chat
        </button>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No coffee chats yet. Start networking by adding your first coffee chat!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {chat.contact_name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                      {chat.status}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      {getChatTypeIcon(chat.chat_type)}
                      <span className="text-xs capitalize">{chat.chat_type.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                    {chat.contact_title && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{chat.contact_title}</span>
                      </div>
                    )}
                    {chat.contact_company && (
                      <div className="flex items-center gap-2">
                        <span>{chat.contact_company}</span>
                      </div>
                    )}
                    {chat.chat_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(chat.chat_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {chat.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{chat.location}</span>
                      </div>
                    )}
                    {chat.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${chat.contact_email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {chat.contact_email}
                        </a>
                      </div>
                    )}
                    {chat.contact_linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        <a href={chat.contact_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>

                  {chat.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{chat.notes}</p>
                    </div>
                  )}

                  {chat.follow_up_date && (
                    <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      Follow-up: {new Date(chat.follow_up_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(chat)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingChat ? 'Edit Coffee Chat' : 'Add Coffee Chat'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingChat(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Title
                  </label>
                  <input
                    type="text"
                    value={formData.contact_title}
                    onChange={(e) => setFormData({ ...formData, contact_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.contact_company}
                    onChange={(e) => setFormData({ ...formData, contact_company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.contact_linkedin}
                    onChange={(e) => setFormData({ ...formData, contact_linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chat Type
                  </label>
                  <select
                    value={formData.chat_type}
                    onChange={(e) => setFormData({ ...formData, chat_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="coffee_chat">Coffee Chat</option>
                    <option value="informational">Informational</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chat Date
                  </label>
                  <input
                    type="date"
                    value={formData.chat_date}
                    onChange={(e) => setFormData({ ...formData, chat_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Virtual, Starbucks Downtown"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add any notes about the conversation, topics discussed, or action items..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingChat(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingChat ? 'Update' : 'Add'} Coffee Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeChatTracker;

