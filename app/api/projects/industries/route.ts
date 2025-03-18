import { NextResponse } from 'next/server';
import { getAllIndustries } from '@/app/lib/projects';

export async function GET() {
  try {
    const industries = await getAllIndustries();
    console.log(`API: 获取到${industries.length}个已上线项目的行业领域`);
    return NextResponse.json({ industries });
  } catch (error: any) {
    console.error('获取行业领域出错:', error);
    return NextResponse.json({ error: error.message || '获取行业领域失败' }, { status: 500 });
  }
} 