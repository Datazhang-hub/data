import { NextResponse } from 'next/server';
import { createProject } from '@/app/lib/projects';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // 创建广告数据分析项目
    const adAnalyticsProject = await createProject({
      title: "全渠道广告投放效果分析与优化",
      description: "通过多维度数据分析，评估不同广告渠道的投放效果，优化广告预算分配，提升ROI超过35%。",
      image_url: "/images/projects/ad-analytics/cover.jpg",
      tags: ["广告分析", "ROI优化", "渠道评估", "预算分配", "数据可视化"],
      demo_url: "",
      type: "document",
      date: new Date().toISOString().split('T')[0],
      featured: true,
      content: JSON.stringify({
        background: "某电商平台每月在多个广告渠道投入大量预算，但缺乏系统化的效果评估方法，导致广告投放效率低下，ROI不理想。管理层希望通过数据分析找出最有效的广告渠道和投放策略，优化预算分配。",
        objectives: "1. 评估各广告渠道的投放效果和投资回报率\n2. 识别影响广告效果的关键因素\n3. 制定基于数据的预算分配策略\n4. 提供可操作的广告优化建议",
        methodology: "采用多维度分析方法，结合时间序列分析、归因模型和A/B测试，全面评估广告效果。使用Python进行数据处理，Power BI构建可视化仪表板，通过机器学习算法预测不同预算分配方案的效果。",
        data_sources: "1. 广告平台API数据（Google Ads, Facebook, Instagram, TikTok）\n2. 网站分析工具数据（GA4）\n3. CRM系统销售转化数据\n4. 历史广告投放记录和预算数据",
        analysis_steps: [
          {
            title: "数据收集与整合",
            description: "从多个广告平台和内部系统收集6个月的广告数据，包括展示次数、点击量、转化率、花费等指标，并进行数据清洗和整合。",
            code: "import pandas as pd\nimport numpy as np\n\n# 加载各平台数据\ngoogle_ads = pd.read_csv('google_ads_data.csv')\nfacebook_ads = pd.read_csv('facebook_ads_data.csv')\ntiktok_ads = pd.read_csv('tiktok_ads_data.csv')\n\n# 数据清洗\ndef clean_ad_data(df):\n    # 移除重复值\n    df = df.drop_duplicates()\n    # 处理缺失值\n    df['impressions'] = df['impressions'].fillna(0)\n    df['clicks'] = df['clicks'].fillna(0)\n    df['cost'] = df['cost'].fillna(0)\n    # 计算点击率\n    df['ctr'] = np.where(df['impressions'] > 0, df['clicks'] / df['impressions'], 0)\n    return df\n\n# 应用清洗函数\ngoogle_ads_clean = clean_ad_data(google_ads)\nfacebook_ads_clean = clean_ad_data(facebook_ads)\ntiktok_ads_clean = clean_ad_data(tiktok_ads)\n\n# 合并数据集\nall_ads_data = pd.concat([\n    google_ads_clean.assign(platform='Google'),\n    facebook_ads_clean.assign(platform='Facebook'),\n    tiktok_ads_clean.assign(platform='TikTok')\n])",
            language: "python"
          },
          {
            title: "渠道效果对比分析",
            description: "对比分析各广告渠道的关键指标，包括CPC、CTR、转化率和ROI，识别最具成本效益的渠道。",
            code: "# 计算各渠道关键指标\nchannel_metrics = all_ads_data.groupby('platform').agg({\n    'impressions': 'sum',\n    'clicks': 'sum',\n    'conversions': 'sum',\n    'cost': 'sum',\n    'revenue': 'sum'\n}).reset_index()\n\n# 计算衍生指标\nchannel_metrics['ctr'] = channel_metrics['clicks'] / channel_metrics['impressions']\nchannel_metrics['conversion_rate'] = channel_metrics['conversions'] / channel_metrics['clicks']\nchannel_metrics['cpc'] = channel_metrics['cost'] / channel_metrics['clicks']\nchannel_metrics['roas'] = channel_metrics['revenue'] / channel_metrics['cost']\nchannel_metrics['roi'] = (channel_metrics['revenue'] - channel_metrics['cost']) / channel_metrics['cost']\n\n# 可视化渠道对比\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\nplt.figure(figsize=(12, 8))\nsns.barplot(x='platform', y='roi', data=channel_metrics)\nplt.title('各广告渠道ROI对比')\nplt.xlabel('广告渠道')\nplt.ylabel('投资回报率(ROI)')\nplt.savefig('channel_roi_comparison.png')",
            language: "python",
            visualization: "/images/projects/ad-analytics/channel_comparison.jpg"
          },
          {
            title: "时间序列分析",
            description: "分析广告效果随时间的变化趋势，识别季节性模式和长期趋势，为投放时机优化提供依据。",
            code: "# 按周聚合数据\nweekly_data = all_ads_data.groupby(['platform', pd.Grouper(key='date', freq='W')]).\\\n    agg({\n        'impressions': 'sum',\n        'clicks': 'sum',\n        'conversions': 'sum',\n        'cost': 'sum',\n        'revenue': 'sum'\n    }).reset_index()\n\n# 计算周度ROI\nweekly_data['roi'] = (weekly_data['revenue'] - weekly_data['cost']) / weekly_data['cost']\n\n# 可视化时间趋势\nplt.figure(figsize=(15, 8))\nfor platform in weekly_data['platform'].unique():\n    data = weekly_data[weekly_data['platform'] == platform]\n    plt.plot(data['date'], data['roi'], marker='o', linestyle='-', label=platform)\n\nplt.title('广告ROI随时间变化趋势')\nplt.xlabel('日期')\nplt.ylabel('ROI')\nplt.legend()\nplt.grid(True)\nplt.savefig('roi_time_trend.png')",
            language: "python",
            visualization: "/images/projects/ad-analytics/time_trend.jpg"
          },
          {
            title: "归因分析",
            description: "使用多渠道归因模型，分析用户转化路径，评估各接触点的贡献度，优化全渠道营销策略。",
            code: "from sklearn.ensemble import RandomForestClassifier\n\n# 准备归因分析数据\nattribution_data = pd.read_csv('user_journey_data.csv')\n\n# 特征工程\nX = attribution_data[['google_touchpoints', 'facebook_touchpoints', 'tiktok_touchpoints', \n                     'email_touchpoints', 'organic_search_touchpoints', 'direct_touchpoints']]\ny = attribution_data['converted']\n\n# 训练随机森林模型\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X, y)\n\n# 特征重要性\nimportance = pd.DataFrame({\n    'channel': X.columns,\n    'importance': model.feature_importances_\n}).sort_values('importance', ascending=False)\n\n# 可视化各渠道对转化的贡献\nplt.figure(figsize=(10, 6))\nsns.barplot(x='importance', y='channel', data=importance)\nplt.title('各渠道对转化的贡献度')\nplt.xlabel('重要性得分')\nplt.ylabel('渠道')\nplt.tight_layout()\nplt.savefig('channel_attribution.png')",
            language: "python",
            visualization: "/images/projects/ad-analytics/attribution.jpg"
          },
          {
            title: "预算优化模型",
            description: "基于历史数据构建预算分配优化模型，预测不同预算分配方案下的ROI，为决策提供数据支持。",
            code: "import numpy as np\nfrom scipy.optimize import minimize\n\n# 定义目标函数：最大化总体ROI\ndef objective(allocations, channel_data):\n    total_roi = 0\n    for i, channel in enumerate(channel_data['platform']):\n        # 使用对数函数模拟边际效益递减\n        channel_roi = channel_data.loc[i, 'base_roi'] * (1 + np.log1p(allocations[i] / channel_data.loc[i, 'current_budget']))\n        channel_revenue = channel_roi * allocations[i]\n        total_roi += channel_revenue\n    \n    # 返回负ROI（因为minimize函数寻找最小值）\n    return -total_roi / sum(allocations)\n\n# 约束条件：预算总和等于总预算\ndef constraint(allocations, total_budget):\n    return sum(allocations) - total_budget\n\n# 优化预算分配\ntotal_budget = channel_metrics['cost'].sum()\ninitial_allocation = channel_metrics['cost'].values\n\nconstraints = ({'type': 'eq', 'fun': constraint, 'args': (total_budget,)})\nbounds = [(budget * 0.5, budget * 2) for budget in initial_allocation]  # 设置每个渠道预算的上下限\n\nresult = minimize(objective, initial_allocation, args=(channel_metrics,), \n                 method='SLSQP', bounds=bounds, constraints=constraints)\n\n# 输出优化结果\noptimized_allocation = result['x']\nchannel_metrics['optimized_budget'] = optimized_allocation\nchannel_metrics['budget_change_pct'] = (channel_metrics['optimized_budget'] - channel_metrics['cost']) / channel_metrics['cost'] * 100\n\nprint('优化后的预算分配：')\nprint(channel_metrics[['platform', 'cost', 'optimized_budget', 'budget_change_pct']])",
            language: "python",
            visualization: "/images/projects/ad-analytics/budget_optimization.jpg"
          }
        ],
        findings: "1. Google广告渠道的ROI最高(4.2)，但增长趋势放缓；Facebook渠道ROI中等(3.1)，但增长潜力大；TikTok渠道虽然ROI较低(2.3)，但对年轻用户群体转化效果显著。\n2. 周末广告效果普遍高于工作日，特别是周日晚间投放的广告ROI高出平均水平28%。\n3. 多渠道接触的用户转化率是单一渠道的2.7倍，其中先接触Google再接触Facebook的路径转化率最高。\n4. 创意质量对广告效果的影响超过投放时间和定向，高质量创意的CTR平均高出53%。",
        data_insights: "广告投放时机对ROI影响显著，周末效果最佳\n多渠道协同营销能显著提升转化率\n创意质量是影响广告效果的首要因素\n不同年龄段用户对广告渠道的反应差异明显\n重复接触3-5次的用户转化率最高",
        recommendations: "将Google广告预算增加20%，重点投放高转化关键词\n减少TikTok低效广告组预算，增加高互动创意投入\n优化Facebook广告投放时间，集中在周末和晚间时段\n建立跨渠道归因体系，实时监控全链路转化效果\n每月对创意进行A/B测试，淘汰表现低于平均水平的创意\n针对不同用户群体定制差异化广告策略",
        solutions: "基于分析结果，我们重新分配了广告预算，将Google的预算增加了20%，减少了TikTok低效广告组的预算15%，并优化了Facebook的投放时间。同时，建立了创意评分系统，定期淘汰低效创意。实施这些措施后，整体广告ROI提升了35%，获客成本降低了22%。",
        conclusions: "通过系统化的数据分析，我们成功识别了影响广告效果的关键因素，并优化了预算分配策略。数据驱动的决策帮助客户显著提升了广告投资回报率，降低了获客成本。这个案例证明，精细化的广告数据分析和科学的预算分配对提升营销效果至关重要。未来，我们将继续优化归因模型，并探索机器学习在创意优化方面的应用。",
        tools_used: ["Python", "Pandas", "Scikit-learn", "Power BI", "Google Analytics", "SQL"],
        challenges: "1. 数据来源分散，各平台数据格式不一致，需要大量数据清洗和整合工作\n2. 多渠道归因复杂，难以准确评估各渠道的真实贡献\n3. 广告效果受多种外部因素影响，如季节性、市场竞争、产品生命周期等",
        future_work: "1. 开发实时广告监控仪表板，支持动态预算调整\n2. 引入更复杂的归因模型，如马尔可夫链模型\n3. 探索AI在创意生成和优化方面的应用\n4. 整合更多数据源，如社交媒体情感分析数据",
        team_members: "数据分析师、营销专家、BI工程师",
        project_duration: "2023年8月 - 2023年10月"
      }),
      status: "online",
      updated_at: new Date().toISOString(),
      analysis_depth: "diagnostic",
      industry: "ecommerce",
    });

    return NextResponse.json({ 
      success: true, 
      message: "广告数据分析示例项目创建成功",
      project: adAnalyticsProject
    });
  } catch (error: any) {
    console.error("创建示例项目失败:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "创建示例项目失败" 
    }, { status: 500 });
  }
} 