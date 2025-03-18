import { NextResponse } from 'next/server';
import { updateMultipleProjectsStatus } from '@/app/lib/projects';
import { fixTableStructure } from '@/app/lib/db';

export async function PUT(request: Request) {
  try {
    // 获取请求数据
    const data = await request.json();
    console.log('收到批量状态更新请求:', data);
    
    // 验证数据
    if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
      console.error('批量状态更新: 无效的项目ID列表', data.ids);
      return NextResponse.json({ error: '请提供有效的项目ID列表' }, { status: 400 });
    }
    
    if (!data.status || !['online', 'offline'].includes(data.status)) {
      console.error('批量状态更新: 无效的状态值', data.status);
      return NextResponse.json({ error: '请提供有效的状态值 (online/offline)' }, { status: 400 });
    }
    
    // 确保所有ID都是字符串
    const normalizedIds = data.ids.map((id: any) => String(id));
    console.log('处理后的ID列表:', normalizedIds);
    
    // 尝试批量更新项目状态
    try {
      const success = await updateMultipleProjectsStatus(normalizedIds, data.status);
      
      if (!success) {
        console.error('批量更新失败，没有项目被更新');
        return NextResponse.json({ error: '批量更新项目状态失败' }, { status: 500 });
      }
      
      console.log('批量更新成功:', { status: data.status, count: normalizedIds.length });
      return NextResponse.json({ success: true, status: data.status, count: normalizedIds.length });
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
        console.log('表结构修复完成，重试批量更新状态...');
        const retrySuccess = await updateMultipleProjectsStatus(normalizedIds, data.status);
        
        if (!retrySuccess) {
          return NextResponse.json({ 
            error: '数据库结构已修复，但批量状态更新失败', 
            structureFixed: true
          }, { status: 500 });
        }
        
        return NextResponse.json({ 
          success: true, 
          status: data.status,
          count: normalizedIds.length,
          message: '数据库结构已修复并成功更新状态'
        });
      }
      
      // 其他错误
      console.error('批量更新项目状态出错:', updateError);
      return NextResponse.json({ error: updateError.message || '批量更新项目状态失败' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('批量更新项目状态出错:', error);
    return NextResponse.json({ 
      error: error.message || '批量更新项目状态失败',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 