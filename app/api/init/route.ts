import { NextResponse } from 'next/server';
import { initDatabase, checkDatabaseConnection } from '@/app/lib/db';

export async function GET() {
  try {
    // 测试数据库连接
    const connectionStatus = await checkDatabaseConnection();
    if (!connectionStatus.connected) {
      return NextResponse.json(
        { error: '数据库连接失败: ' + connectionStatus.error },
        { status: 500 }
      );
    }

    // 初始化数据库
    const result = await initDatabase();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: result.message 
    });
  } catch (error: any) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      { error: error.message || '数据库初始化失败' },
      { status: 500 }
    );
  }
} 