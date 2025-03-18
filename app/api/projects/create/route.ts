import { NextResponse } from 'next/server';
import { createProject } from '@/app/lib/projects';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 验证数据
    if (!data.title || !data.description || !data.image_url || !data.tags || !data.demo_url || !data.type || !data.date) {
      return NextResponse.json({ error: '请提供所有必要的项目信息' }, { status: 400 });
    }
    
    // 创建项目
    const project = await createProject({
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      tags: Array.isArray(data.tags) ? data.tags : data.tags.split(',').map((tag: string) => tag.trim()),
      demo_url: data.demo_url,
      type: data.type,
      date: data.date,
    });
    
    if (!project) {
      return NextResponse.json({ error: '创建项目失败' }, { status: 500 });
    }
    
    return NextResponse.json({ project, success: true });
  } catch (error: any) {
    console.error('创建项目出错:', error);
    return NextResponse.json({ error: error.message || '创建项目失败' }, { status: 500 });
  }
} 