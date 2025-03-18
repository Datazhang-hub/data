import { NextResponse } from 'next/server';
import { getAllTags } from '@/app/lib/projects';

export async function GET() {
  try {
    const tags = await getAllTags();
    console.log(`API: 获取到${tags.length}个已上线项目的标签`);
    return NextResponse.json({ tags });
  } catch (error: any) {
    console.error('获取标签出错:', error);
    return NextResponse.json({ error: error.message || '获取标签失败' }, { status: 500 });
  }
} 