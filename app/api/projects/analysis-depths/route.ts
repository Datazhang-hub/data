import { NextResponse } from 'next/server';
import { getAllAnalysisDepths } from '@/app/lib/projects';

export async function GET() {
  try {
    const depths = await getAllAnalysisDepths();
    console.log(`API: 获取到${depths.length}个已上线项目的分析深度`);
    return NextResponse.json({ depths });
  } catch (error: any) {
    console.error('获取分析深度出错:', error);
    return NextResponse.json({ error: error.message || '获取分析深度失败' }, { status: 500 });
  }
} 