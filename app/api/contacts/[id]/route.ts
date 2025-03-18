import { NextResponse } from 'next/server';
import { updateContactStatus } from '@/app/lib/contacts';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    if (!data.status || !['unread', 'read', 'replied'].includes(data.status)) {
      return NextResponse.json(
        { error: '无效的状态值' },
        { status: 400 }
      );
    }
    
    const success = await updateContactStatus(params.id, data.status);
    
    if (!success) {
      return NextResponse.json(
        { error: '更新状态失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('更新联系记录状态失败:', error);
    return NextResponse.json(
      { error: error.message || '更新状态失败' },
      { status: 500 }
    );
  }
} 