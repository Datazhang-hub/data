'use client';

import Navbar from '../components/Navbar';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ContactForm from '@/app/components/ContactForm';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* 左侧个人介绍 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">个人简介</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 个人简介内容 */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">专业背景</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  作为一名拥有5年工作经验的数据分析师，我专注于<span className="font-medium text-blue-700">数据价值挖掘</span>和<span className="font-medium text-blue-700">商业洞察转化</span>。
                  擅长将复杂数据转化为直观可视化呈现，并构建可落地的商业策略，为决策提供数据支持。
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">个人特质</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">专业能力</h4>
                      <p className="text-gray-600">凭借扎实的专业知识和良好的沟通技巧，能高效支持企业数据驱动决策</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">团队协作</h4>
                      <p className="text-gray-600">注重团队协作，善于与业务部门沟通，将数据洞察转化为可执行策略</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">执行力</h4>
                      <p className="text-gray-600">性格沉稳且执行力强，能高效完成项目并推动数据分析成果落地实施</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">持续学习</h4>
                      <p className="text-gray-600">不断学习新知识，积极应用AI工具提高工作效率，探索技术与业务创新结合点</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 职业经历 */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">职业经历</h3>
                
                <div className="relative border-l-2 border-blue-200 pl-6 pb-2">
                  <div className="mb-8 relative">
                    <div className="absolute -left-8 mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">武汉梵丽斯网络科技有限公司</h4>
                      <span className="text-sm text-gray-500 mt-1 sm:mt-0">2021.12~2024.08</span>
                    </div>
                    <p className="text-base font-medium text-blue-700 mb-2">数据分析师</p>
                    <p className="text-gray-700">
                      负责广告投放数据分析与优化，构建全流程指标体系，开发BI可视化看板。通过数据驱动决策，提升了营销效率与ROI，支持公司业务增长。
                    </p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">湖北诺华科技发展有限公司</h4>
                      <span className="text-sm text-gray-500 mt-1 sm:mt-0">2020.05~2021.10</span>
                    </div>
                    <p className="text-base font-medium text-blue-700 mb-2">数据分析师</p>
                    <p className="text-gray-700">
                      主要负责电商数据分析，参与A/B测试设计与评估，使用SQL提取数据并构建可视化看板，为运营活动与营销策略提供数据支持。
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 联系方式 */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">联系方式</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-700">datazhang@qq.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="text-gray-700">18327272597</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧技能展示 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">专业技能</h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">工具</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Excel (Power Query)', 
                    'SQL', 
                    'Python (Pandas/Sklearn)', 
                    'Power BI', 
                    'Tableau', 
                    'SPSS'
                  ].map((skill) => (
                    <div key={skill} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">业务能力</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    '广告优化', 
                    '指标体系', 
                    '数据诊断', 
                    '策略输出', 
                    'A/B测试',
                    '数据监控'
                  ].map((tool) => (
                    <div key={tool} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-800">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">行业经验</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    '广告投放分析',
                    '电商数据分析',
                    '营销效果评估',
                    'BI看板搭建',
                    '竞店分析',
                    '活动数据分析'
                  ].map((domain) => (
                    <div key={domain} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-800">{domain}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 联系表单 */}
      <ContactForm />
    </div>
  );
} 