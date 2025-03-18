import { NextResponse } from 'next/server';
import { runMigration } from '@/app/lib/db-migration';
import { isAdmin } from '@/app/lib/auth';

/**
 * 数据库迁移API路由
 * 
 * 此API路由用于执行数据库迁移，添加新字段并设置默认值
 * 仅管理员可以访问
 */
export async function GET() {
  try {
    // 检查是否为管理员
    if (!isAdmin()) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 执行迁移
    const result = await runMigration();
    
    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('迁移API错误:', error);
    return NextResponse.json(
      { error: `迁移失败: ${error.message}` },
      { status: 500 }
    );
  }
} 