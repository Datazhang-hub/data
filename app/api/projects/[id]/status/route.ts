import { NextResponse } from 'next/server';
import { getProjectById, updateProjectStatus } from '@/app/lib/projects';
import { fixTableStructure } from '@/app/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    console.log(`收到更新项目 [ID: ${id}] 状态的请求`);
    
    // 检查项目是否存在
    const project = await getProjectById(id);
    if (!project) {
      console.error(`项目不存在: ${id}`);
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }
    
    // 获取请求数据
    const data = await request.json();
    console.log(`要更新的状态: ${data.status}, 当前状态: ${project.status || '未设置'}`);
    
    // 验证数据
    if (!data.status || !['online', 'offline'].includes(data.status)) {
      console.error(`无效的状态值: ${data.status}`);
      return NextResponse.json({ error: '请提供有效的状态值 (online/offline)' }, { status: 400 });
    }
    
    // 如果状态相同，直接返回成功
    if (project.status === data.status) {
      console.log(`项目状态已经是 ${data.status}，无需更改`);
      return NextResponse.json({ 
        success: true, 
        status: data.status,
        message: '项目状态未改变'
      });
    }
    
    // 尝试更新项目状态
    try {
      console.log(`更新项目状态: ${id} -> ${data.status}`);
      const success = await updateProjectStatus(id, data.status);
      
      if (!success) {
        console.error(`更新项目状态失败: ${id}`);
        return NextResponse.json({ error: '更新项目状态失败' }, { status: 500 });
      }
      
      console.log(`项目状态更新成功: ${id} -> ${data.status}`);
      return NextResponse.json({ 
        success: true, 
        status: data.status,
        id: id,
        previousStatus: project.status
      });
    } catch (updateError: any) {
      // 检查是否是表结构问题
      if (updateError.message && (
          updateError.message.includes('column') && 
          updateError.message.includes('does not exist')
      )) {
        console.log('检测到表结构问题，尝试修复...');
        
        // 尝试修复表结构
        const fixResult = await fixTableStructure();
        if (!fixResult.success) {
          return NextResponse.json({ 
            error: '数据库结构问题，自动修复失败，请联系管理员', 
            structureError: true,
            details: updateError.message
          }, { status: 500 });
        }
        
        // 修复成功后重试更新
        console.log('表结构修复完成，重试更新状态...');
        const retrySuccess = await updateProjectStatus(id, data.status);
        
        if (!retrySuccess) {
          return NextResponse.json({ 
            error: '数据库结构已修复，但状态更新失败', 
            structureFixed: true
          }, { status: 500 });
        }
        
        return NextResponse.json({ 
          success: true, 
          status: data.status,
          id: id,
          message: '数据库结构已修复并成功更新状态'
        });
      }
      
      // 其他错误
      console.error('更新项目状态出错:', updateError);
      return NextResponse.json({ error: updateError.message || '更新项目状态失败' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('更新项目状态出错:', error);
    return NextResponse.json({ error: error.message || '更新项目状态失败' }, { status: 500 });
  }
} 