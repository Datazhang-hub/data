import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  try {
    // 将所有项目标记为精选
    const result = await query('UPDATE projects SET featured = true RETURNING *');
    
    return NextResponse.json({ 
      success: true, 
      message: `已将${result.rows.length}个项目标记为精选`, 
      projects: result.rows 
    });
  } catch (error: any) {
    console.error('标记精选项目失败:', error);
    return NextResponse.json(
      { error: error.message || '标记精选项目失败' },
      { status: 500 }
    );
  }
} 