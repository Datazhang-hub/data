'use client';

import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">关于我</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">个人基本信息</h3>
            <div className="mb-4 p-3 bg-white rounded-md shadow-sm">
              <p className="text-gray-700 text-center">数据分析师 | 5年工作经验</p>
              <p className="text-indigo-600 text-sm text-center mt-1">专注于数据价值挖掘与业务决策支持</p>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-20 font-medium">姓名：</span>
                <span>某某某</span>
              </li>
              <li className="flex items-center">
                <span className="w-20 font-medium">年龄：</span>
                <span>28岁</span>
              </li>
              <li className="flex items-center">
                <span className="w-20 font-medium">性别：</span>
                <span>男</span>
              </li>
              <li className="flex items-center">
                <span className="w-20 font-medium">籍贯：</span>
                <span>武汉</span>
              </li>
              <li className="flex items-center">
                <span className="w-20 font-medium">工作经验：</span>
                <span>5年</span>
              </li>
              <li className="flex items-center">
                <span className="w-20 font-medium">求职意向：</span>
                <span>BI/数据分析师</span>
              </li>
              <li className="flex items-center">
                <span className="w-20 font-medium">期望城市：</span>
                <span>武汉、深圳、杭州、广州</span>
              </li>
            </ul>
          </div>
          
          <div className="md:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">个人概述</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                作为一名拥有5年工作经验的数据分析师，我专注于挖掘数据价值，将复杂数据转化为直观可视化展示和可行商业策略。我对数据敏感，善于分析归纳问题并提出解决方案。在过去的项目中，我搭建了覆盖广告投放、线索跟进、到店消费全流程的指标体系，显著提升了运营效率与ROI。凭借扎实的专业能力、良好的沟通技巧和团队协作精神，我能高效支持企业数据驱动决策。性格沉稳且执行力强，我不断学习新知识，并擅长运用AI工具提高工作效率，持续探索技术与业务的创新结合点。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">职业经历</h3>
              
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-800">武汉梵丽斯网络科技有限公司</h4>
                  <span className="text-indigo-600">2021.12~2024.08</span>
                </div>
                <p className="text-sm text-indigo-700 font-medium mb-2">数据分析师</p>
                <p className="text-gray-700">
                  负责广告投放数据分析与优化，构建全流程指标体系，开发BI可视化看板。通过数据驱动决策，提升了营销效率与ROI，支持公司业务增长。
                </p>
              </div>
              
              <div>
                <div className="flex flex-col sm:flex-row justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-800">湖北诺华科技发展有限公司</h4>
                  <span className="text-indigo-600">2020.05~2021.10</span>
                </div>
                <p className="text-sm text-indigo-700 font-medium mb-2">数据分析师</p>
                <p className="text-gray-700">
                  主要负责电商数据分析，参与A/B测试设计与评估，使用SQL提取数据并构建可视化看板，为运营活动与营销策略提供数据支持。
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">核心能力</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                    <span className="font-medium text-indigo-700">指标体系构建</span>
                  </div>
                  <p className="text-sm text-gray-600">设计并实施全流程业务指标体系，统一多平台数据口径</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium text-indigo-700">数据可视化</span>
                  </div>
                  <p className="text-sm text-gray-600">熟练使用BI工具搭建直观看板，支持管理决策</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium text-indigo-700">专题分析能力</span>
                  </div>
                  <p className="text-sm text-gray-600">擅长ROI诊断、预算分配、客户生命周期等深度分析</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"></path>
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"></path>
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"></path>
                    </svg>
                    <span className="font-medium text-indigo-700">数据采集与处理</span>
                  </div>
                  <p className="text-sm text-gray-600">精通数据采集、清洗、转换和加载流程</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z"></path>
                    </svg>
                    <span className="font-medium text-indigo-700">A/B测试</span>
                  </div>
                  <p className="text-sm text-gray-600">设计并执行测试方案，优化营销策略效果</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium text-indigo-700">竞争分析</span>
                  </div>
                  <p className="text-sm text-gray-600">通过数据采集分析竞争对手情况，制定差异化策略</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 