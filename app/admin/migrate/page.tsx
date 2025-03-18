'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isAdmin } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

/**
 * 数据库迁移页面
 * 
 * 此页面允许管理员执行数据库迁移，添加新字段并设置默认值
 */
export default function MigratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  }>({});
  const router = useRouter();

  // 检查是否为管理员
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login');
    }
  }, [router]);

  const runMigration = async () => {
    try {
      setIsLoading(true);
      setResult({});

      const response = await fetch('/api/migrate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
        });
      } else {
        setResult({
          success: false,
          error: data.error || '迁移失败',
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || '迁移过程中发生错误',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">数据库迁移</h1>
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

      <div className="container mx-auto py-10">
        <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              数据库迁移
            </h2>
            <p className="text-gray-600">
              执行数据库迁移以添加新字段并设置默认值。此操作将更新项目表结构，添加分析深度、行业分类等新字段，并将现有项目类型从三类简化为两类。
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                迁移说明
              </h3>
              <ul className="list-disc pl-5 text-amber-700 space-y-1">
                <li>此操作将添加以下新字段：分析深度、行业分类、商业价值、方法论、数据来源和结论</li>
                <li>将项目类型从三类（可视化、笔记本、案例研究）简化为两类（可视化、图文案例）</li>
                <li>为现有项目设置默认值</li>
                <li>迁移过程不会删除任何现有数据</li>
                <li>建议在执行迁移前备份数据库</li>
              </ul>
            </div>

            {result.success && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-green-800 font-medium">迁移成功</h3>
                    <div className="text-green-700 mt-1">
                      {result.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-red-800 font-medium">迁移失败</h3>
                    <div className="text-red-700 mt-1">
                      {result.error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={runMigration}
              disabled={isLoading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? '迁移中...' : '执行数据库迁移'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 