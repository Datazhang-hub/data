'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, isAdmin } from '@/app/lib/auth';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  channel: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'replied';
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    if (!isLoggedIn() || !isAdmin()) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // 获取联系记录
  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch('/api/contacts');
        if (!response.ok) {
          throw new Error('获取联系记录失败');
        }
        const data = await response.json();
        setContacts(data.contacts || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  // 更新联系记录状态
  const handleStatusUpdate = async (id: string, status: Contact['status']) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('更新状态失败');
      }

      // 更新本地状态
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status } : contact
      ));
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">联系记录管理</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/admin/dashboard" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                返回管理面板
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无联系记录</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {contact.name}
                            {contact.company && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({contact.company})
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{contact.email}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            了解渠道: {contact.channel || '未知'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contact.status === 'unread' 
                              ? 'bg-red-100 text-red-800' 
                              : contact.status === 'read'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {contact.status === 'unread' ? '未读' : contact.status === 'read' ? '已读' : '已回复'}
                          </span>
                          <select
                            value={contact.status}
                            onChange={(e) => handleStatusUpdate(contact.id, e.target.value as Contact['status'])}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="unread">未读</option>
                            <option value="read">已读</option>
                            <option value="replied">已回复</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-900">{contact.message}</div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(contact.created_at).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 