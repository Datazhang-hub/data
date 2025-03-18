import { NextResponse } from 'next/server';
import { deleteProject, getProjectById, updateProject } from '@/app/lib/projects';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 确保先 await params 对象
  const { id } = await params;
  
  try {
    const project = await getProjectById(id);
    
    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('获取项目出错:', error);
    return NextResponse.json({ error: error.message || '获取项目失败' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 确保先 await params 对象
  const { id } = await params;
  
  try {
    // 检查项目是否存在
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }
    
    // 获取请求数据
    const data = await request.json();
    console.log('收到的更新数据:', data); // 添加日志
    
    // 验证基本数据 - 兼容前端字段
    if (!data.title) {
      return NextResponse.json({ error: '请提供项目标题' }, { status: 400 });
    }
    
    // 使用 description 字段
    const description = data.description || '';
    
    // 确保 tags 是数组格式
    const tags = Array.isArray(data.tags) ? data.tags : 
                (typeof data.tags === 'string' ? 
                  data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : 
                  []);
    
    // 确保有日期，默认使用当前日期
    const date = data.date || new Date().toISOString().split('T')[0];
    
    // 更新项目 - 只包含数据库中已存在的列
    const updatedProject = await updateProject(id, {
      title: data.title,
      description: description,
      image_url: data.image_url || project.image_url,
      tags: tags,
      demo_url: data.demo_url || '',
      type: data.type || project.type,
      date: date,
      featured: data.featured !== undefined ? data.featured : project.featured,
      content: data.content || project.content || '',
      // 添加分析深度和行业领域
      analysis_depth: data.analysis_depth || project.analysis_depth || 'exploratory',
      industry: data.industry || project.industry || 'other',
      // 添加数据库中已存在的其他字段
      status: data.status || project.status || 'offline',
      // 更新时间
      updated_at: new Date().toISOString()
      
      // 以下字段在数据库中不存在，已移除
      // business_value: data.business_value || data.background || project.business_value || '',
      // methodology: data.methodology || project.methodology || '',
      // data_source: data.data_source || data.data_sources || project.data_source || '',
      // conclusion: data.conclusion || data.conclusions || project.conclusion || '',
    });
    
    if (!updatedProject) {
      return NextResponse.json({ error: '更新项目失败' }, { status: 500 });
    }
    
    return NextResponse.json({ project: updatedProject, success: true });
  } catch (error: any) {
    console.error('更新项目出错:', error);
    return NextResponse.json({ error: error.message || '更新项目失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 确保先 await params 对象
  const { id } = await params;
  
  try {
    // 检查项目是否存在
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }
    
    // 删除项目
    const success = await deleteProject(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '删除项目失败' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('删除项目出错:', error);
    return NextResponse.json({ error: error.message || '删除项目失败' }, { status: 500 });
  }
} 