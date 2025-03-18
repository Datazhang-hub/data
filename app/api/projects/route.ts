import { NextResponse } from 'next/server';
import { getAllProjects, getProjectsByType, getProjectsByTag, createProject, getProjectsByStatus, getSortedProjectsByTime } from '@/app/lib/projects';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  
  const type = searchParams.get('type');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status');
  const sort = searchParams.get('sort') || '最新发布';
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  // 检测是否来自管理页面的请求
  const isAdminRequest = searchParams.get('admin') === 'true';
  
  console.log('项目API请求:', { 
    url: url.toString(), 
    type, tag, status, sort, sortBy, order, 
    isAdmin: isAdminRequest
  });
  
  try {
    let projects: any[] = [];
    
    // 第1步: 基于状态获取基础项目列表
    if (isAdminRequest) {
      // 管理页面请求
      if (status && status !== 'all') {
        console.log(`管理端请求: 按状态筛选 (${status})`);
        projects = await getProjectsByStatus(status as 'online' | 'offline');
      } else {
        console.log('管理端请求: 获取所有项目');
        projects = await getAllProjects();
      }
    } else {
      // 前端页面请求 - 只显示在线项目
      console.log('前端请求: 仅获取在线项目');
      projects = await getProjectsByStatus('online');
    }
    
    console.log('获取到的项目列表:', projects.map(p => ({ id: p.id, title: p.title, type: p.type })));
    
    // 第2步: 如果指定了类型或标签，应用额外筛选
    if (type && type !== 'all') {
      console.log(`按类型筛选: ${type}`);
      
      // 详细记录每个项目的类型
      projects.forEach(p => {
        console.log(`项目 [${p.id}] ${p.title} 的类型是: "${p.type}" (${typeof p.type})`);
      });
      
      // 创建可能的类型映射关系
      const typeMap: Record<string, string[]> = {
        'visualization': ['visualization', '可视化', 'Visualization'],
        'document': ['document', '图文案例', 'Document', '文档']
      };
      
      // 使用映射关系进行筛选
      projects = projects.filter(project => {
        // 如果项目类型为空，跳过
        if (!project.type) return false;
        
        // 将项目类型转换为小写以进行不区分大小写的比较
        const projectType = project.type.toString().toLowerCase();
        const targetTypes = typeMap[type.toLowerCase()] || [type.toLowerCase()];
        
        // 检查项目类型是否在目标类型列表中
        return targetTypes.some(t => projectType.includes(t.toLowerCase()));
      });
      
      console.log(`类型筛选后剩余: ${projects.length}个项目`);
      console.log('筛选后的项目:', projects.map(p => ({ id: p.id, title: p.title, type: p.type })));
    }
    
    if (tag && tag !== '全部') {
      console.log(`按标签筛选: ${tag}`);
      projects = projects.filter(project => 
        project.tags && Array.isArray(project.tags) && project.tags.includes(tag)
      );
      console.log(`标签筛选后剩余: ${projects.length}个项目`);
    }
    
    // 第3步: 应用排序
    if (projects.length > 0) {
      console.log(`排序前项目顺序: ${projects.map(p => p.id).join(', ')}`);
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        console.log(`按${sortBy === 'created_at' ? '创建时间' : '修改时间'}排序 (${order})`);
        
        projects.sort((a, b) => {
          // 确保a和b是有效的对象并且有所需字段
          if (!a || !b) return 0;
          
          let fieldA = a[sortBy];
          let fieldB = b[sortBy];
          
          // 如果updated_at不存在，使用created_at
          if (sortBy === 'updated_at') {
            fieldA = fieldA || a.created_at;
            fieldB = fieldB || b.created_at;
          }
          
          if (!fieldA || !fieldB) return 0;
          
          const timeA = new Date(fieldA).getTime();
          const timeB = new Date(fieldB).getTime();
          
          return order === 'desc' ? timeB - timeA : timeA - timeB;
        });
      } else {
        console.log(`按发布日期排序 (${sort})`);
        projects.sort((a, b) => {
          if (!a || !b || !a.date || !b.date) return 0;
          
          try {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sort === '最新发布' ? dateB - dateA : dateA - dateB;
          } catch (e) {
            console.error('日期排序错误:', e);
            return 0;
          }
        });
      }
      
      console.log(`排序后项目顺序: ${projects.map(p => p.id).join(', ')}`);
    }
    
    return NextResponse.json({ 
      projects,
      meta: {
        total: projects.length,
        filter: { type, tag, status },
        sort: { by: sortBy, order }
      }
    });
  } catch (error: any) {
    console.error('获取项目出错:', error);
    return NextResponse.json({ 
      projects: [], 
      error: error.message || '获取项目失败',
      meta: { total: 0 }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 获取请求数据
    const data = await request.json();
    
    // 验证数据
    if (!data.title || !data.description || !data.image_url || !data.tags || !data.type || !data.date) {
      return NextResponse.json({ error: '请提供所有必要的项目信息' }, { status: 400 });
    }
    
    // 对visualization类型项目，demo_url是必填项
    if (data.type === 'visualization' && !data.demo_url) {
      return NextResponse.json({ error: '可视化项目必须提供演示地址' }, { status: 400 });
    }
    
    // 创建项目
    const project = await createProject({
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      tags: Array.isArray(data.tags) ? data.tags : data.tags.split(',').map((tag: string) => tag.trim()),
      demo_url: data.demo_url || '',
      type: data.type,
      date: data.date,
      featured: data.featured || false,
      content: data.content || '',
      status: data.status || 'offline',
      updated_at: new Date().toISOString(),
      analysis_depth: data.analysis_depth || 'exploratory',
      industry: data.industry || 'other',
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