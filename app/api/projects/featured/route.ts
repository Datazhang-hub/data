import { NextResponse } from 'next/server';
import { getFeaturedProjects } from '@/app/lib/projects';

export async function GET() {
  try {
    const projects = await getFeaturedProjects();
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('获取精选项目失败:', error);
    return NextResponse.json(
      { error: error.message || '获取精选项目失败' },
      { status: 500 }
    );
  }
} 