'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProjectEditor from '@/app/components/ProjectEditor';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useToast } from '@/app/components/Toast';

export default function EditProject() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const projectId = params.id as string;

  // 获取项目数据
  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`获取项目失败: ${response.status}`);
        }
        
        const data = await response.json();
        setProject(data.project);
      } catch (error: any) {
        console.error('获取项目错误:', error);
        setError(error.message || '获取项目失败');
        showToast('error', '获取项目失败，请重试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProject();
  }, [projectId, showToast]);

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

  // 处理表单提交
  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // 准备项目数据 - 只包含数据库存在的字段
      const projectData = {
        id: project.id,
        title: formData.title,
        description: formData.description || '',
        image_url: formData.image_url || project.image_url,
        tags: formData.tags,
        demo_url: formData.demo_url || '',
        type: project.type,
        date: formData.date || project.date || new Date().toISOString().split('T')[0],
        featured: formData.featured !== undefined ? formData.featured : project.featured,
        status: formData.status || project.status || 'offline',
        // 添加分析深度和行业领域
        analysis_depth: formData.analysis_depth || project.analysis_depth || 'exploratory',
        industry: formData.industry || project.industry || 'other',
        
        // 将业务相关字段存储为JSON字符串到content字段中
        content: JSON.stringify({
          business_value: formData.business_value || formData.background || '',
          methodology: formData.methodology || '',
          data_sources: formData.data_sources || formData.data_source || '',
          analysis: formData.analysis || '',
          findings: formData.findings || '',
          recommendations: formData.recommendations || '',
          conclusions: formData.conclusions || formData.conclusion || '',
          analysis_steps: formData.analysis_steps || [],
          // 其他业务字段
          challenges: formData.challenges || '',
          solutions: formData.solutions || '',
          future_work: formData.future_work || '',
          team_members: formData.team_members || '',
          project_duration: formData.project_duration || '',
          // 分析方法和详情
          analysis_methods: formData.analysis_methods || [],
          analysis_method_details: formData.analysis_method_details || {},
          // 可视化项目相关字段
          business_context: formData.business_context || '',
          key_metrics: formData.key_metrics || '',
          key_metrics_relationship: formData.key_metrics_relationship || '',
          metrics_evaluation: formData.metrics_evaluation || '',
          business_hypothesis: formData.business_hypothesis || '',
          hypothesis_validation: formData.hypothesis_validation || '',
          // 添加报告内容图片字段
          business_context_image: formData.business_context_image || '',
          hypothesis_validation_image: formData.hypothesis_validation_image || '',
          findings_image: formData.findings_image || '',
          conclusions_image: formData.conclusions_image || '',
        })
      };
      
      // 如果有新图片，先上传图片
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        if (imageUrl) {
          projectData.image_url = imageUrl;
        }
      }
      
      console.log('提交更新数据:', projectData); // 添加日志
      
      // 更新项目
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMsg = responseData.error || '更新项目失败';
        console.error('API响应错误:', responseData);
        throw new Error(errorMsg);
      }

      showToast('success', '项目更新成功！');
      router.push('/admin/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || '更新项目失败，请重试';
      showToast('error', errorMessage);
      console.error('更新项目错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果正在加载或没有项目数据，显示加载状态
  if (isLoading || !project) {
    return <LoadingSpinner fullScreen text="正在加载项目..." />;
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            返回仪表盘
          </button>
        </div>
      </div>
    );
  }

  // 处理图片上传
  const handleImageChange = (file: File) => {
    setImageFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">编辑项目</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            返回仪表盘
          </button>
        </div>
        
        <ProjectEditor 
          initialData={project} 
          onSubmit={handleSubmit} 
          type={project.type || 'visualization'}
          onImageChange={handleImageChange}
        />
      </div>
    </div>
  );
} 