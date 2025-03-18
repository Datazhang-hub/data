'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectEditor from '@/app/components/ProjectEditor';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useToast } from '@/app/components/Toast';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditProject({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('获取项目信息失败');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError('获取项目信息失败，请重试');
        console.error('获取项目错误:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('更新项目失败');
      }

      showToast('success', '项目更新成功！');
      router.push('/admin/dashboard');
    } catch (error) {
      showToast('error', '更新项目失败，请重试');
      console.error('更新项目错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="加载项目信息..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">出错了</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            返回仪表板
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">项目不存在</h1>
          <p className="text-gray-600 mb-4">找不到该项目，可能已被删除</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            返回仪表板
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectEditor
      type={project.type}
      initialData={project}
      onSubmit={handleSubmit}
    />
  );
} 