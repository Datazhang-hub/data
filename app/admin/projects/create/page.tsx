'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectEditor from '@/app/components/ProjectEditor';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useToast } from '@/app/components/Toast';

export default function CreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [projectType, setProjectType] = useState<'visualization' | 'document' | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('创建项目失败');
      }

      showToast('success', '项目创建成功！');
      router.push('/admin/dashboard');
    } catch (error) {
      showToast('error', '创建项目失败，请重试');
      console.error('创建项目错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="正在创建项目..." />;
  }

  if (!projectType) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">选择项目类型</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setProjectType('visualization')}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">可视化项目</h2>
                <p className="text-gray-600">适用于Power BI、Tableau等数据可视化看板项目</p>
              </button>

              <button
                onClick={() => setProjectType('document')}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">图文案例项目</h2>
                <p className="text-gray-600">适用于数据分析案例、方法论介绍、代码展示等项目</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ProjectEditor type={projectType} onSubmit={handleSubmit} />;
} 