'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, logout, isAdmin } from '@/app/lib/auth';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  demo_url: string;
  type: 'visualization' | 'document';
  date: string;
  created_at: string;
  updated_at: string;
  status: 'online' | 'offline';
  content?: string;
}

// 项目类型选择弹窗组件
function ProjectTypeModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (type: 'visualization' | 'document') => void }) {
  if (!isOpen) return null;
  
  const projectTypes = [
    {
      type: 'visualization',
      title: '可视化项目',
      description: '适用于Power BI、Tableau等数据可视化看板项目',
      icon: '📊'
    },
    {
      type: 'document',
      title: '图文案例项目',
      description: '适用于数据分析案例、方法论介绍、代码展示等项目',
      icon: '📝'
    }
  ];
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  选择项目类型
                </h3>
                
                <div className="mt-2 space-y-4">
                  {projectTypes.map((projectType) => (
                    <div 
                      key={projectType.type}
                      className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onSelect(projectType.type as 'visualization' | 'document')}
                    >
                      <div className="flex-shrink-0 text-3xl mr-4">
                        {projectType.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{projectType.title}</h4>
                        <p className="text-sm text-gray-500">{projectType.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'visualization' | 'document'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [databaseError, setDatabaseError] = useState<boolean>(false);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 检查是否已登录
    if (!isLoggedIn() || !isAdmin()) {
      router.push('/admin/login');
      return;
    }
    
    console.log('筛选条件变化，重新加载项目:', { statusFilter, typeFilter, sortBy, sortOrder });
    // 加载项目数据
    fetchProjects();
  }, [router, statusFilter, typeFilter, sortBy, sortOrder]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // 构建请求URL，确保所有参数都正确传递
      const url = new URL('/api/projects', window.location.origin);
      url.searchParams.append('status', statusFilter);
      url.searchParams.append('type', typeFilter);
      url.searchParams.append('sortBy', sortBy);
      url.searchParams.append('order', sortOrder);
      url.searchParams.append('admin', 'true'); // 标记为管理页面请求
      
      console.log('获取项目列表:', url.toString());
      
      const response = await fetch(url.toString());
      
      // 检查响应类型，确保是JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('响应不是JSON格式:', contentType);
        setError(`服务器返回了非JSON格式响应: ${contentType}`);
        setLoading(false);
        return;
      }
      
      // 先以文本形式获取响应，以便更好地处理错误
      const textResponse = await response.text();
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        console.error('原始响应:', textResponse.substring(0, 500) + '...');
        setError(`JSON解析错误。服务器可能返回了错误页面而不是JSON数据。`);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        if (data.error && data.error.includes('column') && data.error.includes('does not exist')) {
          setDatabaseError(true);
        }
        throw new Error(data.error || `加载失败: ${response.status}`);
      }
      
      console.log(`获取到${data.projects?.length || 0}个项目`);
      setDatabaseError(false);
      
      // 确保每个项目都有status和updated_at字段
      const processedProjects = (data.projects || []).map((project: Project) => ({
        ...project,
        status: project.status || 'offline',
        updated_at: project.updated_at || project.created_at
      }));
      
      setProjects(processedProjects);
      // 重置选择状态
      setSelectedProjects([]);
      setSelectAll(false);
    } catch (err: any) {
      console.error('加载项目数据失败:', err);
      setError(err.message || '加载项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };
  
  const handleDeleteProject = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 删除项目
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // 更新项目列表
      setProjects(projects.filter((project) => project.id !== id));
      // 从选中列表中移除
      setSelectedProjects(selectedProjects.filter(projectId => projectId !== id));
    } catch (err: any) {
      setError(err.message || '删除项目失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectProjectType = (type: 'visualization' | 'document') => {
    setIsModalOpen(false);
    router.push(`/admin/projects/new?type=${type}`);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'online' | 'offline') => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'online' ? 'offline' : 'online';
      console.log(`正在更改项目 [ID: ${id}] 状态: ${currentStatus} -> ${newStatus}`);
      
      const response = await fetch(`/api/projects/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('更新状态失败:', responseData);
        throw new Error(responseData.error || `状态更新失败: ${response.status}`);
      }
      
      console.log('状态更新成功:', responseData);
      
      // 更新本地项目状态
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id ? { ...project, status: newStatus, updated_at: new Date().toISOString() } : project
        )
      );
      
      // 如果当前在筛选状态下，可能需要重新加载项目列表
      if (statusFilter !== 'all') {
        fetchProjects();
      }
    } catch (err: any) {
      console.error('更新项目状态失败:', err);
      setError(err.message || '更新项目状态失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchToggleStatus = async (status: 'online' | 'offline') => {
    if (selectedProjects.length === 0) {
      setError('请先选择项目');
      return;
    }
    
    try {
      setLoading(true);
      console.log(`批量更新状态: ${selectedProjects.length}个项目 -> ${status}`);
      
      const response = await fetch('/api/projects/batch-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedProjects, status }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('批量状态更新请求失败:', responseData);
        throw new Error(responseData.error || `批量更新失败: HTTP ${response.status}`);
      }
      
      console.log('批量状态更新成功:', responseData);
      
      // 如果当前在筛选状态下，重新加载项目列表
      if (statusFilter !== 'all') {
        fetchProjects();
      } else {
        // 否则更新本地状态
        setProjects(prevProjects => 
          prevProjects.map(project => 
            selectedProjects.includes(project.id) 
              ? { ...project, status, updated_at: new Date().toISOString() } 
              : project
          )
        );
      }
      
      // 重置选择
      setSelectedProjects([]);
      setSelectAll(false);
    } catch (err: any) {
      console.error('批量状态更新出错:', err);
      setError(err.message || '批量更新项目状态失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelectProject = (id: string) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter(projectId => projectId !== id));
      setSelectAll(false);
    } else {
      setSelectedProjects([...selectedProjects, id]);
      if (selectedProjects.length + 1 === projects.length) {
        setSelectAll(true);
      }
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(project => project.id));
    }
    setSelectAll(!selectAll);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 在useEffect之前添加修复数据库的函数
  const fixDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('正在修复数据库...');
      
      const response = await fetch('/api/fix-database');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '数据库修复失败');
      }
      
      console.log('数据库修复结果:', data);
      alert('数据库结构修复成功！项目管理功能应该可以正常工作了。');
      
      // 重新加载项目
      fetchProjects();
    } catch (err: any) {
      console.error('数据库修复错误:', err);
      setError(`数据库修复失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && projects.length === 0) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between py-2 md:py-0">
            <div className="flex justify-between items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-sm">DA</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    数据分析
                  </span>
                </div>
              </div>
              
              {/* 移动端菜单按钮 */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
                >
                  <span className="sr-only">打开菜单</span>
                  {!mobileMenuOpen ? (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* 桌面端导航链接 */}
            <div className="hidden md:flex md:items-center md:ml-6 md:space-x-4">
              <a 
                href="https://mm.edrawsoft.cn/app/create" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                思维导图
              </a>
              <a 
                href="https://gxrjm0aprrw.feishu.cn/wiki/EY0KwGYTtiivtPkIT5Hc07DznVh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 border border-green-200 hover:border-green-300 rounded-md bg-green-50 hover:bg-green-100 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                知识库
              </a>
              <a 
                href="https://www.finebi.com/bicase" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                案例库
              </a>
              <a 
                href="https://app.fanruan.com/templates" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-300 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                模板库
              </a>
              <a 
                href="https://www.yuque.com/datazhang/utm8xf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                机器学习
              </a>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                添加新项目
              </button>
              <button
                onClick={fixDatabase}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-md hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                修复数据库
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </div>
          
          {/* 移动端菜单 */}
          <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-2 pb-3">
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://mm.edrawsoft.cn/app/create" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  思维导图
                </a>
                <a 
                  href="https://gxrjm0aprrw.feishu.cn/wiki/EY0KwGYTtiivtPkIT5Hc07DznVh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 border border-green-200 hover:border-green-300 rounded-md bg-green-50 hover:bg-green-100 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  知识库
                </a>
                <a 
                  href="https://www.finebi.com/bicase" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  案例库
                </a>
                <a 
                  href="https://app.fanruan.com/templates" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-300 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  模板库
                </a>
                <a 
                  href="https://www.yuque.com/datazhang/utm8xf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  机器学习
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  添加项目
                </button>
                <button
                  onClick={fixDatabase}
                  className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-md hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  修复数据库
                </button>
                <button
                  onClick={handleLogout}
                  className="col-span-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 项目类型选择弹窗 */}
      <ProjectTypeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectProjectType}
      />

      {/* 错误提示 */}
      {(databaseError || error) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`rounded-lg shadow-md p-4 ${databaseError ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-red-50 border-l-4 border-red-500'} animate-fadeIn`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${databaseError ? 'text-yellow-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${databaseError ? 'text-yellow-800' : 'text-red-800'}`}>
                  {databaseError ? '检测到数据库结构问题' : '发生错误'}
                </p>
                <p className={`text-sm ${databaseError ? 'text-yellow-700' : 'text-red-700'} mt-1`}>
                  {databaseError ? '数据库缺少必要的列，这会导致项目管理功能无法正常工作。' : error}
                </p>
                <div className="mt-2">
                  <button
                    onClick={databaseError ? fixDatabase : () => setError(null)}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm ${
                      databaseError 
                        ? 'text-yellow-900 bg-yellow-100 hover:bg-yellow-200' 
                        : 'text-red-900 bg-red-100 hover:bg-red-200'
                    } transition-colors duration-200`}
                  >
                    {databaseError ? '立即修复数据库' : '关闭提示'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-10">
        <header className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 animate-fadeIn">
                  项目管理
                </h1>
                <p className="mt-2 text-gray-600 animate-fadeIn">管理和维护您的所有数据分析项目</p>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 筛选和排序控件 */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transform hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      状态筛选
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'online' | 'offline')}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-shadow duration-200 hover:shadow-sm"
                    >
                      <option value="all">全部</option>
                      <option value="online">上线中</option>
                      <option value="offline">下线中</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      项目类型
                    </label>
                    <select
                      id="type-filter"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as 'all' | 'visualization' | 'document')}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-shadow duration-200 hover:shadow-sm"
                    >
                      <option value="all">全部类型</option>
                      <option value="visualization">可视化项目</option>
                      <option value="document">图文案例</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                      排序方式
                    </label>
                    <select
                      id="sort-by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'created_at' | 'updated_at')}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-shadow duration-200 hover:shadow-sm"
                    >
                      <option value="created_at">创建时间</option>
                      <option value="updated_at">修改时间</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                      排序顺序
                    </label>
                    <select
                      id="sort-order"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition-shadow duration-200 hover:shadow-sm"
                    >
                      <option value="desc">从新到旧</option>
                      <option value="asc">从旧到新</option>
                    </select>
                  </div>
                </div>
                
                {/* 批量操作按钮 */}
                {selectedProjects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2 animate-fadeIn">
                    <button
                      onClick={() => handleBatchToggleStatus('online')}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      批量上线
                    </button>
                    <button
                      onClick={() => handleBatchToggleStatus('offline')}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-md hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      批量下线
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 项目列表 */}
            {loading && projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 animate-pulse">加载项目列表中...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:shadow-lg transition-all duration-200">
                {/* 桌面端表格视图 */}
                <div className="hidden md:block">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleToggleSelectAll}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          项目信息
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          项目类型
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          创建时间
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          最近修改
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr 
                          key={project.id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedProjects.includes(project.id)}
                              onChange={() => handleToggleSelectProject(project.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img 
                                  className="h-12 w-12 rounded-lg object-cover shadow-sm hover:shadow-md transition-shadow duration-200" 
                                  src={project.image_url} 
                                  alt="" 
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200">
                                  {project.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1 max-w-md">
                                  {project.description}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {project.tags?.map((tag) => (
                                    <span 
                                      key={tag} 
                                      className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full ${
                              project.type === 'visualization' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            } transition-all duration-200 hover:shadow-sm`}>
                              {project.type === 'visualization' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  可视化
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  图文案例
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full ${
                              project.status === 'online' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            } transition-all duration-200 hover:shadow-sm`}>
                              {project.status === 'online' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  已上线
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  已下线
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(project.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(project.updated_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleToggleStatus(project.id, project.status)}
                                className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm ${
                                  project.status === 'online'
                                    ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                              >
                                {project.status === 'online' ? '下线' : '上线'}
                              </button>
                              
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/projects/edit/${project.id}`}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
                                >
                                  编辑
                                </Link>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 移动端卡片视图 */}
                <div className="md:hidden">
                  <div className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedProjects.includes(project.id)}
                              onChange={() => handleToggleSelectProject(project.id)}
                              className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <div className="flex-shrink-0 h-12 w-12 mr-3">
                                <img 
                                  className="h-12 w-12 rounded-lg object-cover shadow-sm" 
                                  src={project.image_url} 
                                  alt="" 
                                />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{project.title}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-0.5 inline-flex items-center text-xs font-medium rounded-full ${
                                    project.type === 'visualization' 
                                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                                  }`}>
                                    {project.type === 'visualization' ? '可视化' : '图文案例'}
                                  </span>
                                  <span className={`px-2 py-0.5 inline-flex items-center text-xs font-medium rounded-full ${
                                    project.status === 'online' 
                                      ? 'bg-green-50 text-green-700 border border-green-200' 
                                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                  }`}>
                                    {project.status === 'online' ? '已上线' : '已下线'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.tags?.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag} 
                                  className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.tags?.length > 3 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                                  +{project.tags.length - 3}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div>创建: {formatDateTime(project.created_at)}</div>
                              <div>更新: {formatDateTime(project.updated_at)}</div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleToggleStatus(project.id, project.status)}
                                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
                                  project.status === 'online'
                                    ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                                } transition-colors duration-200`}
                              >
                                {project.status === 'online' ? '下线' : '上线'}
                              </button>
                              
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/projects/edit/${project.id}`}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
                                >
                                  编辑
                                </Link>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">暂无项目</h3>
                <p className="mt-1 text-sm text-gray-500">点击"添加新项目"按钮创建您的第一个项目</p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    添加新项目
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}