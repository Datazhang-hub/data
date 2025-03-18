'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectEditor from '@/app/components/ProjectEditor';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useToast } from '@/app/components/Toast';

export default function NewProject() {
  const searchParams = useSearchParams();
  const projectType = searchParams.get('type') as 'visualization' | 'document' || 'visualization';
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  // 上传图片函数
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('图片上传失败');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('图片上传错误:', error);
      showToast('error', '图片上传失败');
      return null;
    }
  };

  // 处理图片上传
  const handleImageChange = (file: File) => {
    setImageFile(file);
  };

  // 处理表单提交
  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // 准备项目数据
      const projectData = {
        ...data,
        type: projectType
      };
      
      // 如果有新图片，先上传图片
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        if (imageUrl) {
          projectData.image_url = imageUrl;
        }
      }
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
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

  // 加载状态
  if (isLoading) {
    return <LoadingSpinner fullScreen text="正在创建项目..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">创建新项目</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            返回仪表盘
          </button>
        </div>
        
        <div className="max-w-5xl mx-auto px-4">
          <ProjectEditor 
            type={projectType} 
            onSubmit={handleSubmit} 
            onImageChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
} 