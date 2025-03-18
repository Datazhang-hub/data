import { NextResponse } from 'next/server';
import { fixTableStructure, initDatabase } from '@/app/lib/db';

export async function GET() {
  try {
    console.log('开始修复数据库...');
    
    // 首先修复表结构
    const fixResult = await fixTableStructure();
    if (!fixResult.success) {
      return NextResponse.json(
        { error: fixResult.message },
        { status: 500 }
      );
    }
    
    // 然后重新初始化数据库（初始数据等）
    const initResult = await initDatabase();
    if (!initResult.success) {
      return NextResponse.json(
        { error: initResult.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '数据库修复成功',
      fix: fixResult,
      init: initResult
    });
  } catch (error: any) {
    console.error('数据库修复失败:', error);
    return NextResponse.json(
      { error: error.message || '数据库修复失败' },
      { status: 500 }
    );
  }
} 