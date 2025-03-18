import { NextResponse } from 'next/server';
import { query, testConnection } from '@/app/lib/db';

export async function GET() {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    
    let tables = [];
    let contactsTableExists = false;
    let projectsTableExists = false;
    
    if (isConnected) {
      // 检查数据库中的表
      const tablesResult = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      tables = tablesResult.rows.map(row => row.table_name);
      
      // 检查contacts表是否存在
      contactsTableExists = tables.includes('contacts');
      
      // 检查projects表是否存在
      projectsTableExists = tables.includes('projects');
    }
    
    return NextResponse.json({
      databaseConnected: isConnected,
      tables,
      contactsTableExists,
      projectsTableExists,
      dbConfig: {
        // 显示数据库配置（不包含密码）
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
        database: process.env.PGDATABASE || 'postgres',
        user: process.env.PGUSER || 'postgres'
      }
    });
  } catch (error: any) {
    console.error('检查数据库状态失败:', error);
    return NextResponse.json(
      { 
        error: error.message || '检查数据库状态失败',
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 